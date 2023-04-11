import { API } from './env.js'

export function checkUserExists(token) {
    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    fetch('https://todo-api.ctd.academy/v1/users/getMe', config)
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    sessionStorage.setItem('userName', `${data.firstName} ${data.lastName}`)
                    // setUserName()
                })
            }
        })
}
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('authToken');
    JSON.stringify(token)

    if (!token) {
        logout()

    } else if (token) {
        checkUserExists(token)
    }
})

export function setUserName(){
    const userNameRef = document.querySelector('#userName')
    const userName = sessionStorage.getItem('userName')
        userNameRef.innerText = userName
    }

export function logout() {

        window.location.href = '.index.html'
        sessionStorage.clear()
    }

const closeAppRef = document.querySelector('#closeApp')

closeAppRef.addEventListener('click',  logout)