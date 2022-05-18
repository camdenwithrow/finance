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
    const actionItem = document.createDocumentFragment();
    const categoryDiv = document.createElement("div");
    const budgetAmtDiv = document.createElement("div");
    const actualAmtDiv = document.createElement("div");
    const category = document.createElement("p");
    const budgetAmt = document.createElement("p");
    const actualAmt = document.createElement("p");

    const subCategories = categories[key]["subCategories"];
    const subBudgetContainer = document.createElement("div");

    console.log(subCategories);

    if (Object.keys(subCategories).length > 0) {
      const button = document.createElement("button");
      const icon = document.createElement("div");
      actionItem.appendChild(button);
      button.appendChild(icon);
      button.classList.add("expand-budget");
      icon.classList.add("arrow", "right");
      button.addEventListener("click", dropdown);

      Object.keys(subCategories).forEach((key) => {
        const name = key;
        const subBudgetedNum = subCategories[key]["budgeted"];
        const subActualNum = subCategories[key]["actual"];

        const subBudget = document.createElement("div");
        const placeholder = document.createElement("div");
        const subCategoryDiv = document.createElement("div");
        const subBudgetAmtDiv = document.createElement("div");
        const subActualAmtDiv = document.createElement("div");
        const subCategory = document.createElement("p");
        const subBudgetAmt = document.createElement("p");
        const subActualAmt = document.createElement("p");

        subBudgetContainer.appendChild(subBudget);
        subBudget.appendChild(placeholder);
        subBudget.appendChild(subCategoryDiv);
        subBudget.appendChild(subBudgetAmtDiv);
        subBudget.appendChild(subActualAmtDiv);

        subCategoryDiv.appendChild(subCategory);
        subBudgetAmtDiv.appendChild(subBudgetAmt);
        subActualAmtDiv.appendChild(subActualAmt);

        subBudgetContainer.classList.add("sub-budget-container", "sub-hidden");
        subBudget.classList.add("sub-budget");
        subCategory.classList.add("category");
        subBudgetAmtDiv.classList.add("text-right");
        subActualAmtDiv.classList.add("text-right");

        subCategory.innerText = name;
        subActualAmt.innerText = formatAsDollar(subActualNum);
        subBudgetAmt.innerText = formatAsDollar(subBudgetedNum);
      });
    } else {
      const emptyAction = document.createElement("div");
      actionItem.appendChild(emptyAction);
    }

    fragment.appendChild(budgetItemContainer);
    budgetItemContainer.appendChild(budgetItem);
    budgetItemContainer.appendChild(subBudgetContainer);

    budgetItem.appendChild(actionItem);
    budgetItem.appendChild(categoryDiv);
    budgetItem.appendChild(budgetAmtDiv);
    budgetItem.appendChild(actualAmtDiv);

    categoryDiv.appendChild(category);
    budgetAmtDiv.appendChild(budgetAmt);
    actualAmtDiv.appendChild(actualAmt);

    budgetItemContainer.classList.add("budget-item-container");

    budgetItem.setAttribute("id", id);
    budgetItem.classList.add("budget-item");
    budgetAmtDiv.classList.add("text-right");
    actualAmtDiv.classList.add("text-right");
    category.classList.add("category");
    budgetAmt.classList.add("budget-amt");
    actualAmt.classList.add("actual-amt");

    category.innerText = name;
    actualAmt.innerText = formatAsDollar(actualNum);
    budgetAmt.innerText = formatAsDollar(budgetedNum);

    budget.appendChild(fragment);
  });
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
    checkbox.setAttribute("name", "select-transaction");
    checkbox.setAttribute("value", id);

    dateField.innerText = date;
    nameField.innerText = name;
    categoryField.innerText = category;
    amountField.innerText = amount;

    transactions.appendChild(transact);
  });
}

function editTransactions() {
  const checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=select-transaction]"
  );
  let enabledSettings = [];

  // Use Array.forEach to add an event listener to each checkbox.
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      enabledSettings = Array.from(checkboxes)
        .filter((i) => i.checked)
        .map((i) => i.value);
    });
  });

  return enabledSettings;
}

function sortData(data) {
  getNetWorth(data.worth);
  getBudgets(data.budgetCategories);
  getTransactions(data.transactions);
}

function main(data) {
  sortData(data);
  const checkedIds = editTransactions();
}

fetch("./data.json")
  .then((response) => {
    return response.json();
  })
  .then((resp) => main(resp));
