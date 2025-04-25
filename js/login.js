document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const authButtons = document.getElementById("authButtons");
    const loginEvent = new Event("loginEvent");
    const logoutEvent = new Event("logoutEvent");
    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));

    function getUsers() {
        return JSON.parse(localStorage.getItem("users")) || [];
    }

    function loginUser(email) {
        sessionStorage.setItem("loggedUser", email);
        document.dispatchEvent(loginEvent);
        actualizarBarra();
    }

    function logoutUser() {
        sessionStorage.removeItem("loggedUser");
        document.dispatchEvent(logoutEvent);
        actualizarBarra();
    }

    function actualizarBarra() {
        const usuarioLogueado = sessionStorage.getItem("loggedUser");

        if (usuarioLogueado) {
            document.body.classList.add("logged-in");
            authButtons.innerHTML = `
                <span class="text-white me-3">Bienvenido, ${usuarioLogueado}</span>
                <button id="logoutButton" class="btn btn-outline-light">Cerrar Sesión</button>
            `;
            document.getElementById("logoutButton").addEventListener("click", logoutUser);
        } else {
            document.body.classList.remove("logged-in");
            authButtons.innerHTML = `
                <button class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
                <button class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#registerModal">Register</button>
            `;
        }
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const users = getUsers();
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            loginUser(email);
            alert("Inicio de sesión exitoso");
            loginModal.hide();
        } else {
            alert("Credenciales incorrectas");
        }

        loginForm.reset();
    });

    actualizarBarra();
});