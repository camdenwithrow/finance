"use strict";

const worth = document.getElementById("net-worth");
const budget = document.getElementById("budget");
const transactions = document.getElementById("transactions");

function formatAsDollar(num) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

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

  worth.innerHTML = formatAsDollar(total);
}

function getBudgets(categories) {
  Object.keys(categories).forEach((key) => {
    const id = categories[key]["id"];
    const name = key;
    const budgetedNum = categories[key]["budgeted"];
    const actualNum = categories[key]["actual"];

    const item = document.createDocumentFragment();

    const budgetItemContainer = document.createElement("div");
    const budgetItem = document.createElement("div");
    const button = document.createElement("button");
    const icon = document.createElement("div");
    const category = document.createElement("p");
    const budgetAmt = document.createElement("p");
    const actualAmt = document.createElement("p");

    item.appendChild(budgetItemContainer);

    budgetItemContainer.appendChild(budgetItem);

    budgetItem.appendChild(button);
    budgetItem.appendChild(category);
    budgetItem.appendChild(budgetAmt);
    budgetItem.appendChild(actualAmt);

    button.appendChild(icon);

    budgetItemContainer.setAttribute("id", id);
    budgetItemContainer.classList.add("budget-item-container");
    budgetItem.classList.add("budget-item");
    button.classList.add("expand-budget");
    icon.classList.add("arrow", "right");
    category.classList.add("category");
    budgetAmt.classList.add("budget-amt");
    actualAmt.classList.add("actual-amt");

    category.innerText = name;
    actualAmt.innerText = formatAsDollar(actualNum);
    budgetAmt.innerText = formatAsDollar(budgetedNum);

    budget.appendChild(item);
  });
}

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
