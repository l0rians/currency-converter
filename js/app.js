// Added handler events to check input in the "base currency" and "target currency" fields
document
  .getElementById("base-currency")
  .addEventListener("input", validateCurrencyInput);
document
  .getElementById("target-currency")
  .addEventListener("input", validateCurrencyInput);

// Fetches the latest currency rates from a remote JSON file and updates the currency grid
async function fetchCurrencyRates() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/l0rians/l0rians.github.io/main/data/currency-rates.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    currencyRates = data;
    renderCurrencyGrid();
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchCurrencyRates);

// Function for checking input, only allows letters
function validateCurrencyInput(event) {
  const input = event.target;
  input.value = input.value.replace(/[^a-zA-Z]/g, "");
}

// Function to find a currency rate in the currencyRates array
function findCurrencyRate(baseCurrency, targetCurrency, isSearch = false) {
  if (isSearch) {
    return currencyRates.find(
      (rate) =>
        (rate.baseCurrency === baseCurrency &&
          rate.targetCurrency === targetCurrency) ||
        (rate.baseCurrency === targetCurrency &&
          rate.targetCurrency === baseCurrency)
    );
  } else {
    return currencyRates.find(
      (rate) =>
        rate.baseCurrency === baseCurrency &&
        rate.targetCurrency === targetCurrency
    );
  }
}

// Array to store currency rates
let currencyRates = [];

// Function to show message
function displayMessage(message, isSuccess = true) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;

  // Setting color: green for success, red for error
  messageDiv.style.color = isSuccess ? "green" : "red";
  messageDiv.style.fontWeight = "bold";

  // Clear message after 3 seconds
  setTimeout(function () {
    messageDiv.textContent = "";
  }, 3000);
}

// Function for adding a new exchange rate
function handleAddRateForm(event) {
  event.preventDefault(); // Prevent default form submission

  // Get base currency value
  const baseCurrency = document
    .getElementById("base-currency")
    .value.trim()
    .toUpperCase();

  // Get target currency value
  const targetCurrency = document
    .getElementById("target-currency")
    .value.trim()
    .toUpperCase();

  // Get exchange rate value
  const exchangeRate = parseFloat(
    document.getElementById("exchange-rate").value
  );

  // Check if rate already exists
  const existingRate = findCurrencyRate(baseCurrency, targetCurrency, false);

  // Show error if rate exists
  if (existingRate) {
    displayMessage(
      `Exchange rate from ${baseCurrency} to ${targetCurrency} already exists.`,
      false
    );
    return;
  }

  // Add new rate to currencyRates array
  currencyRates.push({ baseCurrency, targetCurrency, exchangeRate });

  // Reset form fields
  event.target.reset();

  // Update displayed rates
  renderCurrencyGrid();

  // Show success message
  displayMessage(
    `Exchange rate from ${baseCurrency} to ${targetCurrency} added successfully!`
  );
}

// Function to update displayed rates
function renderCurrencyGrid() {
  const currencyGrid = document.getElementById("currency-grid");
  currencyGrid.innerHTML = ""; // Clear existing content

  // Loop through rates and add to grid
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

  // Get from currency value
  const fromCurrency = document
    .getElementById("from-currency")
    .value.trim()
    .toUpperCase();

  // Get to currency value
  const toCurrency = document
    .getElementById("to-currency")
    .value.trim()
    .toUpperCase();

  // Get amount value
  const amount = parseFloat(document.getElementById("amount").value);

  // Find rate
  const rate = findCurrencyRate(fromCurrency, toCurrency, false);

  // Find reverse rate
  const reverseRate = findCurrencyRate(toCurrency, fromCurrency);

  // Calculate converted amount
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
}

// Function for updating existing rate
function handleUpdateRateForm(event) {
  event.preventDefault();

  // Get base currency value
  const baseCurrency = document
    .getElementById("update-base-currency")
    .value.trim()
    .toUpperCase();

  // Get target currency value
  const targetCurrency = document
    .getElementById("update-target-currency")
    .value.trim()
    .toUpperCase();

  // Get new exchange rate value
  const newExchangeRate = parseFloat(
    document.getElementById("update-exchange-rate").value
  );

  // Find rate
  const rate = findCurrencyRate(baseCurrency, targetCurrency, false);

  // Show error if rate not found
  if (!rate) {
    displayMessage(
      `Exchange rate from ${baseCurrency} to ${targetCurrency} not found.`,
      false
    );
    return;
  }

  // Update rate
  rate.exchangeRate = newExchangeRate;

  // Reset form fields
  event.target.reset();

  // Update displayed rates
  renderCurrencyGrid();

  // Show success message
  displayMessage(
    `Exchange rate from ${baseCurrency} to ${targetCurrency} updated successfully!`
  );
}

// Function for handling search form
function handleSearchForm(event) {
  event.preventDefault();

  // Get from currency value
  const fromCurrency = document
    .getElementById("search-from")
    .value.trim()
    .toUpperCase();

  // Get to currency value
  const toCurrency = document
    .getElementById("search-to")
    .value.trim()
    .toUpperCase();

  // Find rate using updated function
  let ratesList = [];
  if (fromCurrency && toCurrency) {
    ratesList.push(findCurrencyRate(fromCurrency, toCurrency, true));
  } else if (fromCurrency && !toCurrency) {
    ratesList = currencyRates.filter(
      (rate) => rate.baseCurrency === fromCurrency
    );
  } else {
    ratesList = currencyRates
      .filter((rate) => rate.targetCurrency === toCurrency)
      .map((rate) => ({
        baseCurrency: rate.targetCurrency,
        exchangeRate: (1 / rate.exchangeRate).toFixed(2),
        targetCurrency: rate.baseCurrency,
      }));
  }

  // Prepare search result text
  let text = "";
  for (const rate of ratesList) {
    text += `1 ${rate.baseCurrency} = ${rate.exchangeRate} ${rate.targetCurrency}\n`;
  }

  // Display search result or error message
  const searchResult = document.getElementById("search-result");
  if (ratesList.length) {
    searchResult.innerHTML = text;
    searchResult.style.color = "green";
  } else {
    searchResult.innerHTML = `Exchange rate from ${fromCurrency} to ${toCurrency} not found.`;
    searchResult.style.color = "red";
  }

  // Remove search result after 5 seconds
  setTimeout(function () {
    searchResult.innerHTML = "";
  }, 5000);
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

// Function for announcing market status
function marketStatusAnnouncement() {
  const now = new Date();
  const currentHour = now.getHours();

  // Market opening and closing times
  const marketOpenHour = 9; // 9AM
  const marketCloseHour = 17; // 5PM

  // Check current hour and display status
  if (currentHour >= marketOpenHour && currentHour < marketCloseHour) {
    displayMarketStatus("Market is currently open!", "open");
  } else {
    displayMarketStatus("Market is currently closed.", "closed");
  }
}

// Function to display market status on the page
function displayMarketStatus(message, statusClass) {
  const marketStatusElement = document.getElementById("market-status");
  marketStatusElement.textContent = message;
  marketStatusElement.className = "status " + statusClass;
}

// Function to check time and announce market status
function checkMarketStatus() {
  marketStatusAnnouncement(); // Check status immediately on page load

  // Schedule the check every minute afterwards
  setInterval(marketStatusAnnouncement, 60000); // Check every minute
}

// Start checking market status when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Start checking market status
  checkMarketStatus();
});

console.log(currencyRates);
