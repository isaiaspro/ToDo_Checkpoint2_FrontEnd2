const formElement = document.getElementById('sign-up')
// const inputsElement = document.querySelectorAll("input");
const responseElement = document.getElementById('response')
const btnIngressarRef = document.querySelector('#btnIngressar')
const inputNomeRef = document.querySelector('#inputName')
const inputSobrenomeRef = document.querySelector('#lastName')
const inputEmailRef = document.querySelector('#email')
const inputPasswordRef = document.querySelector('#password')
const inputConfirmPasswordRef = document.querySelector('#confirmPassword')

console.log(inputNomeRef)

import { API } from './env.js'


var formErrors = {
    inputName: true,
    lastName: true,
    email: true,
    password: true,
    confirmPassword: true
}

function checkFormValidity() {
  
  const formErrorsArray = Object.values(formErrors);
  const formValidity = formErrorsArray.every(item => item === false);
const pwd = inputPasswordRef.value
const confPwd = inputConfirmPasswordRef.value

  if ( pwd === confPwd ){
      btnIngressarRef.disabled = !formValidity
    inputConfirmPasswordRef.parentElement.classList.remove('error')

  }else{
    inputConfirmPasswordRef.parentElement.classList.add('error')
    btnIngressarRef.disabled = true

  }

  console.log(formErrorsArray)
  console.log(formValidity)

}
console.log(formErrors)

function validateInput(inputRef) {
    console.log(inputRef.id)

    const inputValid = inputRef.checkValidity()

    console.log(inputValid)

    if (inputValid) {

        inputRef.parentElement.classList.remove('error')
 
    } else {

        inputRef.parentElement.classList.add('error')

    }


    formErrors[inputRef.id] = !inputValid

    checkFormValidity()

}

 

function catchData() {
    const data = {
        firstName: formElement['name'].value,
        lastName: formElement['last-name'].value,
        email: formElement['email'].value,
        password: formElement['password'].value
    }

    return data
}

function sendResponse(response) {
    if (response === 200) {
        Swal.fire(
            'Bem vindo!',
            'Você foi cadastrado com sucesso!',
            'success'
          )
        // responseElement.innerHTML = `<span class="ok">usuario criado com sucesso!</span>`
    } else if (response === 400) {
        responseElement.innerHTML = `<span class="err">email ja cadastrado!</span>`
    } else {
        responseElement.innerHTML = `<span class="err">erro no servidor</span>`
    }
}
function sendData(e) {
    e.preventDefault();

    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(catchData())
    }

    fetch(`${API}/users`, config)
        .then(response => {
            if (response.ok) {
                response.json().then( token => {
                    console.log(token)
                    sessionStorage.setItem('authToken', token.jwt)
                    console.log(token)
                    setTimeout( () => {
                        window.location.href = './tarefas.html';
                    }, 5000)
                })
                sendResponse(200)
                formElement.reset();
            }
            else if (response.status >= 400 && response.status < 403) {
                sendResponse(400)
            }
            else {
                sendResponse()
            }
        })

}

// function handleForm() {
//     let sformIsValid = validateForm();

//     if (!formIsValid) {
//         formElement['send'].disabled = true;
//         formElement.reportValidity();
//     } else {
//         formElement['send'].disabled = false;
//     }
// }

// formElement.addEventListener('keyup', handleForm);
formElement.addEventListener('submit', (e) => sendData(e))
inputNomeRef.addEventListener('blur', () => validateInput(inputNomeRef));
inputSobrenomeRef.addEventListener('blur',() => validateInput(inputSobrenomeRef));
// inputSobrenomeRef.addEventListener('keyup',() => validateInput(inputSobrenomeRef));
// inputEmailRef.addEventListener('keyup', () => validateInput(inputEmailRef));
inputEmailRef.addEventListener('blur', () => validateInput(inputEmailRef));
inputPasswordRef.addEventListener('blur',() => validateInput(inputPasswordRef));
// inputPasswordRef.addEventListener('keyup',() => validateInput(inputPasswordRef));

inputConfirmPasswordRef.addEventListener('blur',() => validateInput(inputConfirmPasswordRef));
inputConfirmPasswordRef.addEventListener('keyup',() => validateInput(inputConfirmPasswordRef));

btnIngressarRef.addEventListener('click', checkFormValidity);