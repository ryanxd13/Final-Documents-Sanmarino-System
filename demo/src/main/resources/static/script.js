// 1. SELECT ELEMENTS
const modal = document.getElementById("residentModal");
const closeBtn = document.querySelector(".close-btn");
const docRequestBtn = document.querySelector(".doc-request-btn");
const residentForm = document.querySelector('.resident-form');

// This variable stores what the user clicked (Inquiry, Report, etc.)
let currentRequestType = "General";

// 2. MODAL CONTROL FUNCTIONS
function openModal() {
    if (modal) modal.style.display = "block";
}

function closeModal() {
    if (modal) modal.style.display = "none";
    currentRequestType = "General"; // Reset after closing
}

// Missing function from your previous snippet - REQUIRED for hover buttons
function openRequestModal(type) {
    console.log("Category selected: " + type);
    currentRequestType = type; 

    // NEW LOGIC: Open the correct modal based on type
    if (type === 'Complaint' || type === 'Report') {
        openComplaintModal(); 
    } else {
        openModal(); // Opens the original residentModal
    }
}

// 3. EVENT LISTENERS
if (closeBtn) closeBtn.onclick = closeModal;

window.onclick = function(event) {
    if (event.target == modal) closeModal();
};

if (docRequestBtn) {
    docRequestBtn.addEventListener('click', () => {
        currentRequestType = "Document Request";
        openModal();
    });
}

// Handle clicks on standard cards (Profile, Announcements)
function handleSystemClick(systemName) {
    console.log("Opening system: " + systemName);
    currentRequestType = systemName;
    openModal();
}

// --- 4. RESIDENT FORM SUBMISSION (With Duplication Check) ---
if (residentForm) {
    residentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Capture Data
        const firstName = residentForm.querySelector('input[placeholder="E.G., JOHN MICHAEL"]').value.trim();
        const lastName = residentForm.querySelector('input[placeholder="E.G., CRUZ"]').value.trim();
        const sex = residentForm.querySelector('select').value;
        const age = parseInt(residentForm.querySelector('input[type="number"]').value) || 0;

        const residents = JSON.parse(localStorage.getItem('brgyResidents')) || [];

        // --- DUPLICATION CHECK ---
        // Checks if a person with the same name and age already exists
        const isDuplicate = residents.some(res => 
            res.firstName.toLowerCase() === firstName.toLowerCase() && 
            res.lastName.toLowerCase() === lastName.toLowerCase() &&
            res.age === age
        );

        if (isDuplicate) {
            alert("Warning: This person is already in the inquiry list.");
            return; // Stops the function here so it won't save
        }

        const newEntry = {
            id: Date.now(),
            lastName: lastName.toUpperCase(),
            firstName: firstName.toUpperCase(),
            sex: sex,
            age: age,
            date: new Date().toLocaleDateString(),
            category: currentRequestType 
        };

        residents.push(newEntry);
        localStorage.setItem('brgyResidents', JSON.stringify(residents));

        alert(`Success! Your ${currentRequestType} has been recorded.`);
        residentForm.reset();
        closeModal();
    });
}

// --- COMPLAINT SUBMISSION LOGIC (With Duplication Check) ---
if (compForm) {
    compForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const serviceId = document.getElementById('compServiceId').value.trim();
        const existingComplaints = JSON.parse(localStorage.getItem('brgyComplaints')) || [];

        // --- DUPLICATION CHECK ---
        // Checks if this Service ID already filed a complaint for the same type today
        const today = new Date().toLocaleDateString('en-GB');
        const isDuplicateComplaint = existingComplaints.some(c => 
            c.serviceId === serviceId && 
            c.type === document.getElementById('compType').value &&
            c.dateFiled === today
        );

        if (isDuplicateComplaint) {
            alert("Error: A similar complaint has already been filed for this Service ID today.");
            return; // Stops the function
        }

        const nextNumber = String(existingComplaints.length + 1).padStart(3, '0');

        const newComplaint = {
            complaintNumber: nextNumber,
            serviceId: serviceId,
            type: document.getElementById('compType').value,
            location: document.getElementById('compLocation').value,
            dateOccurred: document.getElementById('compDate').value,
            description: document.getElementById('compDescription').value,
            dateFiled: today,
            filedBy: serviceId,
            status: "Ongoing"
        };

        existingComplaints.push(newComplaint);
        localStorage.setItem('brgyComplaints', JSON.stringify(existingComplaints));

        alert("Complaint filed successfully! Tracking ID: " + nextNumber);
        compForm.reset();
        closeComplaintModal();
        
        if(typeof loadComplaints === "function") loadComplaints();
    });
}

// Modal Selectors
const compModal = document.getElementById("complaintModal");
const compForm = document.getElementById("complaintForm");

// Open Complaint Modal
function openComplaintModal() {
    compModal.style.display = "block";
}

function closeComplaintModal() {
    compModal.style.display = "none";
}
// --- COMPLAINT SUBMISSION LOGIC ---
if (compForm) {
    compForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Create a dynamic Complaint Number (001, 002, etc)
        const existingComplaints = JSON.parse(localStorage.getItem('brgyComplaints')) || [];
        const nextNumber = String(existingComplaints.length + 1).padStart(3, '0');

        // 2. Map fields to match your Dashboard Table exactly
        const newComplaint = {
            complaintNumber: nextNumber, // Matches "COMPLAINT NUMBER"
            serviceId: document.getElementById('compServiceId').value, // Matches "SERVICE ID"
            type: document.getElementById('compType').value, // Matches "TYPE OF COMPLAINT"
            location: document.getElementById('compLocation').value, // Matches "LOCATION"
            dateOccurred: document.getElementById('compDate').value, // Matches "DATE OCCURRED"
            description: document.getElementById('compDescription').value, // Matches "DESCRIPTION"
            dateFiled: new Date().toLocaleDateString('en-GB'), // Matches "DATE FILED" (DD/MM/YYYY)
            filedBy: document.getElementById('compServiceId').value, // Matches "FILED BY"
            status: "Ongoing" // Default Status
        };

        // 3. Save to LocalStorage
        existingComplaints.push(newComplaint);
        localStorage.setItem('brgyComplaints', JSON.stringify(existingComplaints));

        alert("Complaint filed successfully! Tracking ID: " + nextNumber);
        compForm.reset();
        closeComplaintModal();
        
        // Refresh dashboard if currently viewed (optional)
        if(typeof loadComplaints === "function") loadComplaints();
    });
}