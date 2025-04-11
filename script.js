document.addEventListener("DOMContentLoaded", function () {
    checkAuthStatus();
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("registerForm").addEventListener("submit", handleRegister);
    document.getElementById("pokemonForm").addEventListener("submit", handlePokemonSubmit);
    document.getElementById("rolForm").addEventListener("submit", handleRolChange);
    document.getElementById("searchInput").addEventListener("keypress", function (e) {
        if (e.key === "Enter") buscarPokemon();
    });
});

const API_BASE = "http://localhost:5000/api";

function showTab(tabName) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const loginTab = document.querySelector(".tab-container button:nth-child(1)");
    const registerTab = document.querySelector(".tab-container button:nth-child(2)");
    if (tabName === 'login') {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
    } else {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
        loginTab.classList.remove("active");
        registerTab.classList.add("active");
    }
}

function checkAuthStatus() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const isAdmin = localStorage.getItem("role") === "admin";

    const rolSection = document.getElementById("rolSection");
    const rolFormContainer = document.getElementById("rolFormContainer");

    if (rolSection) rolSection.classList.toggle("hidden", !isAdmin);
    if (rolFormContainer) rolFormContainer.classList.toggle("hidden", !isAdmin);

    if (token && username) {
        document.getElementById("authSection").classList.add("hidden");
        document.getElementById("pokemonSection").classList.remove("hidden");
        document.getElementById("userInfo").classList.remove("hidden");
        document.getElementById("usernameDisplay").textContent = username;
        cargarPokemones();
    } else {
        document.getElementById("authSection").classList.remove("hidden");
        document.getElementById("pokemonSection").classList.add("hidden");
        document.getElementById("userInfo").classList.add("hidden");
        if (rolSection) rolSection.classList.add("hidden");
        if (rolFormContainer) rolFormContainer.classList.add("hidden");
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    if (!username || !password) return alert("Por favor completa todos los campos");
    fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", username);
                localStorage.setItem("role", data.role);
                checkAuthStatus();
                document.getElementById("loginForm").reset();
                showSuccessAlert("Inicio de sesión exitoso");
            } else {
                showErrorAlert(data.error || "Credenciales inválidas");
            }
        })
        .catch(err => showErrorAlert("Error de conexión"));
}

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;
    const email = document.getElementById("registerEmail").value;
    if (!username || !password || !confirmPassword || !email) return showErrorAlert("Completa todos los campos");
    if (password !== confirmPassword) return showErrorAlert("Las contraseñas no coinciden");
    if (password.length < 6) return showErrorAlert("La contraseña debe tener al menos 6 caracteres");
    fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                showErrorAlert(data.error);
            } else {
                showSuccessAlert("Registro exitoso. Inicia sesión.");
                showTab('login');
                document.getElementById("registerForm").reset();
            }
        })
        .catch(() => showErrorAlert("Error al registrar usuario"));
}

function logout() {
    localStorage.clear();
    checkAuthStatus();
    showTab('login');
    showSuccessAlert("Sesión cerrada correctamente");
}

function cargarPokemones() {
    const token = localStorage.getItem("token");
    if (!token) return;
    showLoading(true);
    fetch(`${API_BASE}/pokemons`, {
        headers: { Authorization: token }
    })
        .then(res => res.json())
        .then(renderPokemonTable)
        .catch(() => showErrorAlert("Error al cargar los pokémones"))
        .finally(() => showLoading(false));
}

function buscarPokemon() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const token = localStorage.getItem("token");
    if (!token) return;
    showLoading(true);
    fetch(`${API_BASE}/pokemons/search?q=${query}`, {
        headers: { Authorization: token }
    })
        .then(res => res.json())
        .then(renderPokemonTable)
        .catch(() => showErrorAlert("Error al buscar pokémones"))
        .finally(() => showLoading(false));
}

function handlePokemonSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return showErrorAlert("Debes iniciar sesión primero");
    const data = {
        nombre: document.getElementById("nombre").value,
        tipo: document.getElementById("tipo").value,
        nivel: +document.getElementById("nivel").value,
        habilidades: document.getElementById("habilidades").value,
        peso: +document.getElementById("peso").value,
        altura: +document.getElementById("altura").value,
        genero: document.getElementById("genero").value,
        region: document.getElementById("region").value,
    };
    fetch(`${API_BASE}/pokemons`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(() => {
            showSuccessAlert("Pokémon agregado exitosamente");
            cargarPokemones();
            document.getElementById("pokemonForm").reset();
        })
        .catch(err => showErrorAlert(err.error || "Error al agregar Pokémon"));
}

