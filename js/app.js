// Added handler events to check input in the "base currency" and "target currency" fields
document
  .getElementById("base-currency")
  .addEventListener("input", validateCurrencyInput);
document
  .getElementById("target-currency")
  .addEventListener("input", validateCurrencyInput);
// Function for checking input, only allows letters
function validateCurrencyInput(event) {
  const input = event.target;
  input.value = input.value.replace(/[^a-zA-Z]/g, "");
}

// Function to find a currency rate in the currencyRates array

function findCurrencyRate(baseCurrency, targetCurrency, isSearch) {
  const rate = currencyRates.find((rate) =>
    isSearch
      ? rate.baseCurrency === baseCurrency ||
        rate.targetCurrency === targetCurrency
      : rate.baseCurrency === baseCurrency &&
        rate.targetCurrency === targetCurrency
  );

  return rate ? rate : null;
}

// Array to store currency rates
let currencyRates = [];

// function  to show message
function displayMessage(message, isSuccess = true) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;

  // Setting color if succes it will be green if error - red
  if (isSuccess) {
    messageDiv.style.color = "green";
  } else {
    messageDiv.style.color = "red";
  }

  messageDiv.style.fontWeight = "bold";

  // after 5 seconds removing message
  setTimeout(function () {
    messageDiv.textContent = "";
  }, 3000);
}

// Function for adding a new exchange rate
function handleAddRateForm(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the value of the base currency from the input field
  const baseCurrency = document
    .getElementById("base-currency")
    .value.trim()
    .toUpperCase();

  // Get the value of the target currency from the input field
  const targetCurrency = document
    .getElementById("target-currency")
    .value.trim()
    .toUpperCase();

  // Get the value of the exchange rate from the input field
  const exchangeRate = parseFloat(
    document.getElementById("exchange-rate").value
  );

  // Find an existing rate if it exists
  const existingRate = findCurrencyRate(baseCurrency, targetCurrency, false);

  // If the rate exists, show an error message
  if (existingRate) {
    displayMessage(
      `Exchange rate from ${baseCurrency} to ${targetCurrency} already exists.`,
      false
    );
    return;
  }

  // Add the new rate to the currencyRates array
  currencyRates.push({ baseCurrency, targetCurrency, exchangeRate });

  // Reset the form fields
  event.target.reset();

  // Update the displayed rates
  renderCurrencyGrid();

  // Show success message
  displayMessage(
    `Exchange rate from ${baseCurrency} to ${targetCurrency} added successfully!`
  );
  console.log(
    `Exchange rate from ${baseCurrency} to ${targetCurrency} added successfully!`
  );
}

// Function to update the rates display
function renderCurrencyGrid() {
  const currencyGrid = document.getElementById("currency-grid");

  // Clear the existing content
  currencyGrid.innerHTML = "";

  // Loop through each rate and add it to the grid
  currencyRates.forEach((rate) => {
    const rateItem = document.createElement("div");
    rateItem.classList.add("rate-item");

    rateItem.innerHTML = `
      <p><strong>Base Currency:</strong> ${rate.baseCurrency}</p>
      <p><strong>Target Currency:</strong> ${rate.targetCurrency}</p>
      <p><strong>Exchange Rate:</strong> ${rate.exchangeRate}</p>
    `;

    currencyGrid.appendChild(rateItem);
  });
}

