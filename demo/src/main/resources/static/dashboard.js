
// Ilagay ito sa pinakataas ng dashboard.js
const annForm = document.getElementById('announcementForm');

// 5. ANNOUNCEMENT CRUD
function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('brgyAnnouncements')) || [];
    const annList = document.getElementById('announcementsList');
    if (!annList) return;

    if (announcements.length === 0) {
        annList.innerHTML = '<p style="text-align:center;">No announcements available.</p>';
        return;
    }

    annList.innerHTML = announcements.slice().reverse().map(ann => {
        let iconClass = "fas fa-bullhorn"; 
        const titleLower = ann.title.toLowerCase();
        if (titleLower.includes('weather')) iconClass = "fas fa-cloud-showers-heavy";
        else if (titleLower.includes('water')) iconClass = "fas fa-faucet";
        else if (titleLower.includes('notice')) iconClass = "fas fa-exclamation-triangle";

        return `
        <div class="ann-card">
            <div class="ann-actions">
                <button onclick="editAnnouncement(${ann.id})" style="color: blue; border:none; background:none; cursor:pointer;">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteAnnouncement(${ann.id})" style="color: red; border:none; background:none; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="ann-header">
                <div class="ann-icon"><i class="${iconClass}"></i></div>
                <div class="ann-header-text">
                    <h2 style="text-transform: uppercase; text-decoration: underline;">${ann.title}</h2>
                    <h3>${ann.subject}</h3>
                </div>
            </div>
            <div class="ann-body"><p>${ann.content}</p></div>
            <div class="ann-footer-info">
                Posted on: ${ann.date}<br>
                Posted by: Barangay Advisory
            </div>
        </div>`;
    }).join('');
}

// Kailangan ito para gumana ang Edit button
window.editAnnouncement = function(id) {
    const announcements = JSON.parse(localStorage.getItem('brgyAnnouncements')) || [];
    const ann = announcements.find(a => a.id === id);
    if (ann) {
        document.getElementById('announcementId').value = ann.id;
        document.getElementById('annTitle').value = ann.title;
        document.getElementById('annSubject').value = ann.subject;
        document.getElementById('annContent').value = ann.content;
        document.getElementById('annSubmitBtn').innerText = "Update Announcement";
        // I-scroll pabalik sa form para makita ng user
        document.querySelector('.announcement-form-card').scrollIntoView({ behavior: 'smooth' });
    }
};

// Kailangan ito para gumana ang Delete button
window.deleteAnnouncement = function(id) {
    if (confirm("Delete this announcement?")) {
        let announcements = JSON.parse(localStorage.getItem('brgyAnnouncements')) || [];
        announcements = announcements.filter(a => a.id !== id);
        localStorage.setItem('brgyAnnouncements', JSON.stringify(announcements));
        loadAnnouncements();
    }
};

// Form Submission Logic
if (annForm) {
    annForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Sa loob ng annForm submit event
if (titleInput === "" || contentInput === "") {
    alert("Please fill out all fields.");
    return;
}
        
        const idField = document.getElementById('announcementId').value;
        const titleInput = document.getElementById('annTitle').value.trim();
        const subjectInput = document.getElementById('annSubject').value.trim();
        const contentInput = document.getElementById('annContent').value.trim();
        
        let announcements = JSON.parse(localStorage.getItem('brgyAnnouncements')) || [];

        // 1. DUPLICATION CHECK
        // I-check kung may existing na announcement na kaparehas ang Title AT Subject
        // Pero papayagan natin kung "Update" (may idField) ang ginagawa mo
        const isDuplicate = announcements.some(ann => 
            ann.title.toLowerCase() === titleInput.toLowerCase() && 
            ann.subject.toLowerCase() === subjectInput.toLowerCase() &&
            ann.id != idField // Huwag bilangin ang sarili nito kung nag-eedit
        );

        if (isDuplicate) {
            alert("⚠️ Error: An announcement with this title and subject already exists!");
            return; // Hinto na dito, hindi mag-sesave
        }

        const newAnn = {
            id: idField ? parseInt(idField) : Date.now(),
            title: titleInput,
            subject: subjectInput,
            content: contentInput,
            date: new Date().toLocaleDateString('en-GB')
        };

        // 2. SAVE OR UPDATE
        if (idField) {
            const index = announcements.findIndex(a => a.id == idField);
            if (index !== -1) announcements[index] = newAnn;
        } else {
            announcements.push(newAnn);
        }

        localStorage.setItem('brgyAnnouncements', JSON.stringify(announcements));
        
        // 3. UI RESET
        annForm.reset();
        document.getElementById('announcementId').value = '';
        document.getElementById('annSubmitBtn').innerText = "Post Announcement";
        loadAnnouncements();
        alert("Announcement saved successfully!");
    });
}



