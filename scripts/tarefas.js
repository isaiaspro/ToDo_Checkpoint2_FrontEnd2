import { API } from "./env.js";
import { setUserName } from "./auth.js";
import { logout } from "./auth.js";
import { checkUserExists } from "./auth.js";
import { watchToken } from "./auth.js";
const authToken = sessionStorage.getItem("authToken");
const createTaskbuttonRef = document.querySelector("#createTaskbutton");
const novaTarefaRef = document.querySelector("#novaTarefa");
const inputTaskAlertRef = document.querySelector("#inputTaskAlert");
const tarefasPendentesRef = document.querySelector("#tarefasPendentes");
const tarefasTerminadasRef = document.querySelector("#tarefasTerminadas");

let tarefasTerminadas = [];
let tarefasPendentes = [];

// function firstAccess(){


// }


const requestHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: authToken,
};



// Função que irá criar uma Task

function createTask(e) {
  // debuggers
  e.preventDefault();

  if (novaTarefaRef.value !== "" && novaTarefaRef.value.length > 3) {
    inputTaskAlertRef.classList.remove("input-task-alert");
    createTaskbuttonRef.disabled = false;

    // Informações sobre a Task
    const taskData = {
      description: novaTarefaRef.value,
      completed: false,
    };

    // Configuração da Request
    var requestConfig = {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(taskData),
    };


    // Realização da Request para criar uma nova Task
    fetch(`${API}/tasks`, requestConfig).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data);
          tarefasPendentes = [];
          tarefasTerminadas = [];

          getTasks();
        });

      }
      
    });

    novaTarefaRef.value = "";
  }else {
    inputTaskAlertRef.classList.add("input-task-alert");
    createTaskbuttonRef.disable = true;
  }
}
// Função que obtém as Tasks criadas pelo usuário logado
function getTasks() {
  // Configurações da Request
  var requestConfig = {
    method: "GET",
    headers: requestHeaders,
  };

  // Requisição para criar a Task
  fetch(`${API}/tasks`, requestConfig).then((response) => {
    if (response.ok) {
      response.json().then((tasks) => {
        const tasksArray = tasks;
        splitTasks(tasksArray);
        insertTasksInHTML();
      });
    }
  });
}


function getUserData() {
  // Configuração da Request
  var requestConfig = {
    method: "GET",
    headers: requestHeaders,
  };

  // Request para obter os Dados do Usuário
  fetch("https://todo-api.ctd.academy/v1/users/getMe", requestConfig).then(
    (response) => {
      if (response.ok) {
        response.json().then((data) => {
          sessionStorage.setItem(
            "userName",
            `${data.firstName} ${data.lastName}`
          );
          setUserName();
        });
      } else {
      }

      // Obtém as Tasks do usuário logado
      getTasks();

      // Verifica se a API retornou o Status code 401(O número 401 significa que o Token fornecido está inválido)
      if (response.status === 401) {
        // Caso o Token esteja errado será realizado o Logout do usuário na Aplicação
        logout();
      }
    }
  );
}


function confirmDeleteTask(task) {
  Swal.fire({
    title: 'Você está certo(a) disso?',
    text: "Você não poderá reverter essa ação!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, exclua a tarefa!'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTask(task);
    }
  });
}

function deleteTask(task) {
  // Configuração da Request
  var requestConfig = {
    method: "DELETE",
    headers: requestHeaders,
  };

  // Request para deletar a tarefa
  fetch(`${API}/tasks/${task}`, requestConfig).then((response) => {
    if (response.ok) {
      response.json().then((tasks) => {
        tarefasTerminadas = [];
        tarefasPendentes = [];
        getTasks();
      });
    }
  });

 /* Swal.fire(
    'Sucesso!',
    'Sua tarefa foi excluida.',
    'success'
  );*/
}

function concluirTarefa(task) {
  console.log(task);

  const taskData = {
    description: task.description,
    completed: true,
  };

  // Configuração da Request
  var requestConfig = {
    method: "PUT",
    headers: requestHeaders,
    body: JSON.stringify(taskData),
  };

  // Realização da Request para criar uma nova Task
  fetch(`${API}/tasks/${task.id}`, requestConfig).then((response) => {
    if (response.ok) {
      response.json().then((tasks) => {
        tarefasTerminadas = [];
        tarefasPendentes = [];
        getTasks();
      });
    }
  });

  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: '🙌Parabéns! Uma tarefa a menos. Proxima...',
    showConfirmButton: false,
    timer: 2000
  })
}


