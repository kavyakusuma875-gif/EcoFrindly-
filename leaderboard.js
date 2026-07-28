window.onload = async function () {

    const tbody = document.querySelector("#leaderboardTable tbody");

    try {

        const res = await fetch("https://ecofriendly-backend.onrender.com/api/auth/leaderboard");

        const users = await res.json();

        tbody.innerHTML = "";

        for (let i = 0; i < users.length; i++) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${users[i].name}</td>
                <td>${users[i].points}</td>
            `;

            tbody.appendChild(row);

        }

    } catch (err) {

        alert("Leaderboard Error");

        console.log(err);

    }

};