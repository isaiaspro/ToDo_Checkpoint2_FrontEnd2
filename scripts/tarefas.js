import { API } from "./env.js";
import { checkUserExists } from "./auth.js";
import { setUserName } from "./auth.js";
import { logout } from "./auth.js";
const authToken = sessionStorage.getItem('authToken')
const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': authToken
}

checkUserExists()
setUserName()


function getUserData() {

    // Configuração da Request
    var requestConfig = {
        method: 'GET',
        headers: requestHeaders
    }

    // Request para obter os Dados do Usuário
    fetch('https://todo-api.ctd.academy/v1/users/getMe', requestConfig)
    .then(response => {
        console.log(response)
        if (response.ok) {
            response.json().then(data => {
                console.log(data)
                sessionStorage.setItem('userName', `${data.firstName} ${data.lastName}`)
                setUserName()
            })
        }else{
        
        }
        
        // Obtém as Tasks do usuário logado
        // getTasks()
        
        // Verifica se a API retornou o Status code 401(O número 401 significa que o Token fornecido está inválido)
        if(response.status === 401) {
            
            // Caso o Token esteja errado será realizado o Logout do usuário na Aplicação
            logout()
            
        }
    })
    }
      

getUserData()