//show modal connect
const registerUserModalBtn = document.querySelector(".registerUser-modal");
const modal = document.querySelector(".modal");

// ?register  connect

const userNameInp = document.querySelector("#username");
const emailInp = document.querySelector("#email");
const ageInp = document.querySelector("#age");
const passwordInp = document.querySelector("#password");
const passwordConfirmInp = document.querySelector("#passwordConfirm");
const registerForm = document.querySelector("#registerUser-form");
const USERS_API = "http://localhost:8000/users";

const registerCancel = document.querySelector(".modal button[type='reset']");

//? login connect
const loginBtn = document.querySelector(".loginUser-modal");
const loginModal = document.querySelector(".login-modal");
const loginForm = document.querySelector("#loginUser-form");
const logUserInp = document.querySelector("#username-login");
const logPasswordInp = document.querySelector("#password-login");

// ?modal logic

function showModal() {
  if (!modal.classList.contains("show")) {
    modal.style.display = "block";
    setTimeout(function () {
      modal.classList.add("show");
    }, 10);
  } else {
    modal.classList.remove("show");
  }
}
function hideModal() {
  modal.classList.remove("show");
}

registerUserModalBtn.addEventListener("click", showModal);

//register logic
passwordInp.addEventListener("input", () => {
  if (passwordInp.value.length < 6) {
    passwordInp.style.border = "3px solid red";
    passwordInp.style.borderRadius = "3px";
  } else {
    passwordInp.style.border = "3px solid green";
    passwordInp.style.borderRadius = "3px";
  }
});
passwordConfirmInp.addEventListener("input", () => {
  if (
    passwordConfirmInp.value.length < 6 ||
    passwordInp.value !== passwordConfirmInp.value
  ) {
    passwordConfirmInp.style.border = "3px solid red";
    passwordConfirmInp.style.borderRadius = "3px";
  } else {
    passwordConfirmInp.style.border = "3px solid green";
    passwordConfirmInp.style.borderRadius = "3px";
  }
});

function isDescendant(parent, child) {
  let node = child.parentNode;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function clickOutsideModal(event) {
  if (
    !isDescendant(modal, event.target) &&
    event.target !== registerUserModalBtn
  ) {
    modal.classList.remove("show");
  }
}
// dshjkcn;

document.addEventListener("click", clickOutsideModal);

async function checkUniqueUserName(username) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some((item) => item.username === username);
}

async function registerUser(e) {
  e.preventDefault();
  if (
    !userNameInp.value.trim() ||
    !emailInp.value.trim() ||
    !ageInp.value.trim() ||
    !passwordInp.value.trim() ||
    !passwordConfirmInp.value.trim()
  ) {
    showMessage("Some inputs are empty");
    return;
  }

  if (passwordInp.value !== passwordConfirmInp.value) {
    showMessage("Passwords are not correct");
    return;
  }

  if (passwordInp.value.length < 6) {
    showMessage("Пароль должен быть не менее 6 символов");
    return;
  }

  if (/\d/.test(userNameInp.value)) {
    showMessage("Username should not contain numbers");
    return;
  }

  if (await checkUniqueUserName(userNameInp.value)) {
    showMessage("Username already exists!");
    return;
  }

  const userObj = {
    username: userNameInp.value,
    email: emailInp.value,
    age: ageInp.value,
    password: passwordInp.value,
  };
  fetch(USERS_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  userNameInp.value = "";
  emailInp.value = "";
  ageInp.value = "";
  passwordInp.value = "";
  passwordConfirmInp.value = "";

  showMessage("Успех!!!");
  showModal();
}

registerForm.addEventListener("submit", registerUser);
registerCancel.addEventListener("click", hideModal);

// message box logic

const messageBox = document.querySelector(".messageBox");

function showMessage(message) {
  messageBox.textContent = message;
  messageBox.classList.add("show");
  setTimeout(hideMessage, 2000);
}

function hideMessage() {
  messageBox.classList.remove("show");
}

// ? login logic

loginBtn.addEventListener("click", () => {
  if (loginModal.style.display === "block") {
    loginModal.style.display = "none";
  } else {
    loginModal.style.display = "block";
  }
});

async function checkUserPassword(username, password) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  const userObj = users.find((item) => item.username === username);
  return userObj.password === password ? true : false;
}

function initStorage() {
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", "{}");
  }
}
initStorage();

function setUserToStorage(username, isAdmin = false) {
  localStorage.setItem(
    "user",
    JSON.stringify({ user: username, isAdmin: isAdmin })
  );
}

async function loginUser(e) {
  e.preventDefault();

  let res = await fetch(USERS_API);
  let users = await res.json();
  const userObj = users.find((item) => item.username === username);

  if (!logUserInp.value.trim() || !logPasswordInp.value.trim()) {
    showMessage("Some inputs are empty");
    return;
  }
  let account = await checkUniqueUserName(logUserInp.value);

  if (!account) {
    showMessage("No account");
    return;
  }
  let logPass = await checkUserPassword(logUserInp.value, logPasswordInp.value);
  if (!logPass) {
    showMessage("Wrong password");
    return;
  }

  setUserToStorage(logUserInp.value);

  logUserInp.value = "";
  logPasswordInp.value = "";

  showMessage("Success");
  loginModal.style.display = "none";
}

loginForm.addEventListener("submit", loginUser);

//! PASSWORD SHOW/HIDE
function togglePassword(inputId) {
  const inputElement = document.getElementById(inputId);
  const passwordControl = document.querySelector(
    `#${inputId} + .password-control`
  );

  if (inputElement.type === "password") {
    inputElement.type = "text";
    passwordControl.style.backgroundImage =
      "url(https://snipp.ru/demo/495/no-view.svg)";
  } else {
    inputElement.type = "password";
    passwordControl.style.backgroundImage =
      "url(https://snipp.ru/demo/495/view.svg)";
  }
}

// let passShow = document.querySelector("#password-view");
// let passShowConf = document.querySelector("#passwordConfirm-view");
// passShow.addEventListener("click", togglePassword("password"));
// passShowConf.addEventListener("click", togglePassword("passwordConfirm"));
