import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login, logout } from "./login";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";

// DOM elements
const mapBox = document.querySelector("#map");
const loginForm = document.querySelector("#user-login-form");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userSettingForm = document.querySelector(".form-user-settings");
const bookBtn = document.querySelector("#book-tour");
// const userPhoto = document.que

// delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  // console.log(locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logout();
  });
}

if (userDataForm) {
  userDataForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData();
    // The FormData() constructor creates a new FormData object.
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const [photo] = document.querySelector("#photo").files;
    // files is an array, and we want the first one

    form.append("name", name);
    form.append("email", email);
    form.append("photo", photo);

    await updateSettings(form, "data");
    document.querySelector("#name").value = name;
    document.querySelector("#email").value = email;

    setTimeout(() => {
      location.reload();
    }, 500);
  });
}

if (userSettingForm) {
  userSettingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.querySelector("#password-current").value;
    const password = document.querySelector("#password").value;
    const passwordConfirm = document.querySelector("#password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );
    document.querySelector(".btn--save-password").textContent = "Save password";
    document.querySelector("#password-current").value = "";
    document.querySelector("#password").value = "";
    document.querySelector("#password-confirm").value = "";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