// 1. NAVIGATION LOGIC
function showSection(sectionId) {
    // 1. I-save sa localStorage kung anong section ang binuksan
    localStorage.setItem('activeSection', sectionId);

    // 2. Itago lahat ng sections at alisin ang active class sa buttons
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    // 3. Ipakita ang napiling section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.add('active');

    // 4. Refresh data based sa section
    if (sectionId === 'dashboard') loadDashboardData();
    if (sectionId === 'announcements') loadAnnouncements();
    if (sectionId === 'complaints') loadComplaints();
    if (sectionId === 'residents') loadDashboardData();

    // 5. Gawing 'active' ang button sa sidebar
    const buttons = document.querySelectorAll('.nav-item');
    buttons.forEach(btn => {
        // Ginagamit ang optional chaining para iwas error kung walang onclick
        if(btn.getAttribute('onclick')?.includes(sectionId)) {
            btn.classList.add('active');
        }
    });
}
// 2. DASHBOARD & RESIDENT LIST LOGIC
function loadDashboardData() {
    const residents = JSON.parse(localStorage.getItem('brgyResidents')) || [];
    
    const dashboardTableBody = document.querySelector('#recentResidentsTable tbody');
    const masterTableBody = document.querySelector('#masterResidentsTable tbody');

    // Update Stats
    const total = residents.length;
    const maleCount = residents.filter(r => r.sex.toUpperCase() === 'MALE').length;
    const femaleCount = residents.filter(r => r.sex.toUpperCase() === 'FEMALE').length;

    if(document.getElementById('totalPop')) document.getElementById('totalPop').innerText = total;
    if(document.getElementById('maleCount')) document.getElementById('maleCount').innerText = maleCount;
    if(document.getElementById('femaleCount')) document.getElementById('femaleCount').innerText = femaleCount;

    // Populate Recent Table (Latest 5)
    if(dashboardTableBody) {
        dashboardTableBody.innerHTML = residents.slice(-5).reverse().map(res => `
            <tr>
                <td>${res.firstName} ${res.lastName}</td>
                <td>${res.category || 'Resident'}</td>
                <td><span class="status-badge ongoing">Active</span></td>
            </tr>
        `).join('');
    }

    // Populate Master Resident List (With Correct Delete ID)
    if(masterTableBody) {
        masterTableBody.innerHTML = residents.map(res => `
            <tr>
                <td>${res.lastName}, ${res.firstName}</td>
                <td>${res.sex}</td>
                <td>${res.age}</td>
                <td>${res.date || 'N/A'}</td>
                <td>
                    <button onclick="deleteResident(${res.id})" class="delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// 3. COMPLAINTS LOGIC
// 3. COMPLAINTS LOGIC
function loadComplaints() {
    const tableBody = document.getElementById('complaintsTableBody');
    const complaints = JSON.parse(localStorage.getItem('brgyComplaints')) || [];

    if (!tableBody) return;

    if (complaints.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No complaints found.</td></tr>';
    } else {
        tableBody.innerHTML = complaints.map((item, index) => {
            // Determine class for the select background
            const statusClass = `status-${item.status.toLowerCase()}`;
            
            return `
            <tr>
                <td><strong>#${item.complaintNumber || (index + 1)}</strong></td>
                <td>${item.type}</td>
                <td>${item.location}</td>
                <td>${item.dateFiled}</td>
                <td>${item.filedBy}</td>
                <td class="description-cell" title="${item.description}">${item.description.substring(0, 20)}...</td>
                <td>
                    <select class="status-select ${statusClass}" onchange="updateComplaintStatus(${index}, this.value)">
                        <option value="Ongoing" ${item.status === 'Ongoing' ? 'selected' : ''}>Ongoing</option>
                        <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Canceled" ${item.status === 'Canceled' ? 'selected' : ''}>Canceled</option>
                    </select>
                </td>
                <td>
                    <button onclick="deleteComplaint(${index})" class="delete-btn" style="color: red; border:none; background:none; cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        }).join('');
    }

    updateComplaintStats(complaints);
}

// UPDATE STATUS FUNCTION (The "U" in CRUD)
window.updateComplaintStatus = function(index, newStatus) {
    let complaints = JSON.parse(localStorage.getItem('brgyComplaints')) || [];
    
    // Update the specific complaint
    complaints[index].status = newStatus;
    
    // Save back to localStorage
    localStorage.setItem('brgyComplaints', JSON.stringify(complaints));
    
    // Refresh UI
    loadComplaints();
    console.log(`Complaint ${index} updated to ${newStatus}`);
};

// DELETE FUNCTION (The "D" in CRUD)
window.deleteComplaint = function(index) {
    if (confirm("Are you sure you want to delete this complaint record?")) {
        let complaints = JSON.parse(localStorage.getItem('brgyComplaints')) || [];
        complaints.splice(index, 1);
        localStorage.setItem('brgyComplaints', JSON.stringify(complaints));
        loadComplaints();
    }
};

// HELPER: Update the numbers at the bottom
function updateComplaintStats(complaints) {
    const totalEl = document.getElementById('totalComplaintsCount');
    const ongoingEl = document.getElementById('ongoingCount');
    
    if (totalEl) totalEl.innerText = complaints.length;
    if (ongoingEl) {
        const ongoingCount = complaints.filter(c => c.status === 'Ongoing').length;
        ongoingEl.innerText = ongoingCount;
    }
}

// 4. DELETE FUNCTIONS
function deleteResident(id) {
    if (confirm("Are you sure you want to delete this resident?")) {
        let residents = JSON.parse(localStorage.getItem('brgyResidents')) || [];
        // Filter by unique ID
        residents = residents.filter(res => res.id !== id);
        localStorage.setItem('brgyResidents', JSON.stringify(residents));
        loadDashboardData();
    }
}

function deleteComplaint(index) {
    if (confirm("Delete this complaint record?")) {
        let complaints = JSON.parse(localStorage.getItem('brgyComplaints')) || [];
        complaints.splice(index, 1); // Delete by position
        localStorage.setItem('brgyComplaints', JSON.stringify(complaints));
        loadComplaints();
    }
}

// 5. ANNOUNCEMENT CRUD (Same as before but cleaned)
function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('brgyAnnouncements')) || [];
    const annList = document.getElementById('announcementsList');
    if (!annList) return;

    if (announcements.length === 0) {
        annList.innerHTML = '<p style="text-align:center;">No announcements available.</p>';
        return;
    }

    annList.innerHTML = announcements.slice().reverse().map(ann => {
        // Simple logic para pumili ng icon base sa title
        let iconClass = "fas fa-bullhorn"; 
        if (ann.title.toLowerCase().includes('weather')) iconClass = "fas fa-cloud-showers-heavy";
        if (ann.title.toLowerCase().includes('water')) iconClass = "fas fa-faucet";
        if (ann.title.toLowerCase().includes('notice')) iconClass = "fas fa-exclamation-triangle";

        return `
        <div class="ann-card">
            <div class="ann-actions">
                <button onclick="editAnnouncement(${ann.id})" style="color: blue;"><i class="fas fa-edit"></i></button>
                <button onclick="deleteAnnouncement(${ann.id})" style="color: red;"><i class="fas fa-trash"></i></button>
            </div>
            
            <div class="ann-header">
                <div class="ann-icon"><i class="${iconClass}"></i></div>
                <div class="ann-header-text">
                    <h2>${ann.title.toUpperCase()}</h2>
                    <h3>${ann.subject}</h3>
                </div>
            </div>

            <div class="ann-body">
                <p>${ann.content}</p>
            </div>

            <div class="ann-footer-info">
                Posted on: ${ann.date}<br>
                Posted by: Barangay Advisory
            </div>
        </div>
        `;
    }).join('');
}

