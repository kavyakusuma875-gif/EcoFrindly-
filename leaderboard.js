async function loadLeaderboard(){

    try{

        const res = await fetch("http://localhost:5000/api/auth/leaderboard");

        const users = await res.json();

        const tbody = document.querySelector("#leaderboardTable tbody");

        tbody.innerHTML = "";

        users.forEach((user,index)=>{

            tbody.innerHTML += `

            <tr>

                <td>${index+1}</td>

                <td>${user.name}</td>

                <td>${user.points}</td>

            </tr>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

loadLeaderboard();