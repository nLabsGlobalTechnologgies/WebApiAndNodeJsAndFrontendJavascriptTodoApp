let todoListData = [];

const itemsPerPage = 10; // Her sayfada gösterilecek öğe sayısı
let currentPage = 1; // Başlangıçta görünen sayfa

// Sunucu tarafından gelen toplam veri sayısı
const totalItemsFromServer = 100; // Örnek olarak 100 veri varsa

function renderPagination() {
  const totalPages = Math.ceil(totalItemsFromServer / itemsPerPage);
  const paginationElement = document.getElementById("pagination");

  paginationElement.innerHTML = "";

  // "İlk" ve "Önceki" sayfa butonları
  paginationElement.innerHTML += `<button onclick="changePage(1)">İlk</button>`;
  paginationElement.innerHTML += `<button onclick="changePage(${currentPage - 1})">Önceki</button>`;

  // Sayfa numaraları
  for (let i = 1; i <= totalPages; i++) {
    paginationElement.innerHTML += `<button onclick="changePage(${i})">${i}</button>`;
  }

  // "Sonraki" ve "Son" sayfa butonları
  paginationElement.innerHTML += `<button onclick="changePage(${currentPage + 1})">Sonraki</button>`;
  paginationElement.innerHTML += `<button onclick="changePage(${totalPages})">Son</button>`;
}

async function fetchDataAndRender(page) {
  // Bu kısımda sayfa verilerini almak için bir fetch işlemi gerçekleştirilebilir
  // Örneğin: const response = await fetch(`/api/data?page=${page}&perPage=${itemsPerPage}`);
  // Bu işlemden elde edilen verilerle sayfa içeriğini güncelleyebilirsiniz.
  // Örneğin: const data = await response.json();
  // renderData(data);
  console.log(`Fetching data for page ${page}`);
}

function renderData(data) {
  // Bu kısımda verileri sayfada görüntülemek için gerekli işlemleri gerçekleştirebilirsiniz.
  // Örneğin: data.forEach(item => console.log(item));
}

function changePage(newPage) {
  currentPage = newPage;
  renderPagination();
  fetchDataAndRender(currentPage);
}

// İlk sayfa yüklenirken pagination'ı ve veriyi alıp işlemek için fetchDataAndRender fonksiyonunu çağır
renderPagination();
fetchDataAndRender(currentPage);

const apiUrl = "https://localhost:7296/api/Todos/";
const getAll = apiUrl + "GetAll";
const save = apiUrl + "Save";
const update = apiUrl + "Update";
const deleteby = apiUrl + "Delete";

async function renderTodoList() {
  try {
    const response = await fetch(getAll);
    const todos = await response.json();
    todoListData = todos;
    updateTodoListUI();
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

async function addTodo() {
  const name = document.getElementById("name").value;
  const priority = document.getElementById("priority").value;
  debugger
  if (!name || !priority) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Name and priority are required!',
    });
    return;
  } else {
    try {
      const response = await fetch(save, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, priority }),
      });

      const result = await response.json();

      if (result.success) {
        toastr.warning('Task added successfully!', 'Success');
        closeModal();
        renderTodoList();
      } else {
        toastr.warning('Task added successfully!', 'Success');
        closeModal();
        renderTodoList();
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }
}

async function updateTodo(index) {
  const updatedName = document.getElementById("updateName").value;
  const updatedPriority = document.getElementById("updatePriority").value;

  if (!updatedName || !updatedPriority) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Name and priority are required!',
    });
    return;
  }
  else {
    const todoId = todoListData[index]._id;
    try {
      const response = await fetch(update, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: todoId, name: updatedName, priority: updatedPriority }),
      });

      const result = await response.json();

      if (result.success) {
        toastr.warning('Task updated successfully!', 'Success');
        closeModal();
        renderTodoList();
      } else {
        toastr.warning('Task updated successfully!', 'Success');
        closeModal();
        renderTodoList();
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }
}

