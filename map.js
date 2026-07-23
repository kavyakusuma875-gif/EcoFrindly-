const map = L.map("map").setView([13.3409, 77.1010], 12);

// OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

    attribution: "&copy; OpenStreetMap contributors"

}).addTo(map);

// Load Reports
async function loadReports(){

    const res = await fetch("http://localhost:5000/api/reports");

    const reports = await res.json();

    reports.forEach(report=>{

        if(report.latitude && report.longitude){

             L.marker([report.latitude,report.longitude]).addTo(map);

            marker.bindPopup(`
                <b>${report.title}</b><br>
                📍 ${report.location}<br>
                ${report.description}<br>
                <b>Status:</b> ${report.status}
            `);

        }

    });

}

loadReports();