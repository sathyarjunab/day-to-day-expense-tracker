document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://localhost:3000/expenses";
  let expenses = [];
  let ispremium;
  let currentPage = 1;
  // const itemsPerPage =1;
  const expenseForm = document.getElementById("expenseForm");
  const expenseList = document.querySelector(".ulist");
  const paginationControls = document.querySelector(".pagination");
  const pre = document.querySelector(".premium");
  const itemsPerPageSelect = document.querySelector("#itemsPerPageSelect");

  const token = localStorage.getItem("token");
  let totalP = 0;

  itemsPerPageSelect.addEventListener("change", (e) => {
    const limit = parseInt(itemsPerPageSelect.value);
    localStorage.setItem("limit", limit);
    fetchExpenses();
  });

  async function fetchExpenses(page = 1) {
    try {
      let itemsPerPage = localStorage.getItem("limit")
        ? localStorage.getItem("limit")
        : 1;
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
    const h1 = document.createElement("h1");
    h1.innerText = "EXPENSES";
    expenseList.innerHTML = "";
    if (expenses.length > 0) {
      expenseList.append(h1);
    }
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
    if (ispremium) {
      pre.innerHTML = `you are a premium user <button type="SHOW LEADER BOARD" class="leaderboardbtn">SHOW LEADER BOARD</button>`;
      const leaderBoardbtn = document.querySelector(".leaderboardbtn");
      leaderBoardbtn.addEventListener("click", scoreBoard);
    } else {
      pre.innerHTML = `<button type="submit" class="buy">BUY PREMIUM</button>`;
      const buy = document.querySelector(".buy");
      buy.addEventListener("click", razorPay);
    }
  }

  function renderPagination() {
    paginationControls.innerHTML = ""; // Clear existing buttons

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalP, startPage + 2);

    // Adjust startPage if we're at the end of the range
    if (endPage - startPage < 3) {
      startPage = Math.max(1, endPage - 3);
    }

    // Previous Button
    if (currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Prev";
      prevButton.addEventListener("click", () =>
        fetchExpenses(currentPage - 1)
      );
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
      nextButton.addEventListener("click", () =>
        fetchExpenses(currentPage + 1)
      );
      paginationControls.appendChild(nextButton);
    }
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
          headers: { "Content-Type": "application/json", authorization: token },
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
      await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          authorization: token,
        },
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  }

  async function razorPay(e) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl + "/purchase/premiummembership"}`,
        {
          headers: { authorization: token },
        }
      );
      const res = await response.json();
      console.log(response);
      const options = {
        key: res.key_id,
        order_id: res.order.id,
        handler: async function (result) {
          const response = await fetch(
            `${apiUrl + "/purchase/updatetransactionstatus"}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
              body: JSON.stringify({
                order_id: result.razorpay_order_id,
                payment_id: result.razorpay_payment_id,
              }),
            }
          );
          responseObject = await response.json();
          localStorage.setItem("token", responseObject.token);
          alert("you are a premium user now");
          fetchExpenses();
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
      // e.preventDefault();
      rzp1.on("payment.failed", function (result) {
        console.log(result);
        alert("Somthing went wrong");
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function scoreBoard(e) {
    try {
      const board = document.querySelector(".leaderboard");
      board.innerHTML = "";
      const list = await fetch(`${apiUrl + "/premium/showLeaderBoard"}`, {
        headers: {
          authorization: token,
        },
      });
      const listArray = await list.json();
      console.log(listArray);
      let header = document.createElement("h1");
      header.innerText = "LEADER BOARD";
      board.append(header);
      listArray.forEach((eliment) => {
        let list = document.createElement("li");
        list.innerText = `Name - ${eliment.user_Name} Toatal Expense - ${eliment.totalExpenses}`;
        board.append(list);
      });
    } catch (err) {
      console.log(err);
    }
  }
  expenseForm.addEventListener("submit", addOrUpdateExpense);
  fetchExpenses();
});
