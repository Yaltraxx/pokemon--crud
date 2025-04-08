document.addEventListener("DOMContentLoaded", function () {
    checkAuthStatus();
    
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("registerForm").addEventListener("submit", handleRegister);
    document.getElementById("pokemonForm").addEventListener("submit", handlePokemonSubmit);
    document.getElementById("searchInput").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            buscarPokemon();
        }
    });
});

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
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    
    if (!username || !password) {
        alert("Por favor completa todos los campos");
        return;
    }
    
    fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", username);
            checkAuthStatus();
            document.getElementById("loginForm").reset();
            showSuccessAlert("Inicio de sesión exitoso");
        }
    })
    .catch(error => {
        console.error("Error en login:", error);
        showErrorAlert(error.error || "Credenciales inválidas");
    });
}

function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;
    const email = document.getElementById("registerEmail").value;
    
    if (!username || !password || !confirmPassword || !email) {
        showErrorAlert("Por favor completa todos los campos");
        return;
    }
    
    if (password !== confirmPassword) {
        showErrorAlert("Las contraseñas no coinciden");
        return;
    }
    
    if (password.length < 6) {
        showErrorAlert("La contraseña debe tener al menos 6 caracteres");
        return;
    }
    
    fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        showSuccessAlert("Registro exitoso. Por favor inicia sesión.");
        showTab('login');
        document.getElementById("registerForm").reset();
    })
    .catch(error => {
        console.error("Error en registro:", error);
        showErrorAlert(error.error || "Error al registrar usuario");
    });
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    checkAuthStatus();
    showTab('login');
    showSuccessAlert("Sesión cerrada correctamente");
}

function cargarPokemones() {
    const token = localStorage.getItem("token");
    if (!token) return;

    showLoading(true);
    
    fetch("http://localhost:5000/api/pokemons", {
        headers: {
            Authorization: token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al cargar pokémones");
        }
        return response.json();
    })
    .then(pokemons => {
        const tableBody = document.getElementById("pokemonTableBody");
        tableBody.innerHTML = "";

        if (pokemons.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="10">No hay pokémones registrados</td>`;
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
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error al cargar los pokémones:", error);
        showErrorAlert("Error al cargar los pokémones");
    })
    .finally(() => {
        showLoading(false);
    });
}

function buscarPokemon() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!searchTerm) {
        cargarPokemones();
        return;
    }

    showLoading(true);
    
    fetch(`http://localhost:5000/api/pokemons/search?q=${searchTerm}`, {
        headers: {
            Authorization: token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la búsqueda");
        }
        return response.json();
    })
    .then(pokemons => {
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
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error en la búsqueda:", error);
        showErrorAlert("Error al buscar pokémones");
    })
    .finally(() => {
        showLoading(false);
    });
}

function handlePokemonSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
        showErrorAlert("Debes iniciar sesión primero");
        return;
    }

    const nuevoPokemon = {
        nombre: document.getElementById("nombre").value,
        tipo: document.getElementById("tipo").value,
        nivel: parseInt(document.getElementById("nivel").value),
        habilidades: document.getElementById("habilidades").value,
        peso: parseFloat(document.getElementById("peso").value),
        altura: parseFloat(document.getElementById("altura").value),
        genero: document.getElementById("genero").value,
        region: document.getElementById("region").value,
    };

    if (!nuevoPokemon.nombre || !nuevoPokemon.tipo || !nuevoPokemon.nivel || 
        !nuevoPokemon.habilidades || !nuevoPokemon.peso || !nuevoPokemon.altura || 
        !nuevoPokemon.genero || !nuevoPokemon.region) {
        showErrorAlert("Por favor completa todos los campos");
        return;
    }

    showLoading(true);
    
    fetch("http://localhost:5000/api/pokemons", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify(nuevoPokemon)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(() => {
        showSuccessAlert("Pokémon agregado exitosamente");
        cargarPokemones();
        document.getElementById("pokemonForm").reset();
    })
    .catch(error => {
        console.error("Error al agregar Pokémon:", error);
        showErrorAlert(error.error || "Error al agregar Pokémon");
    })
    .finally(() => {
        showLoading(false);
    });
}

function editarPokemon(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        showErrorAlert("Debes iniciar sesión primero");
        return;
    }

    const nuevoNombre = prompt("Ingrese el nuevo nombre del Pokémon:");
    if (!nuevoNombre || nuevoNombre.trim().length === 0) {
        showErrorAlert("Nombre no válido");
        return;
    }

    showLoading(true);
    
    fetch(`http://localhost:5000/api/pokemons/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({ nombre: nuevoNombre })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(() => {
        showSuccessAlert("Pokémon actualizado correctamente");
        cargarPokemones();
    })
    .catch(error => {
        console.error("Error al actualizar Pokémon:", error);
        showErrorAlert(error.error || "Error al actualizar Pokémon");
    })
    .finally(() => {
        showLoading(false);
    });
}

function eliminarPokemon(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        showErrorAlert("Debes iniciar sesión primero");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este Pokémon?")) return;

    showLoading(true);
    
    fetch(`http://localhost:5000/api/pokemons/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: token
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(() => {
        showSuccessAlert("Pokémon eliminado correctamente");
        cargarPokemones();
    })
    .catch(error => {
        console.error("Error al eliminar Pokémon:", error);
        showErrorAlert(error.error || "Error al eliminar Pokémon");
    })
    .finally(() => {
        showLoading(false);
    });
}

function showLoading(show) {
    const loadingElement = document.getElementById("loading");
    if (!loadingElement && show) {
        const loader = document.createElement("div");
        loader.id = "loading";
        loader.style.position = "fixed";
        loader.style.top = "0";
        loader.style.left = "0";
        loader.style.width = "100%";
        loader.style.height = "100%";
        loader.style.backgroundColor = "rgba(0,0,0,0.5)";
        loader.style.display = "flex";
        loader.style.justifyContent = "center";
        loader.style.alignItems = "center";
        loader.style.zIndex = "1000";
        
        const spinner = document.createElement("div");
        spinner.style.border = "5px solid #f3f3f3";
        spinner.style.borderTop = "5px solid #3b4cca";
        spinner.style.borderRadius = "50%";
        spinner.style.width = "50px";
        spinner.style.height = "50px";
        spinner.style.animation = "spin 1s linear infinite";
        
        loader.appendChild(spinner);
        document.body.appendChild(loader);
        
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    } else if (loadingElement && !show) {
        loadingElement.remove();
    }
}

function showSuccessAlert(message) {
    const alert = document.createElement("div");
    alert.style.position = "fixed";
    alert.style.bottom = "20px";
    alert.style.right = "20px";
    alert.style.backgroundColor = "#4CAF50";
    alert.style.color = "white";
    alert.style.padding = "15px";
    alert.style.borderRadius = "5px";
    alert.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    alert.style.zIndex = "1000";
    alert.style.animation = "fadeIn 0.3s";
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = "fadeOut 0.3s";
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
}

function showErrorAlert(message) {
    const alert = document.createElement("div");
    alert.style.position = "fixed";
    alert.style.bottom = "20px";
    alert.style.right = "20px";
    alert.style.backgroundColor = "#f44336";
    alert.style.color = "white";
    alert.style.padding = "15px";
    alert.style.borderRadius = "5px";
    alert.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    alert.style.zIndex = "1000";
    alert.style.animation = "fadeIn 0.3s";
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = "fadeOut 0.3s";
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
}



