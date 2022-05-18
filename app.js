"use strict";

const worth = document.getElementById("net-worth");
const budget = document.getElementById("budget");
const transactions = document.getElementById("transactions");

function dropdown(e) {
  const subCategories = e.target.parentElement.nextElementSibling;
  const arrow = e.target.firstChild;

  // If unopened
  if (arrow.classList.contains("right")) {
    arrow.classList.add("down");
    arrow.classList.remove("right");

    subCategories.classList.remove("sub-hidden");
    subCategories.style.height = "auto";

    const height = subCategories.clientHeight + "px";

    subCategories.style.height = "0px";

    setTimeout(() => {
      subCategories.style.height = height;
    }, 0);
  } else {
    arrow.classList.add("right");
    arrow.classList.remove("down");

    subCategories.style.height = "0px";
    subCategories.addEventListener(
      "transitionend",
      () => {
        subCategories.classList.add("sub-hidden");
      },
      { once: true }
    );
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
    const subBudgetContainer = document.createElement("div");
    if (subCategories !== {}) {
      Object.keys(subCategories).forEach((key) => {
        const name = key;
        const subBudgetedNum = subCategories[key]["budgeted"];
        const subActualNum = subCategories[key]["actual"];

        const subBudget = document.createElement("div");
        const placeholder = document.createElement("div");
        const subCategory = document.createElement("p");
        const subBudgetAmt = document.createElement("p");
        const subActualAmt = document.createElement("p");

        subBudgetContainer.appendChild(subBudget);
        subBudget.appendChild(placeholder);
        subBudget.appendChild(subCategory);
        subBudget.appendChild(subBudgetAmt);
        subBudget.appendChild(subActualAmt);

        subBudgetContainer.classList.add("sub-budget-container", "sub-hidden");
        subBudget.classList.add("sub-budget");

        subCategory.innerText = name;
        subActualAmt.innerText = formatAsDollar(subActualNum);
        subBudgetAmt.innerText = formatAsDollar(subBudgetedNum);
      });
    }

    fragment.appendChild(budgetItemContainer);

    budgetItemContainer.appendChild(budgetItem);
    budgetItemContainer.appendChild(subBudgetContainer);

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

{
  /* <div class="transact">
  <label class="check-container">
    <input type="checkbox" checked="checked" />
    <span class="checkmark"></span>
  </label>
  <div class="date">12/12</div>
  <div class="name">Chipotle</div>
  <div class="category">Restaurants</div>
  <div class="amount">$1000.59</div>
</div>; */
}

function getTransactions(transactionsList) {
  Object.keys(transactionsList).forEach((key) => {
    const id = transactionsList[key]["id"];
    const date = new Date(transactionsList[key]["date"]).toLocaleDateString(
      "en-us",
      { year: "2-digit", month: "numeric" }
    );
    const name = transactionsList[key]["name"];
    const category = transactionsList[key]["category"];
    const amount = transactionsList[key]["amount"];

    const transact = document.createElement("div");
    const checkContainer = document.createElement("label");
    const checkbox = document.createElement("input");
    const checkmark = document.createElement("span");
    const dateField = document.createElement("div");
    const nameField = document.createElement("div");
    const categoryField = document.createElement("div");
    const amountField = document.createElement("div");

    transact.appendChild(checkContainer);
    transact.appendChild(dateField);
    transact.appendChild(nameField);
    transact.appendChild(categoryField);
    transact.appendChild(amountField);

    checkContainer.appendChild(checkbox);
    checkContainer.appendChild(checkmark);

    transact.classList.add("transact");
    checkContainer.classList.add("check-container");
    checkbox.classList.add("checkbox");
    checkmark.classList.add("checkmark");
    dateField.classList.add("date");
    nameField.classList.add("name");
    categoryField.classList.add("category");
    amountField.classList.add("amount");

    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("checked", "checked");

    dateField.innerText = date;
    nameField.innerText = name;
    categoryField.innerText = category;
    amountField.innerText = amount;

    transactions.appendChild(transact);
  });
}

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
