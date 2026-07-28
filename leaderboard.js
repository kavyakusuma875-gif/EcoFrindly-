async function loadLeaderboard() {

    try {

        console.log("Leaderboard JS Loaded");

        const res = await fetch("https://ecofriendly-backend.onrender.com/api/auth/leaderboard");

        console.log("Response Status:", res.status);

        const users = await res.json();

        console.log("Users:", users);

        const tbody = document.querySelector("#leaderboardTable tbody");

        console.log("Table Body:", tbody);

        tbody.innerHTML = "";

        users.forEach((user, index) => {

            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.points}</td>
                </tr>
            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

loadLeaderboard();