const signupForm = document.querySelector(".Signup");
const login = document.querySelector(".login");
const apiUrl = "http://localhost:3000/";

signupForm.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    const signupCredentials = {
      userName: signupForm.userName.value,
      email: signupForm.email.value,
      password: signupForm.password.value,
    };
    let response = await fetch(`${apiUrl + "signup"}`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(signupCredentials),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Signup successful:", data);
    } else {
      console.log("Signup failed:", response.statusText);
    }
  } catch (err) {
    console.log(err);
  }
});

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
    if (response.ok) {
      const data = await response.json();
      console.log("loged in  successful:", data);
    } else {
      console.log("login failed:", response.statusText);
    }
  } catch (err) {
    console.log(err);
  }
});
