document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("email", email);
            alert("Login Successful");
            window.location.href = "dashboard.html";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error(error);
        alert("Server Error");
    }
});