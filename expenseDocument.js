document.addEventListener("DOMContentLoaded", () => {
  const filterType = document.getElementById("filterType");
  const monthSelector = document.getElementById("monthSelector");
  const monthDropdown = document.getElementById("month");
  const expenseList = document.getElementById("expenseList");
  const totalIncomeElem = document.getElementById("totalIncome");
  const totalExpenseElem = document.getElementById("totalExpense");

  // Populate month dropdown
  const populateMonthDropdown = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    monthDropdown.innerHTML = months
      .map((month, index) => `<option value="${index + 1}">${month}</option>`)
      .join("");
  };

  // Fetch expenses based on selected filter type
  const fetchExpenses = async (period, month) => {
    try {
      const url =
        period === "weekly" && month
          ? `http://localhost:3000/expenses?period=${period}&month=${month}`
          : `http://localhost:3000/expenses?period=${period}`;
      const response = await fetch(url);
      const data = await response.json();
      updateUI(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Update the UI with fetched data
  const updateUI = (data) => {
    let totalIncome = 0;
    let totalExpense = 0;
    expenseList.innerHTML = ""; // Clear the current list

    data.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.date} - ${item.description}: ${item.amount} (${item.type})`;
      expenseList.appendChild(listItem);

      if (item.type === "income") {
        totalIncome += item.amount;
      } else if (item.type === "expense") {
        totalExpense += item.amount;
      }
    });

    totalIncomeElem.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpenseElem.textContent = `$${totalExpense.toFixed(2)}`;
  };

  // Event listener for filter change
  filterType.addEventListener("change", (event) => {
    const period = event.target.value;
    if (period === "weekly") {
      monthSelector.classList.remove("hidden");
      populateMonthDropdown();
    } else {
      monthSelector.classList.add("hidden");
      fetchExpenses(period);
    }
  });

  // Event listener for month selection change
  monthDropdown.addEventListener("change", (event) => {
    fetchExpenses("weekly", event.target.value);
  });

  // Initial fetch for daily data
  fetchExpenses("daily");
});