// Function to handle form submission (Create & Update)
if(annForm) {
    annForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const idField = document.getElementById('announcementId').value;
        let announcements = JSON.parse(localStorage.getItem('brgyAnnouncements')) || [];

        const newAnn = {
            id: idField ? parseInt(idField) : Date.now(),
            title: document.getElementById('annTitle').value,
            subject: document.getElementById('annSubject').value,
            content: document.getElementById('annContent').value,
            date: new Date().toLocaleDateString('en-GB') // DD/MM/YYYY
        };

        if (idField) {
            const index = announcements.findIndex(a => a.id == idField);
            announcements[index] = newAnn;
        } else {
            announcements.push(newAnn);
        }

        localStorage.setItem('brgyAnnouncements', JSON.stringify(announcements));
        annForm.reset();
        document.getElementById('announcementId').value = '';
        document.getElementById('annSubmitBtn').innerText = "Post Announcement";
        loadAnnouncements();
        alert("Announcement saved!");
    });
}

// Initialization

document.addEventListener('DOMContentLoaded', () => {
    // 1. Alamin kung ano ang huling section na binuksan (Default ay 'dashboard' kung wala pa)
    const lastSection = localStorage.getItem('activeSection') || 'dashboard';

    // 2. Patakbuhin ang showSection gamit ang huling section
    showSection(lastSection);

    // 3. I-load ang lahat ng data sa background
    loadDashboardData();
    loadComplaints();
    loadAnnouncements();

    // Logout logic (Mananatiling parehas)
    const logoutBtn = document.querySelector('.logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if(confirm("Log out?")) {
                localStorage.removeItem('activeSection'); // Clear para balik sa dashboard sa susunod na login
                window.location.href = 'index.html';
            }
        });
    }
});