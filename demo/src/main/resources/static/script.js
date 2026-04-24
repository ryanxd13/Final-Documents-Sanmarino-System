// 1. GLOBAL SETTINGS
let currentRequestType = "General";

// 2. MODAL FUNCTIONS (Naka-attach sa window para sa HTML onclick)
window.openRequestModal = function(type) {
    console.log("Category selected: " + type);
    currentRequestType = type;

    // Imbes na gumamit ng variable sa itaas, dito natin kukunin ang element
    if (type === 'Complaint' || type === 'Report' || type === 'Track') {
        const compModal = document.getElementById("complaintModal");
        if (compModal) compModal.style.display = "block";
    } else {
        const modal = document.getElementById("residentModal");
        if (modal) modal.style.display = "block";
    }
};

window.closeModal = function() {
    const modal = document.getElementById("residentModal");
    if (modal) modal.style.display = "none";
    currentRequestType = "General";
};

window.closeComplaintModal = function() {
    const compModal = document.getElementById("complaintModal");
    if (compModal) compModal.style.display = "none";
};

// Isara ang modal kapag kinlik ang labas o ang close buttons
window.onclick = function(event) {
    const modal = document.getElementById("residentModal");
    const compModal = document.getElementById("complaintModal");
    
    if (event.target === modal || event.target.classList.contains('close-btn')) closeModal();
    if (event.target === compModal || event.target.classList.contains('close-btn')) closeComplaintModal();
};

// 3. FORM SUBMISSION HANDLERS (Gamit ang Event Delegation)
// Ito ang solusyon para sa "compForm before initialization" error
document.addEventListener('submit', function(e) {
    // Tinitingnan natin kung ano ang ID ng form na sinubmit
    const formId = e.target.id;
    const formClass = e.target.className;

    if (formId === 'complaintForm') {
        e.preventDefault();
        handleComplaintSubmit(e.target);
    } else if (formClass === 'resident-form') {
        e.preventDefault();
        handleResidentSubmit(e.target);
    }
});

function handleResidentSubmit(form) {
    const firstName = form.querySelector('input[placeholder*="FIRST"]').value;
    const lastName = form.querySelector('input[placeholder*="LAST"]').value;
    
    const residents = JSON.parse(localStorage.getItem('brgyResidents')) || [];
    residents.push({
        id: Date.now(),
        name: `${firstName} ${lastName}`,
        category: currentRequestType,
        date: new Date().toLocaleDateString()
    });
    
    localStorage.setItem('brgyResidents', JSON.stringify(residents));
    alert("Record Saved!");
    form.reset();
    window.closeModal();
}

function handleComplaintSubmit(form) {
    const serviceId = document.getElementById('compServiceId').value;
    const type = document.getElementById('compType').value;
    
    const complaints = JSON.parse(localStorage.getItem('brgyComplaints')) || [];
    complaints.push({
        id: Date.now(),
        serviceId: serviceId,
        type: type,
        status: "Pending"
    });
    
    localStorage.setItem('brgyComplaints', JSON.stringify(complaints));
    alert("Complaint Submitted!");
    form.reset();
    window.closeComplaintModal();
}