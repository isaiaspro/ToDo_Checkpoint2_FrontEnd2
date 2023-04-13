const inputEmailRef = document.querySelector('#inputEmail');
const inputPasswordRef = document.querySelector('#inputPassword');
const loginButtonRef = document.querySelector('#btnLogin');
const loginErrorRef = document.querySelector('#loginError')


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


function login(event) {
        
    event.preventDefault()

    const userLoginData = {
        email: inputEmailRef.value,
        password: inputPasswordRef.value
    }

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
            if(response.ok && response.status === 201) {
               response.json()
                  .then(
                      token => {
                          sessionStorage.setItem('authToken', token.jwt)
                          window.location.href = './tarefas.html'
                  })
            } else if(response.status !== 201){
                // fazer uma função para mostrar o erro
                // function mostraErrro(error) {
                // no parametro temos que receber o response.status
                // e a gente mostra o err de acordo com o status 
                // }
                loginError(response)
            

            }
        }
    )

}
function loginError(response){
    if (response.status == 400 || response.status == 404){

        loginErrorRef.classList.add('error')
 
    } else {

        loginErrorRef.classList.remove('error')

    }

}




inputEmailRef.addEventListener('blur', () => validateInput(inputEmailRef));
// inputEmailRef.addEventListener('keyup', () => validateInput(inputEmailRef));
inputPasswordRef.addEventListener('keyup',() => validateInput(inputPasswordRef));
inputPasswordRef.addEventListener('blur',() => validateInput(inputPasswordRef));
loginButtonRef.addEventListener('click', checkFormValidity);
loginButtonRef.addEventListener('click',(event) => login(event));
