function showToast(message,type="success"){

    const toast=document.getElementById("toast");

    toast.innerHTML=message;

    toast.className="toast";

    if(type==="error"){

        toast.classList.add("error");

    }

    if(type==="warning"){

        toast.classList.add("warning");

    }

    if(type==="info"){

        toast.classList.add("info");

    }

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}


async function loadAdminCharts() {

    const res = await fetch("http://localhost:5000/api/reports");
    const reports = await res.json();

    // =====================
    // Monthly Reports
    // =====================

    const months = {};

    reports.forEach(report => {

        const month = new Date(report.createdAt).toLocaleString("default", {
            month: "short"
        });

        months[month] = (months[month] || 0) + 1;

    });

    new Chart(document.getElementById("monthlyChart"), {

        type: "bar",

        data: {

            labels: Object.keys(months),

            datasets: [{

                label: "Reports",

                data: Object.values(months),

                backgroundColor: "#3498db"

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

    // =====================
    // Top Locations
    // =====================

    const locations = {};

    reports.forEach(report => {

        locations[report.location] =
            (locations[report.location] || 0) + 1;

    });

    new Chart(document.getElementById("locationChart"), {

        type: "pie",

        data: {

            labels: Object.keys(locations),

            datasets: [{

                data: Object.values(locations),

                backgroundColor: [

                    "#3498db",

                    "#2ecc71",

                    "#f39c12",

                    "#9b59b6",

                    "#e74c3c"

                ]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

    // =====================
    // Waste Type
    // =====================

    const waste = {};

    reports.forEach(report => {

        waste[report.wasteType] =
            (waste[report.wasteType] || 0) + 1;

    });

    new Chart(document.getElementById("wasteChart"), {

        type: "doughnut",

        data: {

            labels: Object.keys(waste),

            datasets: [{

                data: Object.values(waste),

                backgroundColor: [

                    "#2ecc71",

                    "#3498db",

                    "#f39c12",

                    "#9b59b6",

                    "#e74c3c"

                ]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

    // =====================
    // Active Users
    // =====================

    const users = {};

    reports.forEach(report => {

        users[report.email] =
            (users[report.email] || 0) + 1;

    });

    new Chart(document.getElementById("userChart"), {

        type: "bar",

        data: {

            labels: Object.keys(users),

            datasets: [{

                label: "Reports",

                data: Object.values(users),

                backgroundColor: "#8e44ad"

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}
// ===========================
// CUSTOM CONFIRM POPUP
// ===========================

function showConfirm(title, message, callback){

    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMessage").innerText = message;

    const modal = document.getElementById("customModal");
    modal.style.display = "flex";

    document.getElementById("modalOk").onclick = () => {

        modal.style.display = "none";
        callback(true);

    };

    document.getElementById("modalCancel").onclick = () => {

        modal.style.display = "none";
        callback(false);

    };

}


// ===========================
// APPROVE REPORT
// ===========================

function approveReport(id){

    showConfirm(
        "✅ Approve Report",
        "Are you sure you want to approve this report?",
        async(result)=>{

            if(!result) return;

            try{

                const res = await fetch(`http://localhost:5000/api/reports/approve/${id}`,{
                    method:"PUT"
                });

                const data = await res.json();

                alert(data.message);

                loadAdminReports();

            }

            catch(error){

                console.log(error);

            }

        }
    );

}


// ===========================
// DELETE REPORT
// ===========================

function deleteReport(id){

    showConfirm(
        "🗑 Delete Report",
        "Are you sure you want to delete this report?",
        async(result)=>{

            if(!result) return;

            try{

                const res = await fetch(`http://localhost:5000/api/reports/${id}`,{
                    method:"DELETE"
                });

                const data = await res.json();

                showToast(data.message);

                loadAdminReports();

            }

            catch(error){

                console.log(error);

            }

        }
    );

}
// ===========================
// LOAD REPORTS
// ===========================

async function loadAdminReports(){

    const res = await fetch("http://localhost:5000/api/reports");

    const reports = await res.json();
    const searchText = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

const statusFilter = document
    .getElementById("statusFilter")
    .value;

    document.getElementById("adminReports").innerText = reports.length;

    document.getElementById("approvedReports").innerText =
        reports.filter(r=>r.status==="Approved").length;

    document.getElementById("pendingReports").innerText =
        reports.filter(r=>r.status==="Pending").length;

    const container = document.getElementById("adminReportList");

    container.innerHTML="";

    reports
.filter(report => {

    const matchSearch =
    (report.title || "").toLowerCase().includes(searchText) ||
    (report.location || "").toLowerCase().includes(searchText);

    const matchStatus =
        statusFilter === "All" ||
        report.status === statusFilter;

    return matchSearch && matchStatus;

})
.forEach(report => {

        container.innerHTML += `

        <div class="report-card">

            ${
                report.image
                ? `<img src="/uploads/${report.image}" alt="Waste Image">`
                : `<img src="https://via.placeholder.com/400x220?text=No+Image">`
            }

            <div class="report-content">

                <h3>${report.title}</h3>

                <p><b>Email:</b> ${report.email}</p>

                <p>📍 ${report.location}</p>

<a
href="https://www.google.com/maps/search/${encodeURIComponent(report.location)}"
target="_blank">

<button class="map-btn">

🗺 Open Location

</button>

</a>

                <p>${report.description}</p>
                <p><b>♻ Waste Type:</b> ${report.wasteType}</p>

                <p>

                    Status :

                    <span class="status ${report.status.toLowerCase()}">

                        ${report.status}

                    </span>

                </p>

               ${
report.status === "Pending"
?
`
<button
class="approve-btn"
onclick="approveReport('${report._id}')">

✅ Approve

</button>
`
:
`
<button
class="approve-btn"
disabled
style="background:#27ae60;cursor:not-allowed;">

✔ Approved

</button>
`
}

                <button
                class="delete-btn"
                onclick="deleteReport('${report._id}')">

                🗑 Delete

                </button>

            </div>

        </div>

        `;

    });

}


// ===========================

loadAdminReports();


document
.getElementById("searchInput")
.addEventListener("input", loadAdminReports);

document
.getElementById("statusFilter")
.addEventListener("change", loadAdminReports);

loadAdminReports();
loadAdminCharts();
document
.getElementById("searchInput")
.addEventListener("input", loadAdminReports);

document
.getElementById("statusFilter")
.addEventListener("change", loadAdminReports);

// ======================
// Export Excel
// ======================

document.getElementById("exportExcel").addEventListener("click", async ()=>{

    const res = await fetch("http://localhost:5000/api/reports");

    const reports = await res.json();

    const data = reports.map(r=>({

        Title:r.title,

        Email:r.email,

        Location:r.location,

        WasteType:r.wasteType,

        Status:r.status,

        Date:new Date(r.createdAt).toLocaleDateString()

    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook,worksheet,"Waste Reports");

    XLSX.writeFile(workbook,"WasteReports.xlsx");

});


// ======================
// Export PDF
// ======================

document.getElementById("exportPDF").addEventListener("click", async ()=>{

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    const res = await fetch("http://localhost:5000/api/reports");

    const reports = await res.json();

    const rows = reports.map(r=>[

        r.title,

        r.location,

        r.wasteType,

        r.status,

        new Date(r.createdAt).toLocaleDateString()

    ]);

    pdf.text("Waste Management Report",14,15);

    pdf.autoTable({

        head:[["Title","Location","Waste Type","Status","Date"]],

        body:rows,

        startY:25

    });

    pdf.save("WasteReports.pdf");

});

async function loadAdminStats() {

    const res = await fetch("http://localhost:5000/api/admin/stats");

    const data = await res.json();

    document.getElementById("totalUsers").innerText = data.totalUsers;

    document.getElementById("adminReports").innerText = data.totalReports;

    document.getElementById("approvedReports").innerText = data.approvedReports;

}
loadAdminStats();
async function loadPrediction(){

    const res = await fetch("http://localhost:5000/api/reports");

    const reports = await res.json();

    const months = {};

    reports.forEach(report=>{

        const month = new Date(report.createdAt)
        .toLocaleString("default",{month:"short"});

        months[month]=(months[month]||0)+1;

    });

    const labels=Object.keys(months);

    const values=Object.values(months);

    const current=values[values.length-1]||0;

    const previous=values[values.length-2]||current;

    // Simple AI Prediction

    const predicted=Math.round(current+(current-previous)*0.5);

    document.getElementById("currentReports").innerText=current;

    document.getElementById("predictedReports").innerText=predicted;

    new Chart(document.getElementById("predictionChart"),{

        type:"line",

        data:{

            labels:[...labels,"Next Month"],

            datasets:[{

                label:"Waste Reports",

                data:[...values,predicted],

                borderColor:"#27ae60",

                backgroundColor:"rgba(39,174,96,0.2)",

                fill:true,

                tension:0.4

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}
loadPrediction();

function showConfirm(title, message, callback){

    const modal = document.getElementById("customModal");

    document.getElementById("modalTitle").innerText = title;

    document.getElementById("modalMessage").innerText = message;

    modal.style.display = "flex";

    document.getElementById("modalOk").onclick = () => {
        modal.style.display = "none";
        callback(true);
    };

    document.getElementById("modalCancel").onclick = () => {
        modal.style.display = "none";
        callback(false);
    };

}

function showToast(message, success = true){

    const toast = document.getElementById("toast");

    toast.innerHTML = message;

    if(success){

        toast.classList.remove("error");

    }else{

        toast.classList.add("error");

    }

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}