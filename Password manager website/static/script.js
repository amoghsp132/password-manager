const API_BASE = "http://127.0.0.1:5000";

function addPassword() {
    const website = document.getElementById("website").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${API_BASE}/add_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website, username, password })
    }).then(() => loadPasswords());
}

function loadPasswords() {
    const searchQuery = document.getElementById("search").value;
    fetch(`${API_BASE}/get_passwords?search=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById("passwordTable");
        table.innerHTML = ""; 
        data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.website}</td>
                <td>${item.username}</td>
                <td>
                    <span id="pass-${item.id}" style="display: none">******</span>
                    <button onclick="togglePassword(${item.id})">Show/Hide</button>
                </td>
                <td>
                    <button onclick="deletePassword(${item.id})" class="delete-btn">Delete</button>
                </td>
            `;
            table.appendChild(row);
        });
    });
}

function togglePassword(id) {
    const passElement = document.getElementById(`pass-${id}`);
    const buttonElement = passElement.nextElementSibling; // Get the button element

    if (passElement.dataset.loaded === "true") {
        // Toggle visibility if the password is already loaded
        if (passElement.style.display === "none") {
            passElement.style.display = "inline";
            buttonElement.innerText = "Hide";
        } else {
            passElement.style.display = "none";
            buttonElement.innerText = "Show";
        }
    } else {
        // Fetch the password from the backend
        fetch(`${API_BASE}/get_password/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.password) {
                passElement.innerText = data.password;
                passElement.style.display = "inline"; // Show password
                buttonElement.innerText = "Hide";
                passElement.dataset.loaded = "true"; // Mark as loaded
            } else {
                alert("Password not found.");
            }
        });
    }
}


function deletePassword(id) {
    fetch(`${API_BASE}/delete_password/${id}`, { method: "DELETE" })
    .then(() => loadPasswords());
}

function clearDatabase() {
    fetch(`${API_BASE}/clear_database`, { method: "DELETE" })
    .then(() => loadPasswords());
}

function generatePassword() {
    fetch(`${API_BASE}/generate_password`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("password").value = data.password;
    });
}

window.onload = loadPasswords;
