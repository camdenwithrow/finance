"use strict";

const worth = document.getElementById("net-worth");
const budget = document.getElementById("budget");
const transactions = document.getElementById("transactions");

function getNetWorth(values) {
  let total = 0;
  Object.keys(values).forEach((key) => {
    try {
      total += values[key];
    } catch (error) {
      console.log({
        message: `Couldn't add ${values[key]} to total because of error:`,
        error: error,
      });
    }
  });

  const totalInDollars = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });


  worth.innerHTML = totalInDollars.format(total);;
}

function getBudgets(categories) {}

function getTransactions(transactions) {}

function sortData(data) {
  getNetWorth(data.worth);
  getBudgets(data.budgetCategories);
  getTransactions(data.transactions);
}

fetch("./data.json")
  .then((response) => {
    return response.json();
  })
  .then((resp) => sortData(resp));
