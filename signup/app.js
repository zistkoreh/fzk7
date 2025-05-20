const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

document.addEventListener("DOMContentLoaded", function () {
  if (
    localStorage.getItem("zistFirstName") &&
    localStorage.getItem("zistLastName")
  ) {
    window.location.href = "./dashboard/dashboard.html";
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formFirstName = firstName.value.trim();
    const formLastName = lastName.value.trim();

    if (formFirstName === "" || formLastName === "") {
      showError("تمامی ورودی ها را وارد کنید");
      return;
    }

    localStorage.setItem("zistFirstName", formFirstName);
    localStorage.setItem("zistLastName", formLastName);
    console.log(formFirstName, formLastName);
    window.location.href = "./dashboard/dashboard.html";
  });
});

function showError(message) {
  loginError.textContent = message;
  setTimeout(() => (loginError.textContent = ""), 3000);
}
