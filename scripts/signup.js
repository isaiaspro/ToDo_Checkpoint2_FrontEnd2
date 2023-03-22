const formElement = document.forms["sing-up"]
const inputsElement = document.querySelectorAll("input");

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

function handleForm() {
    let formIsValid = validateForm();

    if (formIsValid) {
        formElement['send'].disabled = false;
    } else {
        formElement['send'].disabled = true;
        formElement.reportValidity();
    }
}