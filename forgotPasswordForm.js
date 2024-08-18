const form = document.querySelector(".forgotPasswordForm");
const apiUrl = "http://localhost:3000";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.emailId.value;
  const res = await fetch(`${apiUrl}/password/forgotpassword`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify({ Email: email }),
  });
  console.log(res);
});
