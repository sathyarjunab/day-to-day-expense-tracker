document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://localhost:3000/expenses";
  let expenses = [];

  const expenseForm = document.getElementById("expenseForm");
  const expenseList = document.querySelector(".ulist");

  async function fetchExpenses() {
    try {
      const response = await fetch(apiUrl);
      expenses = await response.json();
      renderExpenses();
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }

  function renderExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.textContent = `${expense.amount} - ${expense.description} - ${expense.category}`;
      const editButton = document.createElement("button");
      editButton.textContent = "Edit Expense";
      editButton.onclick = () => editExpense(expense.id);
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete Expense";
      deleteButton.onclick = () => deleteExpense(expense.id);
      li.appendChild(editButton);
      li.appendChild(deleteButton);
      li.dataset.id = expense.id;
      expenseList.appendChild(li);
    });
  }

  async function addOrUpdateExpense(event) {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    const expenseData = { amount, description, category };
    const id = expenseForm.dataset.id;
    try {
      if (id) {
        await fetch(`${apiUrl}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseData),
        });
        delete expenseForm.dataset.id;
      } else {
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseData),
        });
      }
      expenseForm.reset();
      fetchExpenses();
    } catch (error) {
      console.error("Error adding/updating expense:", error);
    }
  }

  async function editExpense(id) {
    try {
      const response = await fetch(`${apiUrl}/${id}`);
      const expense = await response.json();
      document.getElementById("amount").value = expense.amount;
      document.getElementById("description").value = expense.description;
      document.getElementById("category").value = expense.category;
      expenseForm.dataset.id = id;
    } catch (error) {
      console.error("Error fetching expense for edit:", error);
    }
  }

  async function deleteExpense(id) {
    try {
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  }

  expenseForm.addEventListener("submit", addOrUpdateExpense);

  fetchExpenses();
});
