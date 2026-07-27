// ===============================
// LOGIN FORM
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {

            const res = await fetch("https://ecofriendly-backend.onrender.com/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await res.json();

            if (res.ok) {

                localStorage.setItem("email", email);

                alert("✅ Login Successful");

                window.location.href = "dashboard.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

            alert("Server Error");

        }

    });

}


// ===============================
// IMAGE SLIDER
// ===============================

const slider = document.getElementById("sliderImage");

if (slider) {

    const images = [

        "images/1.jpg",
        "images/2.jpg",
        "images/3.jpg",
        "images/4.jpg"

    ];

    let current = 0;

    setInterval(() => {

        current++;

        if (current >= images.length) {

            current = 0;

        }

        slider.src = images[current];

    }, 3000);

}