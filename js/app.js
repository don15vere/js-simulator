document.addEventListener("DOMContentLoaded", () => {
    const modoJuegoCards = document.querySelectorAll(".modo-juego");
    const playAsGuestButton = document.getElementById("playAsGuest");
    const tablero = document.getElementById("tablero");
    const celdas = document.querySelectorAll(".celda");
    const gameSelectionModal = new bootstrap.Modal(document.getElementById("gameSelectionModal"));
    const gameOverModal = new bootstrap.Modal(document.getElementById("gameOverModal"));
    const gameOverMessage = document.getElementById("gameOverMessage");
    const restartButton = document.getElementById("restartGameButton");
    let turno = "X";
    let modo = "player";
    let tableroEstado = Array(9).fill(null);

    // Es modo de juego invitado?
    if (sessionStorage.getItem("guestMode")) {
        iniciarJuego();
    }

    modoJuegoCards.forEach(card => {
        card.addEventListener("click", () => {
            const loggedUser = sessionStorage.getItem("loggedUser");
            modo = card.dataset.mode;
            if (!loggedUser && !sessionStorage.getItem("guestMode")) {
                gameSelectionModal.show();
            } else {
                iniciarJuego();
            }
        });
    });

    playAsGuestButton.addEventListener("click", () => {
        sessionStorage.setItem("guestMode", "true");
        gameSelectionModal.hide();
        iniciarJuego();
    });

    function iniciarJuego() {
        turno = "X";
        tablero.classList.remove("d-none");
        tableroEstado.fill(null);
        celdas.forEach(celda => celda.textContent = "");
        modoJuegoCards.forEach(card => card.classList.add("juego-iniciado"));
    }

    celdas.forEach(celda => {
        celda.addEventListener("click", () => {
            const index = celda.dataset.pos - 1;
            if (tableroEstado[index] || checkGanador()) return;

            tableroEstado[index] = turno;
            celda.textContent = turno;
            
            if (checkGanador()) {
                const loggedUser = sessionStorage.getItem("loggedUser");
                gameOverModal.show();
                const userMsg = loggedUser && turno === "X" ? ` ${loggedUser}` : "";
                gameOverMessage.textContent = `Felicidades${userMsg}!! ${turno} ha ganado!`; 
                return;
            }
            turno = turno === "X" ? "O" : "X";
            
            if (modo === "bot" && turno === "O") {
                setTimeout(jugadaBot, 500);
            }
        });
    });

    function jugadaBot() {
        let posicionesLibres = tableroEstado.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (posicionesLibres.length === 0 || checkGanador()) return;

        let movimiento = posicionesLibres[Math.floor(Math.random() * posicionesLibres.length)];
        tableroEstado[movimiento] = "O";
        celdas[movimiento].textContent = "O";

        if (checkGanador()) {
            gameOverModal.show();
            gameOverMessage.textContent = `Es una lástima!! ${turno} ha ganado!`;
        }

        turno = "X";
    }

    function checkGanador() {
        const combinaciones = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return combinaciones.some(combinacion => {
            const [a, b, c] = combinacion;
            return tableroEstado[a] && tableroEstado[a] === tableroEstado[b] && tableroEstado[a] === tableroEstado[c];
        });
    }

    document.addEventListener("loginEvent", () => {
        sessionStorage.removeItem("guestMode");
        document.body.classList.add("logged-in");
    });

    document.addEventListener("logoutEvent", () => {
        document.body.classList.remove("logged-in");
        modoJuegoCards.forEach(card => card.classList.remove("juego-iniciado"));
        tablero.classList.add("d-none");
    });

    restartButton.addEventListener("click", () => {
        gameOverModal.hide();
        iniciarJuego();
    });
    
    console.log("App.js loaded and ready!");
});
