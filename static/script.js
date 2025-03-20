document.addEventListener("DOMContentLoaded", function () {
    loadPasswords();
});

function loadPasswords() {
    fetch("/get_passwords")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("passwordTable");
            tableBody.innerHTML = "";
            data.forEach(item => {
                const row = `<tr>
                    <td>${item.website}</td>
                    <td>${item.username}</td>
                    <td>
                        <span id="password-${item.id}">*******</span>
                    </td>
                    <td>
                        <button onclick="togglePassword(${item.id})" id="toggle-btn-${item.id}">Show</button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        });
}

function togglePassword(id) {
    const passwordSpan = document.getElementById(`password-${id}`);
    const toggleButton = document.getElementById(`toggle-btn-${id}`);

    if (toggleButton.textContent === "Show") {
        fetch(`/get_password/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.password) {
                    passwordSpan.textContent = data.password;
                    toggleButton.textContent = "Hide";
                } else {
                    alert("Error retrieving password!");
                }
            });
    } else {
        passwordSpan.textContent = "*******";
        toggleButton.textContent = "Show";
    }
}

function addPassword() {
    const website = document.getElementById("website").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (website === "" || username === "" || password === "") {
        alert("All fields are required!");
        return;
    }

    fetch("/add_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website, username, password })
    })
    .then(response => response.json())
    .then(() => {
        loadPasswords();
        document.getElementById("website").value = "";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    });
}

function generatePassword() {
    fetch("/generate_password")
        .then(response => response.json())
        .then(data => {
            document.getElementById("password").value = data.password;
        });
}
