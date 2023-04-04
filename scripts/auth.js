function checkUserExists(token) {
    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    }
    fetch('https://todo-api.ctd.academy/v1/users/getMe', config)
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    sessionStorage.setItem('userName', `${data.firstName} ${data.lastName}`)
                })
            }
        })
}

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        window.location.href = './index.html';

    } else if (token) {
        checkUserExists(token)
    }
})