// Function for converting currency
function handleConvertForm(event) {
  event.preventDefault();

  // Get the value of the from currency from the input field
  const fromCurrency = document
    .getElementById("from-currency")
    .value.trim()
    .toUpperCase();

  // Get the value of the to currency from the input field
  const toCurrency = document
    .getElementById("to-currency")
    .value.trim()
    .toUpperCase();

  // Get the value of the amount from the input field
  const amount = parseFloat(document.getElementById("amount").value);

  // Find the rate
  const rate = findCurrencyRate(fromCurrency, toCurrency, false);

  // Find the reverse rate (toCurrency to fromCurrency)
  const reverseRate = findCurrencyRate(toCurrency, fromCurrency);

  // Calculate the converted amount
  let convertedAmount;
  if (rate) {
    convertedAmount = amount * rate.exchangeRate;
    displayMessage(
      `${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(
        2
      )} ${toCurrency}`
    );
  } else if (reverseRate) {
    convertedAmount = amount / reverseRate.exchangeRate;
    displayMessage(
      `${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(
        2
      )} ${toCurrency}`
    );
  } else {
    displayMessage(
      `Exchange rate from ${fromCurrency} to ${toCurrency} not found.`,
      false
    );
  }

  console.log(
    `${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(
      2
    )} ${toCurrency}`
  );
}

// Function for updating an existing rate
function handleUpdateRateForm(event) {
  event.preventDefault();

  // Get the value of the base currency from the input field
  const baseCurrency = document
    .getElementById("update-base-currency")
    .value.trim()
    .toUpperCase();

  // Get the value of the target currency from the input field
  const targetCurrency = document
    .getElementById("update-target-currency")
    .value.trim()
    .toUpperCase();

  // Get the value of the new exchange rate from the input field
  const newExchangeRate = parseFloat(
    document.getElementById("update-exchange-rate").value
  );

  // Find the rate
  const rate = findCurrencyRate(baseCurrency, targetCurrency, false);

  // If rate not found, show an error message
  if (!rate) {
    displayMessage(
      `Exchange rate from ${baseCurrency} to ${targetCurrency} not found.`,
      false
    );
    return;
  }

  // Update the rate
  rate.exchangeRate = newExchangeRate;

  // Reset the form fields
  event.target.reset();

  // Update the displayed rates
  renderCurrencyGrid();

  // Show success message
  displayMessage(
    `Exchange rate from ${baseCurrency} to ${targetCurrency} updated successfully!`
  );
  console.log(
    `Exchange rate from ${baseCurrency} to ${targetCurrency} updated successfully!`
  );
}

// Function to handle search form
function handleSearchForm(event) {
  event.preventDefault();

  const fromCurrency = document
    .getElementById("search-from")
    .value.trim()
    .toUpperCase();
  const toCurrency = document
    .getElementById("search-to")
    .value.trim()
    .toUpperCase();

  // Find the rate using the new function
  let ratesList = [];
  if (fromCurrency && toCurrency) {
    ratesList.push(findCurrencyRate(fromCurrency, toCurrency, true));
  } else if (fromCurrency && !toCurrency) {
    ratesList = [...currencyRates].filter(
      (rate) => rate.baseCurrency === fromCurrency
    );
  } else {
    ratesList = [...currencyRates]
      .filter((rate) => rate.targetCurrency === toCurrency)
      .map((rate) => ({
        baseCurrency: rate.targetCurrency,
        exchangeRate: (1 / rate.exchangeRate).toFixed(2),
        targetCurrency: rate.baseCurrency,
      }));
  }
  let text = "";
  for (const rate of ratesList) {
    console.log(rate);
    text += `1 ${rate.baseCurrency} = ${rate.exchangeRate} ${rate.targetCurrency}\n`;
  }

  const searchResult = document.getElementById("search-result");

  if (ratesList.length) {
    searchResult.innerHTML = text;
    searchResult.style.color = "green";
  } else {
    searchResult.innerHTML = `Exchange rate from ${fromCurrency} to ${toCurrency} not found.`;
    searchResult.style.color = "red";
  }

  // Remove the search result after 3 seconds
  setTimeout(function () {
    console.log(searchResult);
    searchResult.innerHTML = "";
  }, 30000);
}

// Adding event listeners to forms
document
  .getElementById("add-rate-form")
  .addEventListener("submit", handleAddRateForm);

document
  .getElementById("convert-form")
  .addEventListener("submit", handleConvertForm);

document
  .getElementById("update-rate-form")
  .addEventListener("submit", handleUpdateRateForm);

document
  .getElementById("search-form")
  .addEventListener("submit", handleSearchForm);
