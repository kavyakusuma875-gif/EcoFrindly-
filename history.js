const email = localStorage.getItem("email");

async function loadHistory(){

    const res = await fetch("http://localhost:5000/api/reports");

    const reports = await res.json();

    const myReports = reports.filter(r => r.email === email);

    const container = document.getElementById("historyList");

    container.innerHTML = "";

    myReports.forEach(report=>{

        container.innerHTML += `

        <div class="report-card">

            ${
                report.image
                ?
                `<img src="/uploads/${report.image}">`
                :
                `<img src="https://via.placeholder.com/400x220?text=No+Image">`
            }

            <div class="report-content">

                <h3>${report.title}</h3>

                <p><b>♻ Waste Type:</b> ${report.wasteType}</p>

                <p><b>💡 AI Suggestion:</b> ${report.suggestion}</p>

                <p><b>📍 Location:</b> ${report.location}</p>

                <p><b>📅 Date:</b> ${new Date(report.createdAt).toLocaleDateString()}</p>

                <p><b>Status:</b> ${report.status}</p>

            </div>

        </div>

        `;

    });

}

loadHistory();