function renderPokemonTable(pokemons) {
    const tableBody = document.getElementById("pokemonTableBody");
    tableBody.innerHTML = "";
    if (pokemons.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="10">No se encontraron pokémones</td>`;
        tableBody.appendChild(row);
        return;
    }
    pokemons.forEach(pokemon => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${pokemon.id}</td>
            <td>${pokemon.nombre}</td>
            <td>${pokemon.tipo}</td>
            <td>${pokemon.nivel}</td>
            <td>${pokemon.habilidades}</td>
            <td>${pokemon.peso} kg</td>
            <td>${pokemon.altura} m</td>
            <td>${pokemon.genero}</td>
            <td>${pokemon.region}</td>
            <td>
                <button class="edit-btn" onclick="editarPokemon(${pokemon.id})">Editar</button>
                <button class="delete-btn" onclick="eliminarPokemon(${pokemon.id})">Eliminar</button>
            </td>`;
        tableBody.appendChild(row);
    });
}

function editarPokemon(id) {
    const token = localStorage.getItem("token");
    if (!token) return showErrorAlert("Debes iniciar sesión primero");
    const nuevoNombre = prompt("Nuevo nombre del Pokémon:");
    if (!nuevoNombre?.trim()) return showErrorAlert("Nombre no válido");
    fetch(`${API_BASE}/pokemons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ nombre: nuevoNombre })
    })
        .then(res => res.json())
        .then(() => {
            showSuccessAlert("Pokémon actualizado");
            cargarPokemones();
        })
        .catch(() => showErrorAlert("Error al actualizar Pokémon"));
}

function eliminarPokemon(id) {
    const token = localStorage.getItem("token");
    if (!token) return showErrorAlert("Debes iniciar sesión primero");
    if (!confirm("¿Estás seguro de eliminar este Pokémon?")) return;
    fetch(`${API_BASE}/pokemons/${id}`, {
        method: "DELETE",
        headers: { Authorization: token }
    })
        .then(res => res.json())
        .then(() => {
            showSuccessAlert("Pokémon eliminado correctamente");
            cargarPokemones();
        })
        .catch(() => showErrorAlert("Error al eliminar Pokémon"));
}

function handleRolChange(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    const role = localStorage.getItem("role");
    if (role !== "admin") return showErrorAlert("Solo los administradores pueden cambiar roles");

    const userId = document.getElementById("userIdRol").value;
    const nuevoRol = document.getElementById("nuevoRol").value;

    fetch(`${API_BASE}/auth/role/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ nuevoRol })
    })
        .then(res => res.json())
        .then(data => {
            showSuccessAlert("Rol actualizado");
            document.getElementById("rolForm").reset();
        })
        .catch(() => showErrorAlert("Error al actualizar el rol"));
}

function showLoading(show) {
    let el = document.getElementById("loading");
    if (show && !el) {
        el = document.createElement("div");
        el.id = "loading";
        el.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000";
        el.innerHTML = '<div style="border:5px solid #fff;border-top:5px solid #3b4cca;border-radius:50%;width:50px;height:50px;animation:spin 1s linear infinite"></div>';
        document.body.appendChild(el);
        const style = document.createElement("style");
        style.innerHTML = `@keyframes spin { 0% {transform:rotate(0deg);} 100% {transform:rotate(360deg);} }`;
        document.head.appendChild(style);
    } else if (!show && el) {
        el.remove();
    }
}

function showSuccessAlert(msg) {
    createAlert(msg, "#4CAF50");
}

function showErrorAlert(msg) {
    createAlert(msg, "#f44336");
}

function createAlert(msg, bg) {
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;bottom:20px;right:20px;background:${bg};color:white;padding:15px;border-radius:5px;box-shadow:0 4px 8px rgba(0,0,0,0.2);z-index:1000;animation:fadeIn 0.3s;`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => { el.style.animation = "fadeOut 0.3s"; setTimeout(() => el.remove(), 300); }, 3000);
}


