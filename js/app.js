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

  // after 3 seconds removing message
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

  // Get the value of the exchange rate from the input field and convert it to a float
  const exchangeRate = parseFloat(
    document.getElementById("exchange-rate").value
  );

  // Find the rate object for the base currency, or create a new one if it doesn't exist
  let rateObject = currencyRates.find((rate) => rate.base === baseCurrency);

  if (!rateObject) {
    // If no rate object is found for the base currency
    rateObject = {
      // Create a new rate object
      timestamp: Date.now(), // Current timestamp
      base: baseCurrency, // Set the base currency
      date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      rates: {}, // Initialize an empty rates object
    };
    currencyRates.push(rateObject); // Add the new rate object to the currencyRates array
  }

  // Add or update the exchange rate for the target currency
  rateObject.rates[targetCurrency] = exchangeRate;

  // Log the current exchange rates array to the console
  console.log("Current exchange rates:", currencyRates);

  // Clear the form after submission
  document.getElementById("add-rate-form").reset();

  // Display success message
  displayMessage("Currency successfully added!", true);
}

// Function for converting currency
function handleConvertForm(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the amount to convert from the input field and convert it to a float
  const amount = parseFloat(document.getElementById("amount").value);

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

  // Find the rate object for the from currency
  const rateObject = currencyRates.find((rate) => rate.base === fromCurrency);

  if (rateObject && rateObject.rates[toCurrency]) {
    // If the rate object and the exchange rate for the to currency are found
    const exchangeRate = rateObject.rates[toCurrency]; // Get the exchange rate for the to currency
    const convertedAmount = amount * exchangeRate; // Calculate the converted amount

    // Log the conversion result to the console
    console.log(
      `Conversion: ${amount} ${fromCurrency} to ${convertedAmount.toFixed(
        2
      )} ${toCurrency}`
    );

    // Display success message
    displayMessage(
      `Conversion: ${amount} ${fromCurrency} to ${convertedAmount.toFixed(
        2
      )} ${toCurrency}`
    );
  } else {
    // If no rate is found for the conversion
    console.log("No rate found for this conversion");

    // Display error message
    displayMessage("No rate found for this conversion", false);
  }
}

// Function for updating existing exchange rate
function handleUpdateRateForm(event) {
  event.preventDefault(); // Prevent the default form submission behavior

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

  // Get the value of the new exchange rate from the input field and convert it to a float
  const newExchangeRate = parseFloat(
    document.getElementById("update-exchange-rate").value
  );

  // Find the rate object for the base currency
  const rateObject = currencyRates.find((rate) => rate.base === baseCurrency);

  if (rateObject && rateObject.rates[targetCurrency]) {
    // If the rate object and the exchange rate for the target currency are found
    rateObject.rates[targetCurrency] = newExchangeRate; // Update the exchange rate

    // Log the updated exchange rates array to the console
    console.log("Updated exchange rates:", currencyRates);

    // Display success message
    displayMessage("Exchange rate successfully updated!", true);
  } else {
    // If no rate is found for the update
    console.log("Rate not found. Please add it first.");

    // Display error message
    displayMessage("Rate not found. Please add it first.", false);
  }

  // Clear the form after submission
  document.getElementById("update-rate-form").reset();
}

// Add event listeners to the forms after the page loads
document
  .getElementById("add-rate-form")
  .addEventListener("submit", handleAddRateForm);
document
  .getElementById("convert-form")
  .addEventListener("submit", handleConvertForm);
document
  .getElementById("update-rate-form")
  .addEventListener("submit", handleUpdateRateForm);
