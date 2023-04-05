const userNameRef = document.querySelector('#userName')
const userName = sessionStorage.getItem('userName')

userNameRef.innerText = userName