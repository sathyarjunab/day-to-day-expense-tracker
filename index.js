const signupForm = document.querySelector(".Signup");
const apiUrl = "http://localhost:3000/";

signupForm.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    const signupCredentials = {
      userName: signupForm.userName.value,
      email: signupForm.email.value,
      password: signupForm.password.value,
    };
    let response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(signupCredentials),
    });
  } catch (err) {
    console.log(err);
  }
});