async function deleteTodo(index) {
  
  debugger
  const todoId = todoListData[index]._id;

  try {
    const response = await fetch(deleteby, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: todoId }),
    });

    const result = await response.json();

    if (result.success) {
      //1
      handleDeleteSuccess();
    } else {
      handleDeleteError(result.error);
    }
  } catch (error) {
      handleDeleteSuccess();
      // handleDeleteError(error.message);
  }
}

function handleDeleteSuccess() {
  toastr.error('Task deleted successfully!', 'Success');
  renderTodoList();
}

function handleDeleteError(errorMessage) {
  console.error("Error deleting todo:", errorMessage);
  toastr.error('An error occurred while deleting the task.', 'Error');
}



async function updateTodoListUI() {
  const todoListContainer = document.getElementById("todoList");
  todoListContainer.innerHTML = "";

  todoListData.forEach((todo, index) => {
    const row = `
      <tr>
        <th scope="row">${index + 1}</th>
        <td>${todo.name}</td>
        <td>${todo.priority}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="openUpdateModal(${index})">Update</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTodo(${index})">Delete</button>
        </td>
      </tr>
    `;
    todoListContainer.innerHTML += row;
  });
}

function openAddModal() {
  const addTodoModal = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add ToDo</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="addTodoForm">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" required>
              <div class="invalid-feedback">Please enter a valid Name.</div>
            </div>
            <div class="mb-3">
              <label for="priority" class="form-label">Priority</label>
              <select class="form-select" id="priority" required>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <button type="button" class="btn btn-primary" onclick="addTodo()">Add</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  `;
  document.getElementById("addTodoModal").innerHTML = addTodoModal;
  const modal = new bootstrap.Modal(document.getElementById("addTodoModal"));
  modal.show();
  document.getElementById("addTodoForm").addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
    modal.hide();
  });
  document.getElementById("addTodoForm").querySelector('[data-bs-dismiss="modal"]').addEventListener("click", function () {
    modal.hide();
  });
}

function openUpdateModal(index) {
  const todoToUpdate = todoListData[index];
  const updateTodoModal = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Update ToDo</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="updateTodoForm">
            <div class="mb-3">
              <label for="updateName" class="form-label">Name</label>
              <input type="text" class="form-control" id="updateName" value="${todoToUpdate.name}" required>
              <div class="invalid-feedback">Please enter a valid Name.</div>
            </div>
            <div class="mb-3">
              <label for="updatePriority" class="form-label">Priority</label>
              <select class="form-select" id="updatePriority" required>
                <option value="Low" ${todoToUpdate.priority === 'Low' ? 'selected' : ''}>Low</option>
                <option value="Medium" ${todoToUpdate.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                <option value="High" ${todoToUpdate.priority === 'High' ? 'selected' : ''}>High</option>
              </select>
            </div>
            <button type="button" class="btn btn-primary" onclick="updateTodo(${index})">Update</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  `;
  document.getElementById("updateTodoModal").innerHTML = updateTodoModal;
  const modal = new bootstrap.Modal(document.getElementById("updateTodoModal"));
  modal.show();
  document.getElementById("updateTodoForm").addEventListener("submit", function (event) {
    event.preventDefault();
    updateTodo(index);
    modal.hide();
  });
  document.getElementById("updateTodoForm").querySelector('[data-bs-dismiss="modal"]').addEventListener("click", function () {
    modal.hide();
  });
}

function closeModal() {
  var addModal = document.getElementById("addTodoModal");
  var updateModal = document.getElementById("updateTodoModal");
  if (addModal) {
    addModal.style.display = "none";
  }
  if (updateModal) {
    updateModal.style.display = "none";
  }
  var backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.parentNode.removeChild(backdrop);
  }
  document.body.classList.remove('modal-open');
}

document.getElementById("addTodoBtn").addEventListener("click", openAddModal);
renderTodoList();
