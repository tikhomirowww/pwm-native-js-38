//show modal connect
const registerUserModalBtn = document.querySelector(".registerUser-modal");
const cancelBtn = document.querySelectorAll("#cancel");
const userNav = document.querySelector("#user-nav");

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

//? logout connect
const logoutBtn = document.querySelector(".logoutUser-btn");

// ? crud connect
const addModalProductBtn = document.querySelector("#add");
const titleInp = document.querySelector("#title");
const descInp = document.querySelector("#desc");
const categoryInp = document.querySelector("#category");
const priceInp = document.querySelector("#price");
const imageInp = document.querySelector("#image");
const addProductForm = document.querySelector("#addProduct-form");
const productsList = document.querySelector("#products");

// ?modal logic
let modal = null;
cancelBtn.forEach(item => {
  console.log(item);
  item.addEventListener("click", hideModal);
});

function showModal(modalName) {
  let customModal = document.querySelector(`.modal-${modalName}`);
  let innerModal = customModal.childNodes[1];
  modal = innerModal;
  let bg = document.createElement("div");
  bg.classList.add("modal-bg");
  document.body.prepend(bg);

  bg.addEventListener("click", () => {
    hideModal();
    bg.classList.remove("modal-bg");
  });

  if (!innerModal.classList.contains("show")) {
    // innerModal.style.display = "block";
    innerModal.classList.add("block");
    setTimeout(function () {
      innerModal.classList.add("show");
    }, 10);
  } else {
    innerModal.classList.remove("show");
  }
}

function hideModal() {
  console.log("modal");
  modal?.classList.remove("show");
  modal?.classList.remove("block");
  modal?.parentNode.parentNode.childNodes[0].classList.remove("modal-bg");
}

registerUserModalBtn.addEventListener("click", () => showModal("register"));

// ? register logic
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

async function checkUniqueUserName(username) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some(item => item.username === username);
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
    isAdmin: false,
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
  hideModal();
}

registerForm.addEventListener("submit", registerUser);
registerCancel.addEventListener("click", hideModal);

// ? message box logic

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

loginBtn.addEventListener("click", () => showModal("login"));

async function checkUserPassword(username, password) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  const userObj = users.find(item => item.username === username);
  return userObj.password === password ? true : false;
}

function initStorage() {
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", "{}");
  }
}

function setUserToStorage(username, isAdmin = false) {
  localStorage.setItem(
    "user",
    JSON.stringify({ user: username, isAdmin: isAdmin })
  );
}

async function loginUser(e) {
  e.preventDefault();

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

  let res = await fetch(USERS_API);
  let users = await res.json();
  const userObj = users.find(item => item.username === logUserInp.value);
  initStorage();
  setUserToStorage(userObj.username, userObj.isAdmin);

  logUserInp.value = "";
  logPasswordInp.value = "";

  showMessage("Success");
  checkStatus();
  hideModal();
}

loginForm.addEventListener("submit", loginUser);

// ? logout logic
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  checkStatus();
});

// ? checkStatus
function checkStatus() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  if (!user) {
    logoutBtn.style.display = "none";
    loginBtn.style.display = "block";
    registerUserModalBtn.style.display = "block";
    userNav.innerText = "";
    addModalProductBtn.style.display = "none";
  } else {
    logoutBtn.style.display = "block";
    loginBtn.style.display = "none";
    registerUserModalBtn.style.display = "none";
    userNav.innerText = user.user;
  }

  if (user && user.isAdmin) {
    addModalProductBtn.style.display = "block";
  } else {
    addModalProductBtn.style.display = "none";
  }
}

checkStatus();

// ? create product

addModalProductBtn.addEventListener("click", () => showModal("addProduct"));
