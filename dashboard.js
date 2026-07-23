// Logged in user
const email = localStorage.getItem("email");

function showNotification(message){

    const box = document.getElementById("notification");
     if(!box) return;

    box.innerHTML = message;

    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    },3000);

}


// Load Dashboard
async function loadDashboard(){

    try{

        const userRes = await fetch(`http://localhost:5000/api/auth/profile/${email}`);
        const user = await userRes.json();

        const userName = document.getElementById("userName");

        if(userName){
            userName.innerText = user.name;
        }

        document.getElementById("points").innerText = user.points || 0;

        if(user.points >= 100){
            document.getElementById("dashboardBadge").innerText = "🥇 Eco Champion";
        }
        else if(user.points >= 50){
            document.getElementById("dashboardBadge").innerText = "🥈 Eco Warrior";
        }
        else{
            document.getElementById("dashboardBadge").innerText = "🌱 Eco Beginner";
        }

        const progress = Math.min((user.points/100)*100,100);

        document.getElementById("progressFill").style.width = progress + "%";

        document.getElementById("progressText").innerText =
        user.points >= 100
        ? "🏆 Eco Champion Achieved"
        : `${100-user.points} more points to unlock Eco Champion`;

        await loadReports();
        await loadCharts();

    }
    catch(error){

        console.log(error);

    }

}
// Load Reports
async function loadReports(){

    try{

        const res = await fetch("http://localhost:5000/api/reports");

        const reports = await res.json();

        const myReports = reports.filter(r=>r.email===email);

        document.getElementById("totalReports").innerText = myReports.length;

        const container = document.getElementById("reportList");

        container.innerHTML = "";

        myReports.forEach(report=>{

            container.innerHTML += `

            <div class="report-card">

                ${
                    report.image
                    ? `<img src="/uploads/${report.image}" alt="Waste Image">`
                    : `<img src="https://via.placeholder.com/400x220?text=No+Image">`
                }

                <div class="report-content">

                    <h3>${report.title}</h3>

                    <p>📍 ${report.location}</p>

                    <p>${report.description}</p>
                    <p style="color:green;font-weight:bold;">
♻ ${report.suggestion}
</p>

                    <p>📅 ${new Date(report.createdAt).toLocaleDateString()}</p>

                    <span class="status ${report.status.toLowerCase()}">
                        ${report.status}
                    </span>

                    <button
                        class="delete-btn"
                        onclick="deleteReport('${report._id}')">
                        🗑 Delete Report
                    </button>

                </div>

            </div>

            `;

        });

    }
    catch(error){

        console.log(error);

    }

}
async function deleteReport(id){

    if(!confirm("Delete this report?")){
        return;
    }

    try{

        await fetch(`http://localhost:5000/api/reports/${id}`,{
            method:"DELETE"
        });

        showNotification("🗑 Report Deleted Successfully");

        await loadDashboard();

    }
    catch(error){

        console.log(error);

    }

}
// Submit Report
// ===========================
// Submit Report
// ===========================

document.getElementById("reportForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    try{
        const formData = new FormData();

        formData.append("title", document.getElementById("title").value);
        formData.append("email", email);
        formData.append("location", document.getElementById("location").value);
        formData.append("description", document.getElementById("description").value);

        const image = document.getElementById("image").files[0];

        if (image) {
            formData.append("image", image);
        }

        navigator.geolocation.getCurrentPosition(async (position) => {

    formData.append("latitude", position.coords.latitude);
    formData.append("longitude", position.coords.longitude);

    const res = await fetch("http://localhost:5000/api/reports", {

        method: "POST",

        body: formData

    });

    const data = await res.json();

    if (!res.ok) {

        showNotification("❌ " + data.message);

        return;

    }

    showNotification("✅ Report Submitted Successfully");

}, (error) => {

    alert("Please allow location access.");

    console.log(error);

});
        // Submit Report

        const res = await fetch("http://localhost:5000/api/reports",{

            method:"POST",

            body:formData

        });

        const data = await res.json();

        if(!res.ok){

            showNotification("❌ " + data.message);

            return;

        }

        showNotification("✅ Report Submitted Successfully");

        // Add Reward Points

        await fetch("http://localhost:5000/api/auth/addPoints",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                email,

                points:10

            })

        });

         console.log(data.report);
        showNotification("⭐ +10 Reward Points Added");
        document.getElementById("aiCard").style.display = "block";

document.getElementById("aiWasteType").innerText =
    data.report.wasteType;

document.getElementById("aiSuggestion").innerText =
    data.report.suggestion;

