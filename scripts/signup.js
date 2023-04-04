const formElement = document.getElementById('sign-up')
const inputsElement = document.querySelectorAll("input");
const responseElement = document.getElementById('response')
const API = 'https://todo-api.ctd.academy/v1/users'

function validateForm() {
    let formIsValid = true;
    let pwd = formElement['password'];
    let confirmPWD = formElement['confirm-pwd'];

    for (let input of inputsElement) {
        if (input.value === "") {
            formIsValid = false;
        }
    }

    if (pwd.value !== confirmPWD.value && pwd.value !== ""
        && confirmPWD.value !== "") {
        formIsValid = false;
        confirmPWD.setCustomValidity('As senhas não correspondem');
    } else {
        confirmPWD.setCustomValidity('');
    }

    return formIsValid;
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
        responseElement.innerHTML = `<span class="ok">usuario criado com sucesso!</span>`
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

    fetch(API, config)
        .then(response => {
            if (response.ok) {
                response.json().then( token => {
                    sessionStorage.setItem('authToken', JSON.stringify(token.jwt))
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

function handleForm() {
    let formIsValid = validateForm();

    if (!formIsValid) {
        formElement['send'].disabled = true;
        formElement.reportValidity();
    } else {
        formElement['send'].disabled = false;
    }
}

formElement.addEventListener('keyup', handleForm);
formElement.addEventListener('submit', (e) => sendData(e))