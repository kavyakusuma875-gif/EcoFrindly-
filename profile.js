async function loadProfile() {

    try {

        const email = localStorage.getItem("email");

        if (!email) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        // Load User
        const res = await fetch(`https://ecofriendly-backend.onrender.com/api/auth/profile/${email}`);

        if (!res.ok) {
            throw new Error("Profile API failed");
        }

        const user = await res.json();

        document.getElementById("userName").innerText = user.name;
        document.getElementById("userEmail").innerText = user.email;
        document.getElementById("userPoints").innerText = user.points || 0;

        // Load Reports
        const reportRes = await fetch("https://ecofriendly-backend.onrender.com/api/reports");

        let myReports = [];

        if (reportRes.ok) {
            const reportData = await reportRes.json();
            myReports = reportData.filter(report => report.email === email);
        }

        document.getElementById("userReports").innerText = myReports.length;
        document.getElementById("profileReports").innerText = myReports.length;
        document.getElementById("profilePoints").innerText = user.points || 0;

        let badge = "🌱 Eco Beginner";

        if (user.points >= 200)
            badge = "👑 Eco Legend";
        else if (user.points >= 100)
            badge = "🥇 Eco Champion";
        else if (user.points >= 50)
            badge = "🥈 Eco Warrior";

        document.getElementById("badge").innerText = badge;
        

    } catch (error) {

        console.error(error);

        alert("Unable to load profile.");

    }

}

loadProfile();