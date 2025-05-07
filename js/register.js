document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const registerModal = new bootstrap.Modal(document.getElementById("registerModal"));

    function getUsers() {
        return fetch('https://my-json-server.typicode.com/don15vere/js-simulator/users')
        .then((response) => response.json())
        .catch((error) => {
            console.error("Error fetching users:", error);
            return [];
        });
    }

    function saveUser(user) {
        getUsers().then((data) => {
            const users = data || [];
            user.id = getLastUserID(users);
            createUser(user);
        });
    }

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("registerConfirmPassword").value;

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const users = await getUsers(); // Espera los usuarios
    
            if (users.some(user => user.email === email)) {
                alert("El correo ya está registrado");
                return;
            }
    
            saveUser({ email, password });
            alert("Registro exitoso. Ahora puedes iniciar sesión");
            registerModal.hide();
            registerForm.reset();
    
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Ocurrió un error al registrar. Intenta de nuevo más tarde.");
        }
    });

    function getLastUserID(users) {
        if (users.length === 0) return 1;
        const lastUser = users[users.length - 1];
        return lastUser.id + 1;
    }

    function createUser(user) {
        fetch('https://my-json-server.typicode.com/don15vere/js-simulator/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => console.log('User saved:', data))
        .catch(error => console.error('Error saving user:', error));
    }
});