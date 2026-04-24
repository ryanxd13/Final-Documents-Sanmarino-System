// complaints.js

document.addEventListener('DOMContentLoaded', function() {
    const complaintForm = document.getElementById("complaintForm");

    if (complaintForm) {
        complaintForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Pagkuha ng inputs
            const serviceId = document.getElementById('compServiceId').value;
            const type = document.getElementById('compType').value;
            const location = document.getElementById('compLocation').value;
            const date = document.getElementById('compDate').value;
            const description = document.getElementById('compDescription').value;

            // Kunin ang mga dating complaints o gumawa ng bagong array
            let storageKey = 'brgyComplaints';
            let complaints = JSON.parse(localStorage.getItem(storageKey)) || [];

            // Gumawa ng Tracking ID (e.g., BRGY-2026-001)
            const trackingId = "SR-" + Math.floor(1000 + Math.random() * 9000);

            const newComplaint = {
                trackingId: trackingId,
                serviceId: serviceId,
                type: type,
                location: location,
                dateOccurred: date,
                description: description,
                status: "Pending",
                dateFiled: new Date().toLocaleDateString()
            };

            // I-save
            complaints.push(newComplaint);
            localStorage.setItem(storageKey, JSON.stringify(complaints));

            // Feedback sa user
            alert("Complaint Submitted Successfully!\nTracking ID: " + trackingId);
            
            // Reset at Close
            complaintForm.reset();
            if (window.closeComplaintModal) window.closeComplaintModal();
        });
    }
});