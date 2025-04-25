document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const registerModal = new bootstrap.Modal(document.getElementById("registerModal"));

    function getUsers() {
        return JSON.parse(localStorage.getItem("users")) || [];
    }

    function saveUser(user) {
        let users = getUsers();
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
    }

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("registerConfirmPassword").value;

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const users = getUsers();
        if (users.some(user => user.email === email)) {
            alert("El correo ya está registrado");
            return;
        }

        saveUser({ email, password });
        alert("Registro exitoso. Ahora puedes iniciar sesión");
        registerModal.hide();
        registerForm.reset();
    });
});