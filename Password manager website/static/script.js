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
                    <span id="pass-${item.id}" style="display: none">${item.password || "******"}</span>
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
    const pass = document.getElementById(`pass-${id}`);
    pass.style.display = pass.style.display === "none" ? "inline" : "none";
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
