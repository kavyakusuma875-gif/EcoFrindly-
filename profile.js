
async function loadProfile(){

    try{

        const email = localStorage.getItem("email");

        if(!email){

            alert("Please login first.");

            window.location.href = "index.html";

            return;

        }

        // Load User
        const res = await fetch(`http://localhost:5000/api/auth/profile/${email}`);

        const user = await res.json();

        document.getElementById("userName").innerText = user.name;

        document.getElementById("userEmail").innerText = user.email;

        document.getElementById("userPoints").innerText = user.points || 0;

        // Load Reports
        const reportRes = await fetch("http://localhost:5000/api/reports");

        const reportData = await reportRes.json();

        const myReports = reportData.filter(report => report.email === email);

        // Main Cards
        document.getElementById("userReports").innerText = myReports.length;

        // Profile Statistics
        document.getElementById("profileReports").innerText = myReports.length;

        document.getElementById("profilePoints").innerText = user.points || 0;

        // Badge
        let badge = "";

        if(user.points >= 200){

            badge = "👑 Eco Legend";

        }
        else if(user.points >= 100){

            badge = "🥇 Eco Champion";

        }
        else if(user.points >= 50){

            badge = "🥈 Eco Warrior";

        }
        else{

            badge = "🌱 Eco Beginner";

        }

        document.getElementById("badge").innerText = badge;

        document.getElementById("profileBadge").innerText = badge;
    }



    catch(error){

        console.log(error);

        alert("Unable to load profile.");

    }
}

loadProfile();
