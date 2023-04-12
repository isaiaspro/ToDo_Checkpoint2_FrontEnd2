const formElement = document.getElementById("sign-up");
const responseElement = document.getElementById("response");
const btnIngressarRef = document.querySelector("#btnIngressar");
const inputNomeRef = document.querySelector("#inputName");
const inputSobrenomeRef = document.querySelector("#lastName");
const inputEmailRef = document.querySelector("#email");
const inputPasswordRef = document.querySelector("#password");
const inputConfirmPasswordRef = document.querySelector("#confirmPassword");
import { API } from "./env.js";

var amountOfAccesses = 0

var formErrors = {
  inputName: true,
  lastName: true,
  email: true,
  password: true,
  confirmPassword: true,
};

function checkFormValidity() {
  const formErrorsArray = Object.values(formErrors);
  const formValidity = formErrorsArray.every((item) => item === false);
  const pwd = inputPasswordRef.value;
  const confPwd = inputConfirmPasswordRef.value;

  if (pwd === confPwd) {
    btnIngressarRef.disabled = !formValidity;
    inputConfirmPasswordRef.parentElement.classList.remove("error");
  } else {
    inputConfirmPasswordRef.parentElement.classList.add("error");
    btnIngressarRef.disabled = true;
  }
}

function validateInput(inputRef) {
  const inputValid = inputRef.checkValidity();

  if (inputValid) {
    inputRef.parentElement.classList.remove("error");
  } else {
    inputRef.parentElement.classList.add("error");
  }

  formErrors[inputRef.id] = !inputValid;

  checkFormValidity();
}

function catchData() {
  const data = {
    firstName: formElement["name"].value,
    lastName: formElement["last-name"].value,
    email: formElement["email"].value,
    password: formElement["password"].value,
  };

  return data;
}

function sendResponse(response) {
  if (response === 200) {
    Swal.fire("Bem vindo!", "Você foi cadastrado com sucesso!", "success");
    // responseElement.innerHTML = `<span class="ok">usuario criado com sucesso!</span>`
  } else if (response === 400) {
    responseElement.innerHTML = `<span class="err">email ja cadastrado!</span>`;
  } else {
    responseElement.innerHTML = `<span class="err">erro no servidor</span>`;
  }
}
function sendData(e) {
  e.preventDefault();

  const config = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(catchData()),
  };

  fetch(`${API}/users`, config).then((response) => {
    if (response.ok) {
      response.json().then((token) => {
        sessionStorage.setItem("authToken", token.jwt);
        localStorage.setItem('FirstTimeAccessToDo', amountOfAccesses++)
        setTimeout(() => {
          window.location.href = "./tarefas.html";
        }, 5000);
      });
      sendResponse(200);
      formElement.reset();
    } else if (response.status >= 400 && response.status < 403) {
      sendResponse(400);
    } else {
      sendResponse();
    }
  });
}

formElement.addEventListener("submit", (e) => sendData(e));
inputNomeRef.addEventListener("blur", () => validateInput(inputNomeRef));
inputSobrenomeRef.addEventListener("blur", () =>
  validateInput(inputSobrenomeRef)
);

inputEmailRef.addEventListener("blur", () => validateInput(inputEmailRef));
inputPasswordRef.addEventListener("blur", () =>
  validateInput(inputPasswordRef)
);

inputConfirmPasswordRef.addEventListener("blur", () =>
  validateInput(inputConfirmPasswordRef)
);
inputConfirmPasswordRef.addEventListener("keyup", () =>
  validateInput(inputConfirmPasswordRef)
);

btnIngressarRef.addEventListener("click", checkFormValidity);
