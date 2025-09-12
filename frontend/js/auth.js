const API_URL = "http://localhost:3000"; // ajuste se precisar

// Registro
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const logoutButton = document.getElementById("logout")
const getProfile = document.getElementById("get-profile")



if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();


        const body = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            birthday: document.getElementById("birthDate").value
        };

        console.log(body)
        try {
            const res = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Usuário registrado com sucesso!");
                window.location.href = "login.html";
            } else {
                alert(data.message || "Erro ao registrar usuário");
            }
        } catch (err) {
            console.error("Erro ao registrar:", err);
            alert("Erro inesperado. Tente novamente.");
        }
    });
}


if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);

        const body = {
        email: formData.get("email"),
        password: formData.get("password"),
        };

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json",},
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                const token = data.token; // pegamos o token JWT da API
                localStorage.setItem('token', token);
                window.location.href = "../index.html"; // redireciona p/ dashboard
            } else {
                alert(data.message || "Erro ao fazer login");
            }
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            alert("Erro inesperado. Tente novamente.");
        }
    });
}

if(getProfile) {
    getProfile.addEventListener('click', async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${API_URL}/me`, {
                method: "GET",
                headers: { "authorization": `Bearer ${localStorage.getItem("token")}`}
            })

            const data = await res.json()
            if (res.ok) {
                alert(data)     
                document.getElementById("output").innerHTML = `
                <div>
                    <p>${data.id}</p>
                    <p>${data.name}</p>
                    <p>${data.email}</p>
                    <p>${data.phone}</p>
                    <p>${data.gender}</p>
                    <p>${data.birthday}</p>
                    <p>${data.createdAt}</p>
                </div>`
            }
        } catch (err){
            console.error("Erro ao exibir profile", err)
        }
    }) 
}

if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        window.location.href = "../pages/login.html"
    })
}