function changeStatus(taskIndex) {

  let tasksForInsert = {}
  if (taskIndex.completed) {
    tasksForInsert = { completed: false }
  } else {
    tasksForInsert = { completed: true }
  }
  // configurações do request
  let requestConfig = {
    method: 'PUT',
    headers: requestHeaders,
    body: JSON.stringify(tasksForInsert)
  }
  // Realização da Request para criar uma nova Task
  fetch(`https://todo-api.ctd.academy/v1/tasks/${taskIndex.id}`, requestConfig).then(
    response => {
      if (response.ok) {
        tarefasTerminadas = [];
        tarefasPendentes = [];
        getTasks()
      }

    }
  )


}

function addEventListenersToButtonsDone(divReferencia, arrayTarefa) {
  let arrayReferencia = divReferencia.children

  const buttonDoneArray = Array.from(arrayReferencia)
  buttonDoneArray.map(
    (item, index) => {
      const selecionaDivNotDone = item.children[0]
      // console.log(selecionaDivNotDone)

      const indexTarefaAtual = arrayTarefa[index]

      selecionaDivNotDone.addEventListener('click', () => changeStatus(indexTarefaAtual))

    }

  )
}

function addEventListenerPendentes() {


  const itens = Array.from(tarefasPendentesRef.children);
console.log(itens)
  itens.map((item, index) => {
    const buttonRef = item.children[0];
    const audioRef = document.querySelector('audio')

    buttonRef.addEventListener("click", () =>
      audioRef.play()
    );
    
    buttonRef.addEventListener("click", () =>
      concluirTarefa(tarefasPendentes[index]),
    );


  });
}

function addEventListenerPendentesDeletar() {
  const itens = Array.from(tarefasPendentesRef.children);
console.log(itens)
  itens.map((item, index) => {
    const buttonRef = item.children[3].children[0];
    console.log(buttonRef)

    buttonRef.addEventListener("click", () =>
    confirmDeleteTask(tarefasPendentes[index].id)
    );
  });
}



function addEventListenerTerminadasDeletar() {
  const itens = Array.from(tarefasTerminadasRef.children);
console.log(itens)
  itens.map((item, index) => {
    const buttonRef = item.children[2].children[0];
    console.log(buttonRef)

    buttonRef.addEventListener("click", () =>
    confirmDeleteTask(tarefasTerminadas[index].id)
    );
  });
}


function insertTasksInHTML() {
  tarefasPendentesRef.innerHTML = "";



  tarefasPendentes.map((task) => {

    const createdAtDate = new Date(task.createdAt)
    const createdAtFormated = new Intl.DateTimeFormat('pt-BR').format(createdAtDate)

    tarefasPendentesRef.innerHTML += `
        <li class="tarefa animate__animated animate__fadeInDown animate__faster">
          <div class="not-done"></div>
          <audio src="./assets/task_done.mp3"></audio>
          <div class="descricao">
            <p class="nome">${task.description}</p>
            <p class="timestamp">Criada em: ${createdAtFormated}</p>
            </div>
            <div>
            <a class="excluir"><i class="fa-solid fa-trash-can"></i></a>
            </div>
        </li>
        `;
  });

  tarefasTerminadasRef.innerHTML = "";

  tarefasTerminadas.map((task) => {

    const createdAtDate = new Date(task.createdAt)
    const createdAtFormated = new Intl.DateTimeFormat('pt-BR').format(createdAtDate)

    tarefasTerminadasRef.innerHTML += `
      <li class="tarefa animate__animated animate__fadeInDown animate__faster">
        <div class="not-done"></div>
        <div class="descricao">
          <p class="nome">${task.description}</p>
          <p class="timestamp">Criada em: ${createdAtFormated}</p>
          </div>
          <div id="trash" class="trash">
          <a  class="excluir"><i class="fa-solid fa-trash-can"></i></a>
          </div>
      </li>
    `;
  });

  addEventListenerPendentes();
  addEventListenerTerminadasDeletar()
  addEventListenerPendentesDeletar()
  addEventListenersToButtonsDone(tarefasTerminadasRef, tarefasTerminadas)
}

//Função para separar as tarefas entre pendentes e conluidas
function splitTasks(tasksArray) {
  tasksArray.map((task) => {
    if (task.completed) {
      tarefasTerminadas.unshift(task);
    } else {
      tarefasPendentes.unshift(task);
    }
  });
}



getUserData();

createTaskbuttonRef.addEventListener("click", (e) => createTask(e));