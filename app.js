"use strict";

const worth = document.getElementById("net-worth");
const budget = document.getElementById("budget");
const transactions = document.getElementById("transactions");

function dropdown(e) {
  // If unopened
  const arrow = e.target.firstChild;
  if (arrow.classList.contains("right")) {
    arrow.classList.add("down");
    arrow.classList.remove("right");
  } else {
    arrow.classList.add("right");
    arrow.classList.remove("down");
  }

  const id = e.target.parentElement.id;
}

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

    const fragment = document.createDocumentFragment();

    const budgetItemContainer = document.createElement("div");
    const budgetItem = document.createElement("div");
    const button = document.createElement("button");
    const icon = document.createElement("div");
    const category = document.createElement("p");
    const budgetAmt = document.createElement("p");
    const actualAmt = document.createElement("p");

    const subCategories = categories[key]["subCategories"];
    const subFragment = document.createDocumentFragment();
    if (subCategories !== {}) {
      Object.keys(subCategories).forEach((key) => {
        const name = key;
        const subBudgetedNum = subCategories[key]["budgeted"];
        const subActualNum = subCategories[key]["actual"];

        const subBudgetContainer = document.createElement("div");
        const subBudget = document.createElement("div");
        const placeholder = document.createElement("div");
        const subCategory = document.createElement("p");
        const subBudgetAmt = document.createElement("p");
        const subActualAmt = document.createElement("p");

        subFragment.appendChild(subBudgetContainer);
        subBudgetContainer.appendChild(subBudget);
        subBudget.appendChild(placeholder);
        subBudget.appendChild(subCategory);
        subBudget.appendChild(subBudgetAmt);
        subBudget.appendChild(subActualAmt);

        subBudgetContainer.classList.add("sub-budget-container");
        subBudget.classList.add("sub-budget", "sub-hidden");

        subCategory.innerText = name;
        subActualAmt.innerText = formatAsDollar(subActualNum);
        subBudgetAmt.innerText = formatAsDollar(subBudgetedNum);
      });
    }

    fragment.appendChild(budgetItemContainer);

    budgetItemContainer.appendChild(budgetItem);
    budgetItemContainer.appendChild(subFragment);

    budgetItem.appendChild(button);
    budgetItem.appendChild(category);
    budgetItem.appendChild(budgetAmt);
    budgetItem.appendChild(actualAmt);

    button.appendChild(icon);

    budgetItemContainer.classList.add("budget-item-container");

    budgetItem.setAttribute("id", id);
    budgetItem.classList.add("budget-item");
    button.classList.add("expand-budget");
    icon.classList.add("arrow", "right");
    category.classList.add("category");
    budgetAmt.classList.add("budget-amt");
    actualAmt.classList.add("actual-amt");

    category.innerText = name;
    actualAmt.innerText = formatAsDollar(actualNum);
    budgetAmt.innerText = formatAsDollar(budgetedNum);

    button.addEventListener("click", dropdown);

    budget.appendChild(fragment);
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
