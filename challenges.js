const buttons = document.querySelectorAll(".challenge-btn");

let completed = 0;
let completedChallenges = Number(localStorage.getItem("completedChallenges")) || 0;

completedChallenges++;

localStorage.setItem("completedChallenges", completedChallenges);



buttons.forEach(button => {

    button.addEventListener("click", async () => {

        if (button.disabled) return;

        const email = localStorage.getItem("email");
        const points = Number(button.dataset.points);

        console.log("Email:", email);
        console.log("Points:", points);

        try {

            const res = await fetch("http://localhost:5000/api/auth/addPoints", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    points
                })

            });

            const data = await res.json();

            console.log(data);

            if (!res.ok) {

                alert(data.message);
                return;

            }

            alert(`🎉 Challenge Completed!\n+${points} Points`);

            button.innerHTML = "✅ Completed";
            button.disabled = true;
            button.style.background = "#888";

            
        }

        catch (err) {

            console.error(err);

            alert("Server Error");

        }

    });

});

