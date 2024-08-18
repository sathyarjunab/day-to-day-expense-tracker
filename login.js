const apiUrl = "http://localhost:3000/";
const login = document.querySelector(".login");
const forgetPassword = document.querySelector(".fp");

login.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    const loginCredentials = {
      email: login.email.value,
      password: login.password.value,
    };
    let response = await fetch(`${apiUrl + "login"}`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(loginCredentials),
    });
    const data = await response.json();
    if (response.ok) {
      const ul = document.querySelector(".errorList");
      ul.innerHTML = "";
      console.log("loged in  successful:", data);
      localStorage.setItem("token", data.token);
      alert("loged in succesfully");
      window.location.href = "/expenseTracker.html";
    } else {
      console.log("login failed:", data.message);
      const ul = document.querySelector(".errorList");
      ul.innerHTML = "";
      const list = document.createElement("li");
      list.textContent = data.message;
      ul.appendChild(list);
    }
  } catch (err) {
    console.log(err);
  }
});

forgetPassword.addEventListener("click", (e) => {
  window.location.href = "/forgotPasswordForm.html";
});