document.getElementById("aiStatus").innerText =
    data.report.status;


        document.getElementById("reportForm").reset();

        loadDashboard();

        loadReports();

        loadCharts();

    }

    catch(error){

        console.log(error);

        showNotification("❌ Failed to submit report");

    }

});
let statusChart = null;
let locationChart = null;

async function loadCharts() {

    const statusCanvas = document.getElementById("statusChart");
    const locationCanvas = document.getElementById("locationChart");

    if (!statusCanvas || !locationCanvas) return;

    const res = await fetch("http://localhost:5000/api/reports");
    const reports = await res.json();

    const approved = reports.filter(r => r.status === "Approved").length;
    const pending = reports.filter(r => r.status === "Pending").length;

    if (statusChart) statusChart.destroy();
    if (locationChart) locationChart.destroy();

    statusChart = new Chart(statusCanvas, {
        type: "pie",
        data: {
            labels: ["Approved", "Pending"],
            datasets: [{
                data: [approved, pending],
                backgroundColor: ["#2ecc71", "#f39c12"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    const locations = {};

    reports.forEach(report => {
        locations[report.location] = (locations[report.location] || 0) + 1;
    });

    locationChart = new Chart(locationCanvas, {
        type: "bar",
        data: {
            labels: Object.keys(locations),
            datasets: [{
                label: "Reports",
                data: Object.values(locations),
                backgroundColor: "#3498db"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

}

function loadActivities() {

    const list = document.getElementById("activityList");

    if (!list) return;

    list.innerHTML = "";

    const activities = [

        "👤 Logged into EcoFriendly+",
        "🔥 Daily streak updated",
        "🏆 Eco Beginner badge unlocked",
        "⭐ You earned 10 reward points",
        "📝 Waste report submitted"

    ];

    activities.forEach(activity => {

        const li = document.createElement("li");

        li.className = "activity-item";

        li.innerHTML = activity;

        list.appendChild(li);

    });

}
// Download PDF (Only if button exists)
const downloadBtn = document.getElementById("downloadPDF");

if (downloadBtn) {

    downloadBtn.addEventListener("click", async () => {

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF();

        const res = await fetch("http://localhost:5000/api/reports");

        const reports = await res.json();

        const myReports = reports.filter(r => r.email === email);

        pdf.setFontSize(18);
        pdf.text("EcoFriendly+ Waste Reports", 20, 20);

        let y = 40;

        myReports.forEach((report, index) => {

            pdf.setFontSize(12);

            pdf.text(`${index + 1}. ${report.title}`, 20, y);
            pdf.text(`Location : ${report.location}`, 20, y + 8);
            pdf.text(`Status : ${report.status}`, 20, y + 16);
            pdf.text(`Date : ${new Date(report.createdAt).toLocaleDateString()}`, 20, y + 24);

            y += 38;

            if (y > 260) {
                pdf.addPage();
                y = 20;
            }

        });

        pdf.save("MyWasteReports.pdf");

    });

}
loadDashboard();
loadActivities();

const certificateBtn = document.getElementById("downloadCertificate");

if (certificateBtn) {

certificateBtn.addEventListener("click", async () => {

const res = await fetch("http://localhost:5000/api/reports");

const reports = await res.json();

const approvedReports = reports.filter(r =>
r.email === email &&
r.status === "Approved"
);

if (approvedReports.length < 5) {

showNotification("❌ Need at least 5 Approved Reports");

return;

}

const { jsPDF } = window.jspdf;

const pdf = new jsPDF();

pdf.setFontSize(24);

pdf.text("Certificate of Appreciation", 35, 35);

pdf.setFontSize(16);

pdf.text("Presented To", 80, 55);

pdf.setFontSize(22);

pdf.text(localStorage.getItem("name") || email, 50, 75);

pdf.setFontSize(14);

pdf.text(
"For actively contributing to cleaner cities through EcoFriendly+",
20,
95
);

pdf.text(
"Congratulations on completing 5 Approved Waste Reports!",
25,
115
);

pdf.text(
"🌱 Keep Saving Nature 🌍",
60,
145
);

pdf.save("EcoFriendly_Certificate.pdf");

showNotification("🏆 Certificate Downloaded");

});

}
// ===============================
// ECO SCORE
// ===============================

async function loadEcoScore() {

    const email = localStorage.getItem("email");

    const userRes = await fetch(`http://localhost:5000/api/auth/profile/${email}`);
    const user = await userRes.json();

    const res = await fetch("http://localhost:5000/api/reports");
    const reports = await res.json();

    const myReports = reports.filter(r => r.email === email);

    const approved = myReports.filter(r => r.status === "Approved").length;
    const pending = myReports.filter(r => r.status === "Pending").length;

    let ecoScore =
        (approved * 15) +
        (pending * 5) +
        (user.points || 0) +
        ((user.streak || 0) * 2);

    if (ecoScore > 100) ecoScore = 100;

    const ecoScoreText = document.getElementById("ecoScore");
    const ecoFill = document.getElementById("ecoFill");
    const ecoLevel = document.getElementById("ecoLevel");

    if (ecoScoreText) ecoScoreText.innerText = ecoScore + "/100";
    if (ecoFill) ecoFill.style.width = ecoScore + "%";

    let level = "🌱 Eco Beginner";

    if (ecoScore >= 80) {
        level = "🏆 Eco Champion";
    } else if (ecoScore >= 50) {
        level = "🥈 Eco Warrior";
    } else if (ecoScore >= 30) {
        level = "🥉 Eco Helper";
    }

    if (ecoLevel) ecoLevel.innerText = level;
}


// ===============================
// PAGE LOAD
// ===============================

const ecoTips = [

"Carry a reusable water bottle instead of buying plastic bottles.",

"Separate wet and dry waste before disposal.",

"Recycle paper whenever possible.",

"Turn off lights when leaving a room.",

"Plant at least one tree every year.",

"Use cloth bags instead of plastic bags.",

"Repair items before throwing them away.",

"Save water while brushing your teeth.",

"Compost kitchen waste to reduce landfill.",

"Choose public transport or cycle for short trips."

];

function changeTip(){

    const random = Math.floor(Math.random() * ecoTips.length);

    document.getElementById("ecoTip").innerText = ecoTips[random];

}

window.onload = async function () {

    await loadDashboard();

    loadActivities();

    await loadEcoScore();

};

// ===========================
// DARK MODE
// ===========================

const darkBtn = document.getElementById("darkModeToggle");

if (darkBtn) {

    // Restore saved mode
    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark");

        darkBtn.innerHTML = "☀ Light Mode";

    }

    darkBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");

            darkBtn.innerHTML = "☀ Light Mode";

        }

        else {

            localStorage.setItem("theme", "light");

            darkBtn.innerHTML = "🌙 Dark Mode";

        }

    });

}
// ===========================
// LOAD NOTIFICATIONS
// ===========================

async function loadNotifications() {

    const email = localStorage.getItem("email");

    const container = document.getElementById("notificationList");

    if (!container) return;

    try {

        const res = await fetch("http://localhost:5000/api/reports");

        const reports = await res.json();

        const myReports = reports.filter(r => r.email === email);

        let html = "";

        html += `
        <p>👋 Welcome back!</p>
        `;

        html += `
        <p>🎁 Daily Login Reward : +5 Points</p>
        `;

        if (myReports.length > 0) {

            const latest = myReports[0];

            html += `
            <p>♻ Latest Report : <b>${latest.title}</b></p>
            `;

            html += `
            <p>📍 ${latest.location}</p>
            `;

            html += `
            <p>📌 Status : ${latest.status}</p>
            `;

        }

        const approved = myReports.filter(r => r.status === "Approved");

        if (approved.length > 0) {

            html += `
            <p>🏆 Congratulations! ${approved.length} Report(s) Approved</p>
            `;

        }

        container.innerHTML = html;

    }

    catch (err) {

        console.log(err);

    }

}

loadNotifications();

// ===========================
// SUBMIT REVIEW
// ===========================

const reviewBtn = document.getElementById("submitReview");

if (reviewBtn) {

    reviewBtn.addEventListener("click", async () => {

        console.log("Review button clicked");

        const name = localStorage.getItem("name") || "User";
        const email = localStorage.getItem("email");

        const rating = document.getElementById("rating").value;
        const feedback = document.getElementById("feedback").value.trim();

        if (!feedback) {
            alert("Please enter your feedback.");
            return;
        }

        try {

            const res = await fetch("http://localhost:5000/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    rating: Number(rating),
                    feedback
                })
            });

            const data = await res.json();

            if (res.ok) {

                showNotification("⭐ Thank you for your feedback!");
                document.getElementById("feedback").value = "";
                document.getElementById("rating").value = "5";

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.error(err);
            alert("Server Error");

        }

    });

}

// Challenge Progress

const completed = Number(localStorage.getItem("completedChallenges")) || 0;

const challengeFill = document.getElementById("challengeFill");
const challengeText = document.getElementById("challengeText");

if (challengeFill && challengeText) {

    const total = 4;

    const percent = (completed / total) * 100;

    challengeFill.style.width = percent + "%";

    challengeText.innerHTML = completed + " / " + total + " Challenges Completed";

}