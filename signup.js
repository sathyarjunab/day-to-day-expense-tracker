const signupForm = document.querySelector(".Signup");
const apiUrl = "http://localhost:3000/";

console.log(signupForm);

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
      window.location.href = "/login.html";
    } else {
      console.log("Signup failed:", response.statusText);
    }
  } catch (err) {
    console.log(err);
  }
});
