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
const PRODUCTS_API = "http://localhost:8000/products";

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

// ? edit connect
const titleInpEdit = document.querySelector("#titleEdit");
const descInpEdit = document.querySelector("#descEdit");
const priceInpEdit = document.querySelector("#priceEdit");
const categoryInpEdit = document.querySelector("#categoryEdit");
const imageInpEdit = document.querySelector("#imageEdit");
const editProductForm = document.querySelector("#editProduct-form");

// ? search connect
const searchInp = document.querySelector(".search");

//? filter connect
const categorySelect = document.querySelector("#categorySelect");

// ? pagination connect
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const pageSpan = document.querySelector(".pagination span");

// ?modal logic
let modal = null;
cancelBtn.forEach((item) => {
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

function clickOutsideModal(event) {
  if (
    !isDescendant(modal, event.target) &&
    event.target !== registerUserModalBtn
  ) {
    modal?.classList.remove("show");
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
  const userObj = users.find((item) => item.username === username);
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
  const userObj = users.find((item) => item.username === logUserInp.value);
  render();

  initStorage();
  setUserToStorage(userObj.username, userObj.isAdmin);

  logUserInp.value = "";
  logPasswordInp.value = "";

  showMessage("Success");
  checkStatus();
  hideModal();
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

// ? logout logic
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  render();
  checkStatus();
});

// ? checkStatus
function checkStatus() {
  const user = JSON.parse(localStorage.getItem("user"));
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

function inputsClear(...rest) {
  for (let i = 0; i < rest.length; i++) {
    rest[i].value = "";
  }
}

// ! crud logic

// ? create product

addModalProductBtn.addEventListener("click", () => showModal("addProduct"));

async function createProduct(e) {
  e.preventDefault();
  if (
    !titleInp.value.trim() ||
    !priceInp.value.trim() ||
    !categoryInp.value.trim() ||
    !descInp.value.trim() ||
    !imageInp.value.trim()
  ) {
    showMessage("Some inputs are empty");
    return;
  }

  const newProduct = {
    title: titleInp.value,
    price: priceInp.value,
    category: categoryInp.value,
    description: descInp.value,
    image: imageInp.value,
  };

  await fetch(PRODUCTS_API, {
    method: "POST",
    body: JSON.stringify(newProduct),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  render();
  addOptions();
  hideModal();
  inputsClear(titleInp, priceInp, categoryInp, descInp, imageInp);
}

addProductForm.addEventListener("submit", createProduct);

// ? read logic

let search = "";
let category = "";
let currentPage = 1;

async function render() {
  let requestAPI = `${PRODUCTS_API}?title_like=${search}&category=${category}&_page=${currentPage}&_limit=3`;
  if (!category) {
    requestAPI = `${PRODUCTS_API}?title_like=${search}&_page=${currentPage}&_limit=3`;
  }
  const res = await fetch(requestAPI);
  const data = await res.json();
  initStorage();
  const user = JSON.parse(localStorage.getItem("user"));
  productsList.innerHTML = "";
  data.forEach((card) => {
    productsList.innerHTML += `
<div class='productsList'>
    <img width="300px" height="300px"object-fit="contain" src=${card.image} />

    <div><b>${card.title}</b></div>
    <div><b>Description:</b>${card.description}</div>
    <div><b>Category:</b>${card.category}</div>
    <div><b>Price:</b>${card.price}$</div>
    ${
      user.isAdmin
        ? `
      <button id=${card.id}  class='deleteBtn' >Delete</button>
      <button id=${card.id}  class='editBtn' >Edit</button>
      `
        : ""
    }
    </div>
    `;
  });
}

render();

// ? delete logic

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    await fetch(`${PRODUCTS_API}/${e.target.id}`, {
      method: "DELETE",
    });
    render();
  }
});

// ? edit logic

let id = null;

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("editBtn")) {
    const productId = e.target.id;
    const res = await fetch(`${PRODUCTS_API}/${productId}`);
    const data = await res.json();
    titleInpEdit.value = data.title;
    priceInpEdit.value = data.price;
    categoryInpEdit.value = data.category;
    descInpEdit.value = data.description;
    imageInpEdit.value = data.image;
    id = productId;

    showModal("editProduct");
  }
});

editProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (
    !titleInpEdit.value.trim() ||
    !priceInpEdit.value.trim() ||
    !categoryInpEdit.value.trim() ||
    !descInpEdit.value.trim() ||
    !imageInpEdit.value.trim()
  ) {
    showMessage("Some inputs are empty");
    return;
  }

  const editedObj = {
    title: titleInpEdit.value,
    price: priceInpEdit.value,
    description: descInpEdit.value,
    category: categoryInpEdit.value,
    image: imageInpEdit.value,
  };

  await fetch(`${PRODUCTS_API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  render();
  hideModal();
});

// !?search logic

searchInp.addEventListener("input", () => {
  search = searchInp.value;
  currentPage = 1;
  pageSpan.innerText = 1;
  checkPage();
  render();
});

//? filter logic

async function addOptions() {
  const res = await fetch(PRODUCTS_API);
  const data = await res.json();
  const categories = data.map((item) => item.category);
  let uniqueCategories = [...new Set(categories)];
  categorySelect.innerHTML = "<option>All</option>";
  uniqueCategories.forEach((item) => {
    categorySelect.innerHTML += `
    <option>${item}</option>
    `;
  });
}
addOptions();

categorySelect.addEventListener("change", (e) => {
  console.log(e.target.value);
  if (e.target.value === "All") {
    category = "";
  } else {
    currentPage = 1;
    pageSpan.innerText = 1;
    category = e.target.value;
    checkPage();
  }
  render();
});

//? pagination logic
nextBtn.addEventListener("click", () => {
  currentPage++;
  pageSpan.innerText = currentPage;
  checkPage();
  render();
});

prevBtn.addEventListener("click", () => {
  currentPage--;
  pageSpan.innerText = currentPage;
  checkPage();
  render();
});

async function checkPage() {
  const res = await fetch(PRODUCTS_API);
  const data = await res.json();
  const maxPage = Math.ceil(data.length / 3);
  if (currentPage === 1) {
    prevBtn.style.display = "none";
  } else if (currentPage === maxPage) {
    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "inline";
    nextBtn.style.display = "inline";
  }
}
checkPage();
