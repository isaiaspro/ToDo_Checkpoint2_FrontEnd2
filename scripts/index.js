

const inputEmailRef = document.querySelector('#inputEmail');
const inputPasswordRef = document.querySelector('#inputPassword');
const loginButtonRef = document.querySelector('#btnLogin');


var formErrors = {

    inputEmail: true,
    inputPassword: true
}

function checkFormValidity() {
  
  const formErrorsArray = Object.values(formErrors);
  const formValidity = formErrorsArray.every(item => item === false);
  loginButtonRef.disabled = !formValidity;

}

function validateInput(inputRef) {

    const inputValid = inputRef.checkValidity()

    if (inputValid) {

        inputRef.parentElement.classList.remove('error')
 
    } else {

        inputRef.parentElement.classList.add('error')

    }

    formErrors[inputRef.id] = !inputValid

    checkFormValidity()

}


const userLoginData = {

    email: inputEmailRef.value,
    password: inputPasswordRef.value

}

function login(event) {

    event.preventDefault()

    const requestHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    var requestConfig = {
       method: 'POST',
       headers: requestHeaders,
       body: JSON.stringify(userLoginData)
    }

    fetch('https://todo-api.ctd.academy/v1/users/login', requestConfig).then(
        response => {
            if(response.ok) {
               response.json()
                  .then(
                      token => {
                          sessionStorage.setItem('authToken', token.jwt)
                          window.location.href = '/tarefas.html'
                  })

            } else {

               

            }
        }
    )

}


inputEmailRef.addEventListener('keyup', () => validateInput(inputEmailRef));
inputPasswordRef.addEventListener('keyup',() => validateInput(inputPasswordRef));
loginButtonRef.addEventListener('click',(event) => login(event));
