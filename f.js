const apiUrl = "http://localhost:3000/expenses";
const token = localStorage.getItem("token");
const itemsPerPage = 1;
let expenses = [];
let totalP = 0;
let ispremium = false;
let currentPage = 1;

const expensesList = document.querySelector(".ulist");
const paginationControls = document.querySelector(".pagination");

async function fetchExpenses(page = 1) {
  try {
    const response = await fetch(
      `${apiUrl}?page=${page}&limit=${itemsPerPage}`,
      {
        headers: { authorization: token },
      }
    );
    const { res, premium, totalPages } = await response.json();
    totalP = totalPages;
    expenses = res;
    ispremium = premium;
    currentPage = page;

    renderExpenses();
    renderPagination();
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

function renderExpenses() {
  expensesList.innerHTML = ""; // Clear the list
  expenses.forEach((expense) => {
    const expenseItem = document.createElement("li");
    expenseItem.textContent = `${expense.description} - ${expense.amount} - ${expense.date}`;
    expensesList.appendChild(expenseItem);
  });
}

function renderPagination() {
  paginationControls.innerHTML = ""; // Clear existing buttons

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalP, startPage + 3);

  // Adjust startPage if we're at the end of the range
  if (endPage - startPage < 3) {
    startPage = Math.max(1, endPage - 3);
  }

  // Previous Button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Prev";
    prevButton.addEventListener("click", () => fetchExpenses(currentPage - 1));
    paginationControls.appendChild(prevButton);
  }

  // Page Number Buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = i === currentPage ? "active" : "";
    pageButton.addEventListener("click", () => fetchExpenses(i));
    paginationControls.appendChild(pageButton);
  }

  // Next Button
  if (currentPage < totalP) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => fetchExpenses(currentPage + 1));
    paginationControls.appendChild(nextButton);
  }
}

// Initial fetch of expenses
fetchExpenses();
