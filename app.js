// JUIT VenueHub - Application Core JS Logic

// Initial Mock Database
const DEFAULT_VENUES = [
    {
        id: "auditorium",
        name: "Main Auditorium",
        capacity: 500,
        type: "Large",
        facilities: ["projector", "ac", "mic"],
        facilitiesLabels: ["Stage Projector", "Central AC", "Professional Audio System", "Tiered Theater Seating"],
        description: "The primary venue for major cultural events, guest lectures, and university assemblies.",
        approver: "estate",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19h16v2H4zm16-4V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0-2-.9-2-2zM9 9l6 3-6 3V9z"/></svg>`
    },
    {
        id: "seminar-1",
        name: "Seminar Hall - 1",
        capacity: 120,
        type: "Medium",
        facilities: ["projector", "ac", "mic"],
        facilitiesLabels: ["4K Projector", "Split AC", "Podium Microphone", "Dual Smart-Boards"],
        description: "Modern lecture and presentations hall, ideal for academic symposiums and club workshops.",
        approver: "dept",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
        id: "seminar-2",
        name: "Seminar Hall - 2",
        capacity: 120,
        type: "Medium",
        facilities: ["projector", "ac", "mic"],
        facilitiesLabels: ["Full HD Projector", "Split AC", "Handheld Mics", "Fixed Desk Seating"],
        description: "Academic presentation hall equipped with standard presentation technology.",
        approver: "dept",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
        id: "conference",
        name: "Executive Conference Room",
        capacity: 30,
        type: "Small",
        facilities: ["projector", "ac"],
        facilitiesLabels: ["LED TV Output", "Central AC", "Boardroom Seating", "Video Conferencing Setup"],
        description: "Premium conference space for administrative, departmental, and visiting faculty board meetings.",
        approver: "estate",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2"/></svg>`
    },
    {
        id: "amphitheatre",
        name: "Open-Air Amphitheatre",
        capacity: 1000,
        type: "Large",
        facilities: ["mic"],
        facilitiesLabels: ["Outdoor Sound System", "Spacious Steps Seating", "Ambient Lighting"],
        description: "Open environment venue designed for massive audience attendance, street plays, and fest activities.",
        approver: "estate",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10A10 10 0 0 0 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-1.12.23-2.18.64-3.15L13 14.88v5.05zM17.36 17c-.6.6-1.3 1.07-2.1 1.39l-4.14-4.14 6.24-6.24v9z"/></svg>`
    },
    {
        id: "sports",
        name: "Sports Complex Court",
        capacity: 150,
        type: "Medium",
        facilities: [],
        facilitiesLabels: ["Indoor Sports Floor", "High Ceiling", "Floodlights"],
        description: "Indoor sports complex court accommodating sports activities and large student physical gatherings.",
        approver: "estate",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM6.7 6.7l10.6 10.6"/></svg>`
    },
    {
        id: "cr-101",
        name: "Departmental Classroom 101",
        capacity: 60,
        type: "Medium",
        facilities: ["projector", "ac"],
        facilitiesLabels: ["Projector Screen", "High wall ACs", "Standard Seating"],
        description: "Equipped lecture room primarily used for non-teaching club actions outside regular class schedules.",
        approver: "dept",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 17v-2a3 3 0 0 1 6 0v2"/></svg>`
    },
    {
        id: "cr-102",
        name: "Departmental Classroom 102",
        capacity: 60,
        type: "Medium",
        facilities: ["projector", "ac"],
        facilitiesLabels: ["Projector Screen", "High wall ACs", "Standard Seating"],
        description: "Equipped lecture room primarily used for non-teaching departmental workshops or tutorials.",
        approver: "dept",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 17v-2a3 3 0 0 1 6 0v2"/></svg>`
    }
];

const DEFAULT_TIMETABLE = [
    { venueId: "cr-101", day: 1, startTime: "09:00", endTime: "11:00", className: "CS-101 Lecture (B.Tech Sec-A)" },
    { venueId: "cr-101", day: 1, startTime: "14:00", endTime: "16:00", className: "CS-302 Web Dev Lab" },
    { venueId: "cr-102", day: 2, startTime: "10:00", endTime: "12:00", className: "ECE-201 Digital Circuits Tutorial" },
    { venueId: "cr-102", day: 2, startTime: "14:00", endTime: "16:00", className: "CS-401 Compiler Design Lecture" },
    { venueId: "seminar-1", day: 3, startTime: "09:00", endTime: "11:00", className: "Academic Timetable: CSE Guest Lectures" },
    { venueId: "seminar-1", day: 3, startTime: "14:00", endTime: "16:00", className: "Academic Timetable: IT Department Seminar" },
    { venueId: "seminar-2", day: 4, startTime: "11:00", endTime: "13:00", className: "Academic Timetable: Humanities Club Lecture" },
    { venueId: "cr-101", day: 5, startTime: "10:00", endTime: "12:00", className: "CS-202 Data Structures Lab" }
];

const DEFAULT_BOOKINGS = [
    {
        id: "B-101",
        venueId: "auditorium",
        date: "", // Set dynamically to current simulated date in init
        startTime: "14:00",
        endTime: "17:00",
        requesterName: "Dr. Rajesh Sharma",
        requesterRole: "Faculty Member",
        purpose: "Annual Science Fest Inauguration",
        expectedAttendees: 400,
        status: "approved",
        approverComments: "Approved. Please ensure clean up post event.",
        isRecurring: false,
        recurrenceParent: null,
        checkedIn: false
    },
    {
        id: "B-102",
        venueId: "seminar-1",
        date: "", // Set dynamically in init
        startTime: "10:00",
        endTime: "12:00",
        requesterName: "Amit Patel (Club Rep)",
        requesterRole: "Student Representative",
        purpose: "Coding Club Hackathon Orientation",
        expectedAttendees: 90,
        status: "pending",
        approverComments: "",
        isRecurring: false,
        recurrenceParent: null,
        checkedIn: false
    },
    {
        id: "B-103",
        venueId: "conference",
        date: "", // Set dynamically in init
        startTime: "09:00",
        endTime: "11:00",
        requesterName: "Dr. Rajesh Sharma",
        requesterRole: "Faculty Member",
        purpose: "Academic Council Board Review",
        expectedAttendees: 20,
        status: "rejected",
        approverComments: "Room booked for external NAAC delegation team inspections.",
        isRecurring: false,
        recurrenceParent: null,
        checkedIn: false
    }
];

const DEFAULT_NOTIFICATIONS = [
    {
        id: "N-01",
        title: "Welcome to JUIT VenueHub",
        message: "Your digitized venue management system is active. Check room availabilities without logging in.",
        time: "10 minutes ago",
        read: false
    }
];

// App State
let state = {
    venues: DEFAULT_VENUES,
    bookings: [],
    notifications: [],
    timetable: DEFAULT_TIMETABLE,
    settings: {
        noticePeriod: 24, // in hours
        timetableSynced: true
    },
    currentRole: "guest",
    userEmail: "",
    calendarViewMode: "day",
    simulatedDateTime: new Date() // defaults to right now
};

// SVG Assets for catalogue styling
const SVG_BACKGROUNDS = [
    `<svg class="venue-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#00F2FE" stop-opacity="0.1"/><stop offset="100%" stop-color="#4FACFE" stop-opacity="0"/></linearGradient></defs><rect width="100" height="100" fill="url(#g1)"/><circle cx="80" cy="20" r="30" fill="#00F2FE" fill-opacity="0.05"/><path d="M-10,90 Q30,60 70,90 T110,90" fill="none" stroke="#4FACFE" stroke-width="0.5" stroke-opacity="0.2"/></svg>`,
    `<svg class="venue-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.1"/><stop offset="100%" stop-color="#EC4899" stop-opacity="0"/></linearGradient></defs><rect width="100" height="100" fill="url(#g2)"/><rect x="10" y="20" width="40" height="40" rx="5" fill="#8B5CF6" fill-opacity="0.03" transform="rotate(45 30 40)"/></svg>`,
    `<svg class="venue-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="g3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#10B981" stop-opacity="0.1"/><stop offset="100%" stop-color="#059669" stop-opacity="0"/></linearGradient></defs><rect width="100" height="100" fill="url(#g3)"/><polygon points="50,15 90,85 10,85" fill="#10B981" fill-opacity="0.03"/></svg>`
];

// Document Elements
const DOM = {
    authSidebarContainer: document.getElementById("auth-sidebar-container"),
    adminActionsContainer: document.getElementById("admin-actions-container"),
    btnAddVenue: document.getElementById("btn-add-venue"),
    btnCalendarDayView: document.getElementById("btn-calendar-day-view"),
    btnCalendarWeekView: document.getElementById("btn-calendar-week-view"),
    
    // Login Modal
    loginModal: document.getElementById("login-modal"),
    loginForm: document.getElementById("login-form"),
    loginEmail: document.getElementById("login-email"),
    loginRole: document.getElementById("login-role"),
    loginError: document.getElementById("login-error"),
    closeLoginBtn: document.getElementById("close-login-btn"),

    // Add Venue Modal
    addVenueModal: document.getElementById("add-venue-modal"),
    addVenueForm: document.getElementById("add-venue-form"),
    venueName: document.getElementById("venue-name"),
    venueCapacity: document.getElementById("venue-capacity"),
    venueType: document.getElementById("venue-type"),
    venueApprover: document.getElementById("venue-approver"),
    venueDescription: document.getElementById("venue-description"),
    facilityProjector: document.getElementById("facility-projector"),
    facilityAc: document.getElementById("facility-ac"),
    facilityMic: document.getElementById("facility-mic"),
    addVenueError: document.getElementById("add-venue-error"),
    closeAddVenueBtn: document.getElementById("close-add-venue-btn"),
    cancelAddVenueBtn: document.getElementById("cancel-add-venue-btn"),

    navItems: document.querySelectorAll(".nav-item"),
    views: document.querySelectorAll(".app-view"),
    viewTitle: document.getElementById("view-title"),
    viewSubtitle: document.getElementById("view-subtitle"),
    themeToggle: document.getElementById("theme-toggle"),
    themeText: document.getElementById("theme-text"),
    simulatedClock: document.getElementById("simulated-clock"),
    advanceTimeBtn: document.getElementById("advance-time-btn"),
    
    // Header
    notiBellBtn: document.getElementById("noti-bell-btn"),
    notiDropdown: document.getElementById("noti-dropdown"),
    notiList: document.getElementById("noti-list"),
    notiCountBadge: document.getElementById("noti-count-badge"),
    clearNotiBtn: document.getElementById("clear-noti-btn"),
    userAvatar: document.getElementById("user-avatar"),
    userName: document.getElementById("user-name"),
    userRoleLabel: document.getElementById("user-role-label"),
    toastContainer: document.getElementById("toast-container"),

    // Catalogue
    venueGrid: document.getElementById("venue-grid"),
    venueSearch: document.getElementById("venue-search"),
    filterCapacity: document.getElementById("filter-capacity"),
    filterFacility: document.getElementById("filter-facility"),

    // Calendar
    calendarVenueSelect: document.getElementById("calendar-venue-select"),
    calendarDateInput: document.getElementById("calendar-date-input"),
    calendarDayHeader: document.getElementById("calendar-day-header"),
    calendarTimeSlots: document.getElementById("calendar-time-slots"),

    // Bookings View
    bookingsTableBody: document.getElementById("bookings-table-body"),
    bookingsEmpty: document.getElementById("bookings-empty"),
    newBookingBtn: document.getElementById("new-booking-btn"),
    bookingsNavText: document.getElementById("bookings-nav-text"),

    // Approvals View
    approvalsTableBody: document.getElementById("approvals-table-body"),
    approvalsEmpty: document.getElementById("approvals-empty"),
    approvalBadgeCount: document.getElementById("approval-badge-count"),

    // Admin Panel
    totalBookingsStat: document.getElementById("stat-total-bookings"),
    pendingBookingsStat: document.getElementById("stat-pending-bookings"),
    attendanceRateStat: document.getElementById("stat-attendance-rate"),
    utilizationChart: document.getElementById("utilization-chart-container"),
    peakChart: document.getElementById("peak-chart-container"),
    syncTimetableBtn: document.getElementById("sync-timetable-btn"),
    timetableList: document.getElementById("timetable-list"),
    noticePeriodInput: document.getElementById("notice-period-input"),
    saveSettingsBtn: document.getElementById("save-settings-btn"),

    // QR Check-in
    scannerSelectBooking: document.getElementById("scanner-select-booking"),
    btnSimulateScan: document.getElementById("btn-simulate-scan"),

    // Modals
    bookingModal: document.getElementById("booking-modal"),
    modalTitle: document.getElementById("modal-title"),
    submitBookingBtn: document.getElementById("submit-booking-btn"),
    bookingForm: document.getElementById("booking-form"),
    bookingEditId: document.getElementById("booking-edit-id"),
    bookingVenue: document.getElementById("booking-venue"),
    bookingDate: document.getElementById("booking-date"),
    bookingAttendees: document.getElementById("booking-attendees"),
    bookingStart: document.getElementById("booking-start"),
    bookingEnd: document.getElementById("booking-end"),
    bookingPurpose: document.getElementById("booking-purpose"),
    bookingRecurring: document.getElementById("booking-recurring"),
    bookingFormError: document.getElementById("booking-form-error"),
    closeModalBtn: document.getElementById("close-modal-btn"),
    cancelModalBtn: document.getElementById("cancel-modal-btn"),

    approvalModal: document.getElementById("approval-modal"),
    closeApprovalModal: document.getElementById("close-approval-modal"),
    reviewId: document.getElementById("review-id"),
    reviewRequester: document.getElementById("review-requester"),
    reviewRequesterRole: document.getElementById("review-requester-role"),
    reviewVenue: document.getElementById("review-venue"),
    reviewTime: document.getElementById("review-time"),
    reviewAttendees: document.getElementById("review-attendees"),
    reviewPurpose: document.getElementById("review-purpose"),
    reviewRecurrence: document.getElementById("review-recurrence"),
    reviewConflictWarning: document.getElementById("review-conflict-warning"),
    reviewConflictText: document.getElementById("review-conflict-text"),
    approvalComment: document.getElementById("approval-comment"),
    btnApproveRequest: document.getElementById("btn-approve-request"),
    btnRejectRequest: document.getElementById("btn-reject-request"),
    btnModifyRequest: document.getElementById("btn-modify-request")
};

// Role Configurations
const ROLES = {
    guest: { name: "Guest User", displayRole: "Guest (Unauthenticated)", avatar: "G", views: ["catalogue", "calendar"] },
    faculty: { name: "Dr. Rajesh Sharma", displayRole: "Faculty Member", avatar: "F", views: ["catalogue", "calendar", "bookings", "checkin"] },
    student: { name: "Amit Patel (Club Rep)", displayRole: "Student Representative", avatar: "S", views: ["catalogue", "calendar", "bookings", "checkin"] },
    "approver-dept": { name: "Prof. Veena Verma (HOD)", displayRole: "Department Office", avatar: "D", views: ["catalogue", "calendar", "approvals"] },
    "approver-estate": { name: "Col. Ranbir Singh", displayRole: "Estate Office", avatar: "E", views: ["catalogue", "calendar", "approvals"] },
    admin: { name: "Administrator Hub", displayRole: "System Admin", avatar: "A", views: ["catalogue", "calendar", "reports", "sync"] }
};

// Working Hours (8:00 AM - 8:00 PM)
const TIME_SLOTS_HOURS = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

// Helper: Formats Date Object to YYYY-MM-DD
function formatDateString(date) {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

// Helper: Format readable date
function getReadableDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString("en-US", options);
}

// Initial state setting
async function initializeState() {
    // Load from local storage if exists
    const storedSettings = localStorage.getItem("juit_settings");
    const storedNotifications = localStorage.getItem("juit_notifications");
    const storedTime = localStorage.getItem("juit_simulated_time");
    const storedUserEmail = localStorage.getItem("juit_user_email");
    const storedCurrentRole = localStorage.getItem("juit_current_role");

    if (storedTime) {
        state.simulatedDateTime = new Date(storedTime);
    } else {
        state.simulatedDateTime = new Date(); // Start at real time
    }

    if (storedSettings) {
        state.settings = JSON.parse(storedSettings);
    }

    if (storedUserEmail) {
        state.userEmail = storedUserEmail;
    }
    if (storedCurrentRole) {
        state.currentRole = storedCurrentRole;
    } else {
        state.currentRole = "guest";
    }

    // Load venues & bookings from SQLite backend server
    await fetchVenues();
    await fetchBookings();

    if (storedNotifications) {
        state.notifications = JSON.parse(storedNotifications);
    } else {
        state.notifications = DEFAULT_NOTIFICATIONS;
        saveNotifications();
    }
}

async function saveBookings() {
    try {
        await fetch('/api/bookings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.bookings)
        });
    } catch (err) {
        console.error("Error saving bookings to server:", err);
    }
}

async function saveVenues() {
    // Falls back to local copy for catalog sync, though admin uses add/delete API
    try {
        localStorage.setItem("juit_venues", JSON.stringify(state.venues));
    } catch (err) {
        console.error("Error saving venues fallback:", err);
    }
}

async function fetchVenues() {
    try {
        const res = await fetch('/api/venues');
        const data = await res.json();
        state.venues = data;
    } catch (err) {
        console.error("Error fetching venues from server:", err);
        const storedVenues = localStorage.getItem("juit_venues");
        if (storedVenues) {
            state.venues = JSON.parse(storedVenues);
        } else {
            state.venues = DEFAULT_VENUES;
        }
    }
}

async function fetchBookings() {
    try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        state.bookings = data;
    } catch (err) {
        console.error("Error fetching bookings from server:", err);
        const storedBookings = localStorage.getItem("juit_bookings");
        if (storedBookings) {
            state.bookings = JSON.parse(storedBookings);
        }
    }
}

function saveSettings() {
    localStorage.setItem("juit_settings", JSON.stringify(state.settings));
}

function saveNotifications() {
    localStorage.setItem("juit_notifications", JSON.stringify(state.notifications));
}

// Update simulated clock in UI
function updateClockUI() {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    DOM.simulatedClock.textContent = state.simulatedDateTime.toLocaleDateString("en-US", options);
    localStorage.setItem("juit_simulated_time", state.simulatedDateTime.toISOString());
}

// Toast System
function showToast(title, message, type = "primary") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let borderSvg = "";
    if (type === "success") borderSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    else if (type === "warning") borderSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    else if (type === "danger") borderSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    else borderSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    toast.innerHTML = `
        <div style="color: var(--${type === "primary" ? "primary" : type}); display:flex; align-items:center;">
            ${borderSvg}
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;

    DOM.toastContainer.appendChild(toast);
    
    toast.querySelector(".toast-close").addEventListener("click", () => {
        toast.style.animation = "slideInRight 0.3s reverse forwards";
        toast.addEventListener("animationend", () => toast.remove());
    });

    // Auto remove after 5s
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = "slideInRight 0.3s reverse forwards";
            toast.addEventListener("animationend", () => toast.remove());
        }
    }, 5000);
}

// Add simulated notifications
function addNotification(title, message) {
    const noti = {
        id: "N-" + Date.now(),
        title,
        message,
        time: "Just now",
        read: false
    };
    state.notifications.unshift(noti);
    saveNotifications();
    renderNotificationsUI();
    showToast(title, message, "primary");
}

function renderNotificationsUI() {
    const unreadCount = state.notifications.filter(n => !n.read).length;
    DOM.notiCountBadge.textContent = unreadCount;
    DOM.notiCountBadge.style.display = unreadCount > 0 ? "flex" : "none";

    if (state.notifications.length === 0) {
        DOM.notiList.innerHTML = `<div class="noti-empty">No notifications</div>`;
        return;
    }

    DOM.notiList.innerHTML = state.notifications.map(n => `
        <div class="noti-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
            <div class="noti-item-title">${n.title}</div>
            <div>${n.message}</div>
            <div class="noti-item-time">${n.time}</div>
        </div>
    `).join('');

    // Mark as read click
    document.querySelectorAll(".noti-item").forEach(item => {
        item.addEventListener("click", () => {
            const id = item.dataset.id;
            const notiIndex = state.notifications.findIndex(n => n.id === id);
            if (notiIndex !== -1) {
                state.notifications[notiIndex].read = true;
                saveNotifications();
                renderNotificationsUI();
            }
        });
    });
}

// Role Handling & Routing
function updateRoleViews() {
    const roleConfig = ROLES[state.currentRole] || ROLES["guest"];

    // Update dynamic authentication sidebar UI
    if (!state.userEmail) {
        DOM.authSidebarContainer.innerHTML = `
            <button class="btn btn-primary btn-block" id="sidebar-signin-btn" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                Sign In
            </button>
        `;
        document.getElementById("sidebar-signin-btn").addEventListener("click", openLoginModal);

        // Header Avatar & Names
        DOM.userAvatar.textContent = "G";
        DOM.userName.textContent = "Guest User";
        DOM.userRoleLabel.textContent = "Guest (Unauthenticated)";
    } else {
        DOM.authSidebarContainer.innerHTML = `
            <div class="user-meta-info" style="margin-bottom: 0.75rem; text-align: left;">
                <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.25rem;">Logged In As</div>
                <div id="sidebar-user-email" style="font-size: 0.85rem; font-weight: 600; word-break: break-all; color: var(--text-primary); line-height: 1.2;">${state.userEmail}</div>
                <div id="sidebar-user-role" style="font-size: 0.75rem; color: var(--primary); font-weight: 700; margin-top: 0.25rem;">${roleConfig.displayRole}</div>
            </div>
            <button class="btn btn-outline-danger btn-block btn-sm" id="sidebar-signout-btn" style="display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
            </button>
        `;
        document.getElementById("sidebar-signout-btn").addEventListener("click", signOut);

        // Header Avatar & Names
        DOM.userAvatar.textContent = state.userEmail.charAt(0).toUpperCase();
        DOM.userName.textContent = state.userEmail;
        DOM.userRoleLabel.textContent = roleConfig.displayRole;
    }

    // Toggle Admin Catalogue actions
    if (DOM.adminActionsContainer) {
        DOM.adminActionsContainer.style.display = (state.currentRole === "admin") ? "block" : "none";
    }

    // Table Headers and Actions based on Role
    if (state.currentRole === "student") {
        DOM.bookingsNavText.textContent = "My Requests";
        DOM.newBookingBtn.style.display = "block";
    } else if (state.currentRole === "faculty") {
        DOM.bookingsNavText.textContent = "My Bookings";
        DOM.newBookingBtn.style.display = "block";
    } else {
        DOM.newBookingBtn.style.display = "none";
    }

    // Toggle navigation buttons
    DOM.navItems.forEach(item => {
        const viewName = item.dataset.view;
        const permitted = roleConfig.views.includes(viewName);
        item.style.display = permitted ? "flex" : "none";
    });

    // Automatically shift view if current view is not permitted for the new role
    const activeNav = document.querySelector(".nav-item.active");
    if (activeNav) {
        const currentView = activeNav.dataset.view;
        if (!roleConfig.views.includes(currentView)) {
            // Find first permitted view
            const fallbackView = roleConfig.views[0];
            const fallbackNavItem = document.querySelector(`.nav-item[data-view="${fallbackView}"]`);
            if (fallbackNavItem) {
                fallbackNavItem.click();
            }
        }
    }

    // Update counters
    updatePendingBadgeCount();

    // Rerender active tables/view panels
    const currentActiveView = document.querySelector(".app-view.active").id.replace("view-", "");
    renderView(currentActiveView);
}

// --- AUTHENTICATION & LOGIN LOGIC ---
function openLoginModal() {
    DOM.loginModal.classList.add("active");
    DOM.loginEmail.value = "";
    DOM.loginError.style.display = "none";
}

function closeLoginModal() {
    DOM.loginModal.classList.remove("active");
    DOM.loginEmail.value = "";
    DOM.loginError.style.display = "none";
}

function submitLogin(e) {
    e.preventDefault();
    const email = DOM.loginEmail.value.trim();
    const role = DOM.loginRole.value;

    if (!email) {
        DOM.loginError.textContent = "Email is required.";
        DOM.loginError.style.display = "block";
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        DOM.loginError.textContent = "Please enter a valid email address.";
        DOM.loginError.style.display = "block";
        return;
    }

    // Success login
    state.userEmail = email;
    state.currentRole = role;

    localStorage.setItem("juit_user_email", email);
    localStorage.setItem("juit_current_role", role);

    closeLoginModal();
    showToast("Signed In Successfully", `Logged in as ${email} (${ROLES[role].displayRole})`, "success");
    updateRoleViews();
}

function signOut() {
    state.userEmail = "";
    state.currentRole = "guest";

    localStorage.removeItem("juit_user_email");
    localStorage.removeItem("juit_current_role");

    showToast("Signed Out", "You have been signed out successfully.", "primary");
    updateRoleViews();
}

// --- ADMIN VENUE MANAGEMENT ---
function openAddVenueModal() {
    DOM.addVenueModal.classList.add("active");
    DOM.addVenueForm.reset();
    DOM.addVenueError.style.display = "none";
}

function closeAddVenueModal() {
    DOM.addVenueModal.classList.remove("active");
    DOM.addVenueForm.reset();
    DOM.addVenueError.style.display = "none";
}

function submitAddVenue(e) {
    try {
        e.preventDefault();
        const name = DOM.venueName.value.trim();
        const capacity = parseInt(DOM.venueCapacity.value);
        const type = DOM.venueType.value;
        const approver = DOM.venueApprover.value;
        const description = DOM.venueDescription.value.trim();

        if (!name || isNaN(capacity) || !description) {
            DOM.addVenueError.textContent = "Please fill out all required fields.";
            DOM.addVenueError.style.display = "block";
            return;
        }

        // Get checked facilities
        const facilities = [];
        const facilitiesLabels = [];
        if (DOM.facilityProjector && DOM.facilityProjector.checked) {
            facilities.push("projector");
            facilitiesLabels.push("Projector");
        }
        if (DOM.facilityAc && DOM.facilityAc.checked) {
            facilities.push("ac");
            facilitiesLabels.push("Air Conditioning (AC)");
        }
        if (DOM.facilityMic && DOM.facilityMic.checked) {
            facilities.push("mic");
            facilitiesLabels.push("Audio / Mic System");
        }

        // Create unique ID
        const newId = "venue-" + Date.now();

        // Assign standard SVG icon based on type
        let icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 17v-2a3 3 0 0 1 6 0v2"/></svg>`; // default classroom icon
        if (type === "Large") {
            icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19h16v2H4zm16-4V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0-2-.9-2-2zM9 9l6 3-6 3V9z"/></svg>`; // auditorium/large space icon
        } else if (type === "Medium" && name.toLowerCase().includes("seminar")) {
            icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`; // seminar hall icon
        } else if (type === "Small") {
            icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2"/></svg>`; // executive room icon
        }

        const newVenue = {
            id: newId,
            name: name,
            capacity: capacity,
            type: type,
            facilities: facilities,
            facilitiesLabels: facilitiesLabels,
            description: description,
            approver: approver,
            icon: icon
        };

        // Save to SQLite server
        fetch('/api/venues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newVenue)
        }).then(res => {
            if (!res.ok) {
                throw new Error("HTTP error " + res.status);
            }
            return res.json();
        }).then(() => {
            state.venues.push(newVenue);
            saveVenues(); // local storage fallback
            closeAddVenueModal();
            showToast("Venue Created", `"${name}" has been successfully added to the catalogue.`, "success");
            
            // Refresh catalogue
            renderCatalogue();
            
            // Refresh select inputs on other views (calendar, booking modal)
            DOM.calendarVenueSelect.innerHTML = ""; // force redraw
            renderCalendar();
        }).catch(err => {
            console.error("Error creating venue on server:", err);
            DOM.addVenueError.textContent = "Could not save venue to server database: " + err.message;
            DOM.addVenueError.style.display = "block";
        });
    } catch (err) {
        console.error("JavaScript Error in submitAddVenue:", err);
        alert("JavaScript Error:\n" + err.message + "\nStack:\n" + err.stack);
    }
}

window.deleteVenue = function(venueId) {
    const venueIndex = state.venues.findIndex(v => v.id === venueId);
    if (venueIndex === -1) return;

    const venue = state.venues[venueIndex];
    if (confirm(`Are you sure you want to delete the venue "${venue.name}"? This will cancel all bookings associated with this space.`)) {
        
        // Delete from SQLite server
        fetch('/api/venues/' + venueId, {
            method: 'DELETE'
        }).then(() => {
            state.venues.splice(venueIndex, 1);
            saveVenues(); // fallback

            // Cancel bookings associated with this venue
            let cancelCount = 0;
            state.bookings.forEach(b => {
                if (b.venueId === venueId && b.status !== "cancelled" && b.status !== "rejected") {
                    b.status = "cancelled";
                    b.approverComments = "Cancelled because the venue was deleted by the administrator.";
                    cancelCount++;
                }
            });
            if (cancelCount > 0) {
                saveBookings();
                addNotification("Bookings Cancelled", `Deleted venue "${venue.name}" resulted in the cancellation of ${cancelCount} scheduled bookings.`);
            }

            showToast("Venue Deleted", `"${venue.name}" has been deleted.`, "danger");

            // Refresh views
            renderCatalogue();
            
            // Refresh calendar select option dropdown
            DOM.calendarVenueSelect.innerHTML = "";
            renderCalendar();
        }).catch(err => {
            console.error("Error deleting venue on server:", err);
            showToast("Error", "Could not delete venue from server database.", "danger");
        });
    }
};

function updatePendingBadgeCount() {
    let pendingList = [];
    if (state.currentRole === "approver-dept") {
        pendingList = state.bookings.filter(b => b.status === "pending" && getVenueApprover(b.venueId) === "dept");
    } else if (state.currentRole === "approver-estate") {
        pendingList = state.bookings.filter(b => b.status === "pending" && getVenueApprover(b.venueId) === "estate");
    }
    
    DOM.approvalBadgeCount.textContent = pendingList.length;
    DOM.approvalBadgeCount.style.display = pendingList.length > 0 ? "inline-block" : "none";
}

function getVenueApprover(venueId) {
    const venue = state.venues.find(v => v.id === venueId);
    return venue ? venue.approver : "estate";
}

function getVenueName(venueId) {
    const venue = state.venues.find(v => v.id === venueId);
    return venue ? venue.name : "Unknown Venue";
}

// Router
function renderView(viewName) {
    DOM.views.forEach(view => {
        view.classList.remove("active");
    });
    
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add("active");

    // Header updates
    if (viewName === "catalogue") {
        DOM.viewTitle.textContent = "Venue Catalogue";
        DOM.viewSubtitle.textContent = "Browse JUIT shared spaces, facilities, and real-time room capacity info.";
        renderCatalogue();
    } else if (viewName === "calendar") {
        DOM.viewTitle.textContent = "Availability Calendar";
        DOM.viewSubtitle.textContent = "Check real-time slot bookings and timetable locks across venues.";
        renderCalendar();
    } else if (viewName === "bookings") {
        DOM.viewTitle.textContent = "Booking Center";
        DOM.viewSubtitle.textContent = "View, cancel, or modify your submitted booking requests.";
        renderBookingsTable();
    } else if (viewName === "approvals") {
        DOM.viewTitle.textContent = "Approvals Panel";
        DOM.viewSubtitle.textContent = "Assess venue reservation requests, verify scheduling conflicts, and assign remarks.";
        renderApprovalsTable();
    } else if (viewName === "reports") {
        DOM.viewTitle.textContent = "Utilization Dashboard";
        DOM.viewSubtitle.textContent = "Campus administrative charts, utilization rates, and timetable locks configuration.";
        renderAdminDashboard();
    } else if (viewName === "sync") {
        DOM.viewTitle.textContent = "Dataset Synchronization";
        DOM.viewSubtitle.textContent = "Upload or paste spreadsheets containing venues and bookings to sync with the database.";
        renderSyncView();
    } else if (viewName === "checkin") {
        DOM.viewTitle.textContent = "QR Check-in Scanner";
        DOM.viewSubtitle.textContent = "Scan a mock QR code inside building premises to record venue utilization.";
        renderCheckinScanner();
    }
}

// 1. VENUE CATALOGUE RENDER
function renderCatalogue() {
    const searchVal = DOM.venueSearch.value.toLowerCase();
    const capacityVal = DOM.filterCapacity.value;
    const facilityVal = DOM.filterFacility.value;

    const filtered = state.venues.filter(venue => {
        // Search matching
        const matchSearch = venue.name.toLowerCase().includes(searchVal) || 
                            venue.description.toLowerCase().includes(searchVal) ||
                            venue.facilitiesLabels.some(lbl => lbl.toLowerCase().includes(searchVal));
        
        // Capacity matching
        let matchCapacity = true;
        if (capacityVal === "small") matchCapacity = venue.capacity <= 30;
        else if (capacityVal === "medium") matchCapacity = venue.capacity > 30 && venue.capacity <= 150;
        else if (capacityVal === "large") matchCapacity = venue.capacity > 150;

        // Facility matching
        let matchFacility = true;
        if (facilityVal !== "all") {
            matchFacility = venue.facilities.includes(facilityVal);
        }

        return matchSearch && matchCapacity && matchFacility;
    });

    if (filtered.length === 0) {
        DOM.venueGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <h3>No venues match your current filters.</h3>
            </div>
        `;
        return;
    }

    DOM.venueGrid.innerHTML = filtered.map((venue, idx) => {
        const bgSvg = SVG_BACKGROUNDS[idx % SVG_BACKGROUNDS.length];
        const capacityClass = venue.capacity > 150 ? 'Large' : (venue.capacity <= 30 ? 'Small' : 'Medium');
        
        // Facilities badges
        const facBadges = venue.facilitiesLabels.map(label => `
            <span class="facility-badge">${label}</span>
        `).join('');

        const isGuest = state.currentRole === "guest";
        const isAdmin = state.currentRole === "admin";
        
        let actionButtons = "";
        if (isAdmin) {
            actionButtons = `
                <div style="display: flex; gap: 0.5rem; width: 100%;">
                    <button class="btn btn-primary" style="flex: 1; justify-content: center;" onclick="openBookingModal('${venue.id}')">Book</button>
                    <button class="btn btn-outline-danger" style="flex: 1; justify-content: center;" onclick="deleteVenue('${venue.id}')">Delete</button>
                </div>
            `;
        } else if (isGuest) {
            actionButtons = `<button class="btn btn-secondary btn-block" onclick="navigateToCalendar('${venue.id}')">View Availability</button>`;
        } else {
            actionButtons = `<button class="btn btn-primary btn-block" onclick="openBookingModal('${venue.id}')">Book This Space</button>`;
        }

        return `
            <div class="card venue-card">
                <div class="venue-image-placeholder">
                    ${bgSvg}
                    <div class="venue-icon-overlay">
                        ${venue.icon}
                    </div>
                </div>
                <h3>${venue.name}</h3>
                <div class="venue-meta">
                    <span class="venue-capacity">Capacity: ${venue.capacity} seats</span>
                    <span class="text-secondary" style="font-size: 0.8rem; font-weight:500;">Role: ${venue.approver.toUpperCase()} Office</span>
                </div>
                <p class="text-secondary" style="font-size: 0.85rem; line-height: 1.4; margin-bottom: 1rem; flex-grow: 1;">
                     ${venue.description}
                </p>
                <div class="venue-facilities">
                    ${facBadges}
                </div>
                ${actionButtons}
            </div>
        `;
    }).join('');
}

// Navigate view helper
window.navigateToCalendar = function(venueId) {
    DOM.calendarVenueSelect.value = venueId;
    const calendarNav = document.querySelector(`.nav-item[data-view="calendar"]`);
    if (calendarNav) calendarNav.click();
};

// Helper: Get Monday of the week for a given date
function getMonday(d) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
}

// 2. AVAILABILITY CALENDAR RENDER
function renderCalendar() {
    // Populate select element if empty
    if (DOM.calendarVenueSelect.children.length === 0) {
        DOM.calendarVenueSelect.innerHTML = state.venues.map(v => `
            <option value="${v.id}">${v.name}</option>
        `).join('');
    }

    // Date default to current simulated time
    if (!DOM.calendarDateInput.value) {
        DOM.calendarDateInput.value = formatDateString(state.simulatedDateTime);
    }

    const selectedVenueId = DOM.calendarVenueSelect.value;
    const selectedDateStr = DOM.calendarDateInput.value;
    const selectedDate = new Date(selectedDateStr);

    if (state.calendarViewMode === "week") {
        const headerDays = document.querySelector(".calendar-header-days");
        if (headerDays) {
            headerDays.style.gridTemplateColumns = "100px repeat(5, 1fr)";
            headerDays.style.gap = "0.5rem";
        }

        const monday = getMonday(selectedDate);
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const weekDates = [];
        let headerHTML = `<div class="calendar-header-cell">Time Slot</div>`;

        for (let i = 0; i < 5; i++) {
            const dateObj = new Date(monday);
            dateObj.setDate(monday.getDate() + i);
            const dateStr = formatDateString(dateObj);
            weekDates.push({
                dateStr,
                dateObj,
                dayIndex: dateObj.getDay()
            });

            const isToday = formatDateString(new Date()) === dateStr;
            const activeClass = isToday ? "active-day" : "";
            const formattedHeaderDate = dateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
            headerHTML += `<div class="calendar-header-cell ${activeClass}">${daysOfWeek[i]} (${formattedHeaderDate})</div>`;
        }
        if (headerDays) headerDays.innerHTML = headerHTML;

        // Clear grid
        DOM.calendarTimeSlots.innerHTML = "";

        TIME_SLOTS_HOURS.forEach(time => {
            const startHour = parseInt(time.split(":")[0]);
            const endHourStr = `${(startHour + 1 < 10 ? '0' : '')}${startHour + 1}:00`;
            const timeLabel = `${time} - ${endHourStr}`;

            const slotRow = document.createElement("div");
            slotRow.className = "calendar-slot-row";
            slotRow.style.gridTemplateColumns = "100px repeat(5, 1fr)";
            slotRow.style.gap = "0.5rem";
            slotRow.style.alignItems = "stretch";

            let rowHTML = `<span class="slot-time" style="display:flex; align-items:center;">${timeLabel}</span>`;

            weekDates.forEach(dayInfo => {
                const currentDayTimetable = state.settings.timetableSynced ? 
                    state.timetable.filter(t => t.venueId === selectedVenueId && t.day === dayInfo.dayIndex) : [];

                const dayBookings = state.bookings.filter(b => b.venueId === selectedVenueId && b.date === dayInfo.dateStr && b.status !== "cancelled" && b.status !== "rejected");

                // 1. Check Timetable Locks
                const timetableLock = currentDayTimetable.find(t => {
                    const tStart = parseInt(t.startTime.split(":")[0]);
                    const tEnd = parseInt(t.endTime.split(":")[0]);
                    return startHour >= tStart && startHour < tEnd;
                });

                // 2. Check Approved Bookings
                const approvedBooking = dayBookings.find(b => {
                    const bStart = parseInt(b.startTime.split(":")[0]);
                    const bEnd = parseInt(b.endTime.split(":")[0]);
                    return b.status === "approved" && startHour >= bStart && startHour < bEnd;
                });

                // 3. Check Check-in Bookings
                const checkinBooking = dayBookings.find(b => {
                    const bStart = parseInt(b.startTime.split(":")[0]);
                    const bEnd = parseInt(b.endTime.split(":")[0]);
                    return b.status === "checkin" && startHour >= bStart && startHour < bEnd;
                });

                // 4. Check Pending Bookings
                const pendingBooking = dayBookings.find(b => {
                    const bStart = parseInt(b.startTime.split(":")[0]);
                    const bEnd = parseInt(b.endTime.split(":")[0]);
                    return b.status === "pending" && startHour >= bStart && startHour < bEnd;
                });

                let statusClass = "available";
                let displayHTML = "Available";
                let clickHandler = `openBookingModalWithTime('${selectedVenueId}', '${dayInfo.dateStr}', '${time}', '${endHourStr}')`;

                if (timetableLock) {
                    statusClass = "blocked";
                    displayHTML = `🔒 Blocked`;
                    clickHandler = `showBlockAlert('${timetableLock.className}')`;
                } else if (checkinBooking) {
                    statusClass = "booked";
                    displayHTML = `📅 Attended`;
                    clickHandler = `showBookingAlert('${checkinBooking.id}')`;
                } else if (approvedBooking) {
                    statusClass = "booked";
                    displayHTML = `📅 Booked`;
                    clickHandler = `showBookingAlert('${approvedBooking.id}')`;
                } else if (pendingBooking) {
                    statusClass = "pending";
                    displayHTML = `⏳ Pending`;
                    clickHandler = `showPendingAlert('${pendingBooking.id}')`;
                }

                if (state.currentRole === "guest" && statusClass === "available") {
                    clickHandler = `showGuestRestrictedAlert()`;
                }

                rowHTML += `
                    <div class="slot-visual ${statusClass}" onclick="${clickHandler}" style="font-size:0.75rem; text-align:center; padding: 0.25rem; height: auto; min-height: 40px; display:flex; align-items:center; justify-content:center;">
                        ${displayHTML}
                    </div>
                `;
            });

            slotRow.innerHTML = rowHTML;
            DOM.calendarTimeSlots.appendChild(slotRow);
        });
    } else {
        const headerDays = document.querySelector(".calendar-header-days");
        if (headerDays) {
            headerDays.style.gridTemplateColumns = "100px 1fr";
            headerDays.style.gap = "0";
        }

        const dayOfWeek = selectedDate.getDay(); // 0 is Sunday, 1 is Monday...

        // Set day header
        const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (DOM.calendarDayHeader) {
            DOM.calendarDayHeader.textContent = `${daysArr[dayOfWeek]} (${getReadableDate(selectedDateStr)})`;
        }

        // Fetch timetable blockouts
        const currentDayTimetable = state.settings.timetableSynced ? 
            state.timetable.filter(t => t.venueId === selectedVenueId && t.day === dayOfWeek) : [];

        // Fetch bookings for this venue on this day
        const dayBookings = state.bookings.filter(b => b.venueId === selectedVenueId && b.date === selectedDateStr && b.status !== "cancelled" && b.status !== "rejected");

        // Clear and build grid
        DOM.calendarTimeSlots.innerHTML = "";

        TIME_SLOTS_HOURS.forEach(time => {
            const startHour = parseInt(time.split(":")[0]);
            const endHourStr = `${(startHour + 1 < 10 ? '0' : '')}${startHour + 1}:00`;
            const timeLabel = `${time} - ${endHourStr}`;

            // 1. Check Timetable Locks
            const timetableLock = currentDayTimetable.find(t => {
                const tStart = parseInt(t.startTime.split(":")[0]);
                const tEnd = parseInt(t.endTime.split(":")[0]);
                return startHour >= tStart && startHour < tEnd;
            });

            // 2. Check Approved Bookings
            const approvedBooking = dayBookings.find(b => {
                const bStart = parseInt(b.startTime.split(":")[0]);
                const bEnd = parseInt(b.endTime.split(":")[0]);
                return b.status === "approved" && startHour >= bStart && startHour < bEnd;
            });

            // 3. Check Check-in Bookings
            const checkinBooking = dayBookings.find(b => {
                const bStart = parseInt(b.startTime.split(":")[0]);
                const bEnd = parseInt(b.endTime.split(":")[0]);
                return b.status === "checkin" && startHour >= bStart && startHour < bEnd;
            });

            // 4. Check Pending Bookings
            const pendingBooking = dayBookings.find(b => {
                const bStart = parseInt(b.startTime.split(":")[0]);
                const bEnd = parseInt(b.endTime.split(":")[0]);
                return b.status === "pending" && startHour >= bStart && startHour < bEnd;
            });

            let statusClass = "available";
            let displayHTML = "Available (Click to Reserve)";
            let clickHandler = `openBookingModalWithTime('${selectedVenueId}', '${selectedDateStr}', '${time}', '${endHourStr}')`;

            if (timetableLock) {
                statusClass = "blocked";
                displayHTML = `🔒 Blocked: Academic Timetable (${timetableLock.className})`;
                clickHandler = `showBlockAlert('${timetableLock.className}')`;
            } else if (checkinBooking) {
                statusClass = "booked"; // Render checked-in as booked in calendar
                displayHTML = `📅 Confirmed & Attended: ${checkinBooking.purpose} (${checkinBooking.requesterName})`;
                clickHandler = `showBookingAlert('${checkinBooking.id}')`;
            } else if (approvedBooking) {
                statusClass = "booked";
                displayHTML = `📅 Booked: ${approvedBooking.purpose} (${approvedBooking.requesterName})`;
                clickHandler = `showBookingAlert('${approvedBooking.id}')`;
            } else if (pendingBooking) {
                statusClass = "pending";
                displayHTML = `⏳ Pending Approval: ${pendingBooking.purpose} (${pendingBooking.requesterName})`;
                clickHandler = `showPendingAlert('${pendingBooking.id}')`;
            }

            // Guest restriction override
            if (state.currentRole === "guest" && statusClass === "available") {
                clickHandler = `showGuestRestrictedAlert()`;
            }

            const slotRow = document.createElement("div");
            slotRow.className = "calendar-slot-row";
            slotRow.innerHTML = `
                <span class="slot-time">${timeLabel}</span>
                <div class="slot-visual ${statusClass}" onclick="${clickHandler}">
                    ${displayHTML}
                </div>
            `;
            DOM.calendarTimeSlots.appendChild(slotRow);
        });
    }
}

// Slot click handlers
window.showBlockAlert = function(className) {
    showToast("Academic Class Reservation", `This room is reserved for: ${className}. Bookings are restricted.`, "danger");
};

window.showGuestRestrictedAlert = function() {
    showToast("Login Required", "You must switch your active role to Faculty or Student Rep to request bookings.", "warning");
};

window.showBookingAlert = function(bookingId) {
    const booking = state.bookings.find(b => b.id === bookingId);
    if (booking) {
        showToast("Slot Reserved", `Booked for "${booking.purpose}" by ${booking.requesterName}.`, "primary");
    }
};

window.showPendingAlert = function(bookingId) {
    const booking = state.bookings.find(b => b.id === bookingId);
    if (booking) {
        const isApprover = (state.currentRole === "approver-dept" && getVenueApprover(booking.venueId) === "dept") || 
                           (state.currentRole === "approver-estate" && getVenueApprover(booking.venueId) === "estate");
        
        if (isApprover) {
            openApprovalModal(bookingId);
        } else {
            showToast("Slot Awaiting Review", `Request for "${booking.purpose}" by ${booking.requesterName} is pending approval.`, "warning");
        }
    }
};

// 3. BOOKINGS TABLE (MY BOOKINGS HISTORY)
function renderBookingsTable() {
    const isGuest = state.currentRole === "guest";
    if (isGuest) {
        DOM.bookingsTableBody.innerHTML = "";
        DOM.bookingsEmpty.style.display = "block";
        DOM.bookingsEmpty.textContent = "Please Sign In using your email and select your role to see bookings.";
        return;
    }

    // Filter bookings belonging to user email
    const userBookings = state.bookings.filter(b => {
        if (b.requesterName === state.userEmail) return true;
        // Show default seed bookings only to the default email of the role
        if (state.currentRole === "faculty" && state.userEmail === "rajesh@juit.ac.in" && b.requesterName === "Dr. Rajesh Sharma") return true;
        if (state.currentRole === "student" && state.userEmail === "amit@juit.ac.in" && b.requesterName === "Amit Patel (Club Rep)") return true;
        return false;
    });

    if (userBookings.length === 0) {
        DOM.bookingsTableBody.innerHTML = "";
        DOM.bookingsEmpty.style.display = "block";
        return;
    }

    DOM.bookingsEmpty.style.display = "none";
    DOM.bookingsTableBody.innerHTML = userBookings.map(b => {
        const venueName = getVenueName(b.venueId);
        const timeStr = `${b.startTime} - ${b.endTime}`;
        const typeBadge = b.isRecurring ? '<span class="badge badge-accent">Recurring</span>' : '<span class="badge btn-secondary">One-time</span>';
        
        let statusBadge = `<span class="status-badge ${b.status}">${b.status}</span>`;
        if (b.status === "checkin") {
            statusBadge = `<span class="status-badge checkin">Attended</span>`;
        }

        const comments = b.approverComments ? `<span class="text-secondary" style="font-size:0.8rem; font-style:italic;">"${b.approverComments}"</span>` : `<span class="text-muted">-</span>`;

        // Verification of Notice Period for Cancellation / Reschedule
        const noticePeriodMet = checkNoticePeriod(b);
        let actionButtons = "";

        if (b.status === "pending" || b.status === "approved") {
            if (noticePeriodMet) {
                actionButtons = `
                    <div style="display:flex; gap:0.5rem;">
                        <button class="btn btn-sm btn-outline" onclick="openRescheduleModal('${b.id}')">Reschedule</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="cancelBooking('${b.id}')">Cancel</button>
                    </div>
                `;
            } else {
                actionButtons = `
                    <span class="text-muted" style="font-size:0.75rem;" title="Actions restricted. Notice period: ${state.settings.noticePeriod}h.">
                        🔒 Restricted (<${state.settings.noticePeriod}h notice)
                    </span>
                `;
            }
        } else if (b.status === "approved" || b.status === "checkin") {
            actionButtons = `<span class="text-muted" style="font-size:0.75rem;">None</span>`;
        } else {
            actionButtons = `<span class="text-muted" style="font-size:0.75rem;">None</span>`;
        }

        return `
            <tr>
                <td><strong>${b.id}</strong></td>
                <td>${venueName}</td>
                <td>
                    <div>${getReadableDate(b.date)}</div>
                    <div class="text-secondary" style="font-size: 0.8rem;">${timeStr}</div>
                </td>
                <td>${typeBadge}</td>
                <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${b.purpose}</td>
                <td>${b.expectedAttendees}</td>
                <td>${statusBadge}</td>
                <td>${comments}</td>
                <td>${actionButtons}</td>
            </tr>
        `;
    }).join('');
}

// Notice Period Check: Returns true if event time is at least noticePeriod hours after simulated time
function checkNoticePeriod(booking) {
    const bookingDateStr = booking.date; // YYYY-MM-DD
    const bookingHour = parseInt(booking.startTime.split(":")[0]);
    
    const eventDateTime = new Date(bookingDateStr);
    eventDateTime.setHours(bookingHour, 0, 0, 0);

    const timeDiffMs = eventDateTime.getTime() - state.simulatedDateTime.getTime();
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

    return timeDiffHours >= state.settings.noticePeriod;
}

// Cancel Booking logic
window.cancelBooking = function(bookingId) {
    const bookingIndex = state.bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
        const booking = state.bookings[bookingIndex];
        booking.status = "cancelled";
        saveBookings();
        showToast("Booking Cancelled", `Booking ${bookingId} has been successfully cancelled.`, "success");
        
        // Notify appropriate authorities
        const office = getVenueApprover(booking.venueId).toUpperCase();
        addNotification("Booking Cancelled", `${booking.requesterName} cancelled booking ${bookingId} for ${getVenueName(booking.venueId)}.`);
        
        updatePendingBadgeCount();
        renderView("bookings");
    }
};

// 4. APPROVALS TABLE
function renderApprovalsTable() {
    const role = state.currentRole;
    if (role !== "approver-dept" && role !== "approver-estate") {
        DOM.approvalsTableBody.innerHTML = "";
        DOM.approvalsEmpty.style.display = "block";
        DOM.approvalsEmpty.textContent = "Access restricted to Approvers.";
        return;
    }

    const currentApproverCode = role === "approver-dept" ? "dept" : "estate";
    
    // Filter pending requests matching routing rules
    const pendingList = state.bookings.filter(b => b.status === "pending" && getVenueApprover(b.venueId) === currentApproverCode);

    if (pendingList.length === 0) {
        DOM.approvalsTableBody.innerHTML = "";
        DOM.approvalsEmpty.style.display = "block";
        return;
    }

    DOM.approvalsEmpty.style.display = "none";
    DOM.approvalsTableBody.innerHTML = pendingList.map(b => {
        const venueName = getVenueName(b.venueId);
        const timeStr = `${b.startTime} - ${b.endTime}`;
        
        // Check for overlaps to flag warnings
        const conflictCount = checkOverlappingPendingRequestsCount(b);
        const hasTimetableConflict = checkAcademicTimetableConflict(b.venueId, b.date, b.startTime, b.endTime);
        
        let warnHTML = `<span class="text-secondary" style="font-size:0.8rem;">Clear</span>`;
        if (hasTimetableConflict) {
            warnHTML = `<span class="status-badge rejected" style="font-size:0.7rem;">⚠️ Class Conflict</span>`;
        } else if (conflictCount > 0) {
            warnHTML = `<span class="status-badge pending" style="font-size:0.7rem;">⚠️ Overlap (${conflictCount} requests)</span>`;
        }

        return `
            <tr>
                <td><strong>${b.id}</strong></td>
                <td>
                    <div>${b.requesterName}</div>
                    <div class="text-muted" style="font-size:0.75rem;">${b.requesterRole}</div>
                </td>
                <td>${venueName}</td>
                <td>
                    <div>${getReadableDate(b.date)}</div>
                    <div class="text-secondary" style="font-size: 0.8rem;">${timeStr}</div>
                </td>
                <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${b.purpose}</td>
                <td>${warnHTML}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="openApprovalModal('${b.id}')">Review Request</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Calculate how many OTHER pending requests overlap with this slot
function checkOverlappingPendingRequestsCount(booking) {
    const others = state.bookings.filter(b => 
        b.id !== booking.id && 
        b.venueId === booking.venueId && 
        b.date === booking.date && 
        b.status === "pending"
    );

    let overlaps = 0;
    const bStart = parseInt(booking.startTime.split(":")[0]);
    const bEnd = parseInt(booking.endTime.split(":")[0]);

    others.forEach(o => {
        const oStart = parseInt(o.startTime.split(":")[0]);
        const oEnd = parseInt(o.endTime.split(":")[0]);

        if (bStart < oEnd && oStart < bEnd) {
            overlaps++;
        }
    });

    return overlaps;
}

// 5. ADMIN DASHBOARD
function renderAdminDashboard() {
    // Basic counters
    const active = state.bookings.filter(b => b.status === "approved" || b.status === "checkin").length;
    const pending = state.bookings.filter(b => b.status === "pending").length;
    const attended = state.bookings.filter(b => b.status === "checkin").length;
    
    // Check-in rates calculation
    const attendanceRate = active > 0 ? Math.round((attended / active) * 100) : 0;

    DOM.totalBookingsStat.textContent = active;
    DOM.pendingBookingsStat.textContent = pending;
    DOM.attendanceRateStat.textContent = `${attendanceRate}%`;

    // Build Settings period input
    DOM.noticePeriodInput.value = state.settings.noticePeriod;

    // Render Timetable Sync items list
    DOM.timetableList.innerHTML = state.timetable.map((t, index) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return `
            <div class="timetable-item">
                <div><strong>${getVenueName(t.venueId)}</strong></div>
                <div class="timetable-item-meta">${days[t.day]} ${t.startTime}-${t.endTime} | ${t.className}</div>
            </div>
        `;
    }).join('');

    // RENDER SVG CHARTS
    renderUtilizationChart();
    renderPeakChart();
}

function renderUtilizationChart() {
    // Estimate utilization percentage based on simulated bookings count per venue
    // Simple mock calculation based on state bookings to reflect live dynamics
    const data = state.venues.map(v => {
        const bookingsCount = state.bookings.filter(b => b.venueId === v.id && (b.status === "approved" || b.status === "checkin")).length;
        // Mock utilization calculations mapping 0-10 bookings to 10%-90%
        const rate = Math.min(15 + bookingsCount * 18, 95);
        return { name: v.name, rate };
    });

    DOM.utilizationChart.innerHTML = `
        <div style="display:flex; align-items:flex-end; justify-content:space-around; width:100%; height:180px; padding-bottom:10px; border-bottom: 2px solid var(--border-color);">
            ${data.map(d => `
                <div class="bar-wrapper">
                    <div class="chart-bar" style="height: ${d.rate}%;" data-value="${d.rate}"></div>
                    <div class="chart-label" title="${d.name}">${d.name}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPeakChart() {
    // Generate data representation of time slots
    const hoursCounts = TIME_SLOTS_HOURS.map(hour => {
        const count = state.bookings.filter(b => b.startTime === hour && b.status !== "rejected" && b.status !== "cancelled").length;
        return count;
    });

    // Draw dynamic line chart using raw SVG points for high fidelity graphics
    const maxVal = Math.max(...hoursCounts, 2);
    const width = 500;
    const height = 180;
    const padding = 30;
    
    // Points generator
    const points = TIME_SLOTS_HOURS.map((hour, idx) => {
        const x = padding + (idx * (width - padding * 2) / (TIME_SLOTS_HOURS.length - 1));
        const y = height - padding - (hoursCounts[idx] * (height - padding * 2) / maxVal);
        return { x, y, hour };
    });

    const pathData = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

    let labelsHTML = points.map((p, idx) => {
        if (idx % 2 === 0) {
            return `<text x="${p.x}" y="${height - 10}" class="svg-label" text-anchor="middle">${p.hour}</text>`;
        }
        return '';
    }).join('');

    let gridLinesHTML = "";
    for (let i = 1; i <= 3; i++) {
        const yVal = padding + i * (height - padding * 2) / 4;
        gridLinesHTML += `<line x1="${padding}" y1="${yVal}" x2="${width - padding}" y2="${yVal}" class="svg-grid-line"/>`;
    }

    let dotsHTML = points.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--primary)"/>
        <circle cx="${p.x}" cy="${p.y}" r="8" fill="var(--primary)" fill-opacity="0.15" class="chart-dot-pulse"/>
    `).join('');

    DOM.peakChart.innerHTML = `
        <svg class="svg-chart" viewBox="0 0 ${width} ${height}" style="width:100%; height:100%;">
            ${gridLinesHTML}
            <path d="${pathData}" class="svg-path" />
            ${dotsHTML}
            ${labelsHTML}
        </svg>
    `;
}

// Timetable Synchronization Action
DOM.syncTimetableBtn.addEventListener("click", () => {
    state.settings.timetableSynced = !state.settings.timetableSynced;
    saveSettings();
    
    if (state.settings.timetableSynced) {
        showToast("Timetable Synced", "Academic timetable slots successfully blocked across all classrooms.", "success");
        DOM.syncTimetableBtn.textContent = "Disable Timetable Integration";
        DOM.syncTimetableBtn.classList.remove("btn-outline");
        DOM.syncTimetableBtn.classList.add("btn-primary");
    } else {
        showToast("Timetable Offline", "Academic timetable sync disabled. Classroom slots are now fully open.", "warning");
        DOM.syncTimetableBtn.textContent = "Enable Timetable Integration";
        DOM.syncTimetableBtn.classList.remove("btn-primary");
        DOM.syncTimetableBtn.classList.add("btn-outline");
    }

    renderView("reports");
});

// Settings Save
DOM.saveSettingsBtn.addEventListener("click", () => {
    state.settings.noticePeriod = parseInt(DOM.noticePeriodInput.value) || 24;
    saveSettings();
    showToast("Settings Updated", `Cancellation policy set to ${state.settings.noticePeriod} hours.`, "success");
});

// 6. QR CHECK-IN SCANNER VIEW RENDER
function renderCheckinScanner() {
    // Filter active role name
    const activeRoleConfig = ROLES[state.currentRole];
    
    // Find approved bookings on simulated today date that haven't checked-in yet
    const todayStr = formatDateString(state.simulatedDateTime);
    const approvedToday = state.bookings.filter(b => {
        const isOwner = b.requesterName === state.userEmail ||
            (state.currentRole === "faculty" && state.userEmail === "rajesh@juit.ac.in" && b.requesterName === "Dr. Rajesh Sharma") ||
            (state.currentRole === "student" && state.userEmail === "amit@juit.ac.in" && b.requesterName === "Amit Patel (Club Rep)");
        return isOwner && b.date === todayStr && b.status === "approved";
    });

    if (approvedToday.length === 0) {
        DOM.scannerSelectBooking.innerHTML = `<option value="">-- No Approved Bookings for Today --</option>`;
        DOM.btnSimulateScan.disabled = true;
        return;
    }

    DOM.btnSimulateScan.disabled = false;
    DOM.scannerSelectBooking.innerHTML = approvedToday.map(b => `
        <option value="${b.id}">${getVenueName(b.venueId)} (${b.startTime}-${b.endTime}) - ${b.purpose}</option>
    `).join('');
}

// Scan Action
DOM.btnSimulateScan.addEventListener("click", () => {
    const bookingId = DOM.scannerSelectBooking.value;
    if (!bookingId) return;

    const bIndex = state.bookings.findIndex(b => b.id === bookingId);
    if (bIndex !== -1) {
        state.bookings[bIndex].status = "checkin";
        state.bookings[bIndex].checkedIn = true;
        saveBookings();

        showToast("Check-In Confirmed", `Successfully checked into venue for Booking ${bookingId}!`, "success");
        
        // Notify Admin / Approvers
        addNotification("Venue Checked-in", `${state.bookings[bIndex].requesterName} checked-in at ${getVenueName(state.bookings[bIndex].venueId)}.`);

        // Redirect to catalogue
        setTimeout(() => {
            const bookingsNav = document.querySelector(`.nav-item[data-view="bookings"]`);
            if (bookingsNav) bookingsNav.click();
        }, 1200);
    }
});

// --- ADVANCED BOOKING RULES AND CONFLIC PREVENTION ---

// Check if booking overlaps with existing approved bookings
function checkBookingConflicts(venueId, dateStr, startStr, endStr) {
    const startH = parseInt(startStr.split(":")[0]);
    const endH = parseInt(endStr.split(":")[0]);

    // Check against existing Approved / Checked-in bookings
    const approvedMatches = state.bookings.filter(b => 
        b.venueId === venueId && 
        b.date === dateStr && 
        (b.status === "approved" || b.status === "checkin")
    );

    for (let b of approvedMatches) {
        const bStart = parseInt(b.startTime.split(":")[0]);
        const bEnd = parseInt(b.endTime.split(":")[0]);

        if (startH < bEnd && bStart < endH) {
            return {
                type: "approved",
                booking: b
            };
        }
    }

    // Check academic timetable blocks
    if (state.settings.timetableSynced) {
        const selectedDate = new Date(dateStr);
        const dayOfWeek = selectedDate.getDay();
        const timetableMatches = state.timetable.filter(t => t.venueId === venueId && t.day === dayOfWeek);

        for (let t of timetableMatches) {
            const tStart = parseInt(t.startTime.split(":")[0]);
            const tEnd = parseInt(t.endTime.split(":")[0]);

            if (startH < tEnd && tStart < endH) {
                return {
                    type: "timetable",
                    className: t.className
                };
            }
        }
    }

    return null;
}

// Check academic timetable overlap directly
function checkAcademicTimetableConflict(venueId, dateStr, startStr, endStr) {
    if (!state.settings.timetableSynced) return false;
    const selectedDate = new Date(dateStr);
    const dayOfWeek = selectedDate.getDay();

    const startH = parseInt(startStr.split(":")[0]);
    const endH = parseInt(endStr.split(":")[0]);

    const timetableMatches = state.timetable.filter(t => t.venueId === venueId && t.day === dayOfWeek);

    for (let t of timetableMatches) {
        const tStart = parseInt(t.startTime.split(":")[0]);
        const tEnd = parseInt(t.endTime.split(":")[0]);

        if (startH < tEnd && tStart < endH) return true;
    }
    return false;
}

// Modal open with prepopulations
window.openBookingModal = function(venueId) {
    DOM.bookingEditId.value = ""; // Mode is CREATE
    DOM.modalTitle.textContent = "Book a Venue";
    DOM.submitBookingBtn.textContent = "Submit Request";
    
    // Fill venues dropdown
    DOM.bookingVenue.innerHTML = state.venues.map(v => `
        <option value="${v.id}">${v.name}</option>
    `).join('');

    DOM.bookingVenue.value = venueId;
    DOM.bookingDate.value = formatDateString(state.simulatedDateTime);
    DOM.bookingAttendees.value = "";
    DOM.bookingPurpose.value = "";
    DOM.bookingRecurring.checked = false;
    DOM.bookingFormError.style.display = "none";

    DOM.bookingModal.classList.add("active");
    checkModalConflicts();
};

// Modal open with specific timeslot selected
window.openBookingModalWithTime = function(venueId, dateStr, startTime, endTime) {
    openBookingModal(venueId);
    DOM.bookingDate.value = dateStr;
    DOM.bookingStart.value = startTime;
    DOM.bookingEnd.value = endTime;
    checkModalConflicts();
};

// Reschedule booking
window.openRescheduleModal = function(bookingId) {
    const booking = state.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    DOM.bookingEditId.value = booking.id; // Mode is EDIT
    DOM.modalTitle.textContent = `Reschedule Booking ${booking.id}`;
    DOM.submitBookingBtn.textContent = "Confirm Changes";

    // Fill venues dropdown
    DOM.bookingVenue.innerHTML = state.venues.map(v => `
        <option value="${v.id}">${v.name}</option>
    `).join('');

    DOM.bookingVenue.value = booking.venueId;
    DOM.bookingDate.value = booking.date;
    DOM.bookingAttendees.value = booking.expectedAttendees;
    DOM.bookingStart.value = booking.startTime;
    DOM.bookingEnd.value = booking.endTime;
    DOM.bookingPurpose.value = booking.purpose;
    DOM.bookingRecurring.checked = booking.isRecurring;
    DOM.bookingFormError.style.display = "none";

    DOM.bookingModal.classList.add("active");
    checkModalConflicts();
};

// Close booking modal handlers
function closeBookingModal() {
    DOM.bookingModal.classList.remove("active");
}
DOM.closeModalBtn.addEventListener("click", closeBookingModal);
DOM.cancelModalBtn.addEventListener("click", closeBookingModal);

// Proactive Conflict Verification in Modal
function checkModalConflicts() {
    const venueId = DOM.bookingVenue.value;
    const dateStr = DOM.bookingDate.value;
    const startStr = DOM.bookingStart.value;
    const endStr = DOM.bookingEnd.value;
    const editId = DOM.bookingEditId.value;

    if (!venueId || !dateStr || !startStr || !endStr) return;

    // Check logical time bounds
    const startHour = parseInt(startStr.split(":")[0]);
    const endHour = parseInt(endStr.split(":")[0]);
    if (startHour >= endHour) {
        DOM.bookingFormError.textContent = "Start time must be strictly before End time.";
        DOM.bookingFormError.className = "form-group text-danger";
        DOM.bookingFormError.style.display = "block";
        DOM.bookingFormError.style.padding = "0.5rem";
        DOM.bookingFormError.style.background = "rgba(239, 68, 68, 0.1)";
        DOM.bookingFormError.style.borderRadius = "8px";
        return;
    }

    const conflictResult = checkBookingConflicts(venueId, dateStr, startStr, endStr);
    
    let isConflictValid = false;
    if (conflictResult) {
        if (editId && conflictResult.booking && conflictResult.booking.id === editId) {
            isConflictValid = true; // Overlapping itself is valid
        }
    } else {
        isConflictValid = true;
    }

    if (conflictResult && !isConflictValid) {
        if (conflictResult.type === "timetable") {
            DOM.bookingFormError.textContent = `⚠️ Scheduling Conflict: Slot blocked by Academic Timetable: ${conflictResult.className}.`;
        } else {
            DOM.bookingFormError.textContent = `⚠️ Scheduling Conflict: Slot already booked by ${conflictResult.booking.requesterName} for "${conflictResult.booking.purpose}".`;
        }
        DOM.bookingFormError.className = "form-group text-warning";
        DOM.bookingFormError.style.display = "block";
        DOM.bookingFormError.style.padding = "0.5rem";
        DOM.bookingFormError.style.background = "rgba(245, 158, 11, 0.1)";
        DOM.bookingFormError.style.border = "1px solid rgba(245, 158, 11, 0.3)";
        DOM.bookingFormError.style.borderRadius = "8px";
        DOM.bookingFormError.style.color = "var(--warning)";
    } else {
        DOM.bookingFormError.style.display = "none";
    }
}

// Submit Booking form (Creation / Rescheduling)
DOM.bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    DOM.bookingFormError.style.display = "none";

    const editId = DOM.bookingEditId.value;
    const venueId = DOM.bookingVenue.value;
    const dateStr = DOM.bookingDate.value;
    const attendees = parseInt(DOM.bookingAttendees.value);
    const startStr = DOM.bookingStart.value;
    const endStr = DOM.bookingEnd.value;
    const purpose = DOM.bookingPurpose.value;
    const recurring = DOM.bookingRecurring.checked;

    // 1. Check logical time bounds
    const startHour = parseInt(startStr.split(":")[0]);
    const endHour = parseInt(endStr.split(":")[0]);

    if (startHour >= endHour) {
        DOM.bookingFormError.textContent = "Start time must be strictly before End time.";
        DOM.bookingFormError.style.display = "block";
        return;
    }

    // Check capacity limit
    const venueObj = state.venues.find(v => v.id === venueId);
    if (venueObj && attendees > venueObj.capacity) {
        DOM.bookingFormError.textContent = `Attendee count exceeds venue capacity (${venueObj.capacity} seats).`;
        DOM.bookingFormError.style.display = "block";
        return;
    }

    // 2. Validate conflicts
    const conflictResult = checkBookingConflicts(venueId, dateStr, startStr, endStr);
    
    // Exclude checking editId matching records during reschedule validations
    let isConflictValid = false;
    if (conflictResult) {
        if (editId && conflictResult.booking && conflictResult.booking.id === editId) {
            isConflictValid = true; // Overlapping itself is valid
        }
    } else {
        isConflictValid = true;
    }

    if (conflictResult && !isConflictValid) {
        if (conflictResult.type === "timetable") {
            DOM.bookingFormError.textContent = `Scheduling conflict: Slot blocked by Academic Timetable: ${conflictResult.className}.`;
        } else {
            DOM.bookingFormError.textContent = `Scheduling conflict: Slot already booked by ${conflictResult.booking.requesterName} for "${conflictResult.booking.purpose}".`;
        }
        DOM.bookingFormError.style.display = "block";
        return;
    }

    const requesterConfig = ROLES[state.currentRole];

    if (editId) {
        // Rescheduling Workflow
        const idx = state.bookings.findIndex(b => b.id === editId);
        if (idx !== -1) {
            const oldBooking = state.bookings[idx];
            
            // Validate notice period before completing reschedule edits
            if (!checkNoticePeriod(oldBooking)) {
                DOM.bookingFormError.textContent = `Notice period restriction violated. Must reschedule at least ${state.settings.noticePeriod}h before event.`;
                DOM.bookingFormError.style.display = "block";
                return;
            }

            oldBooking.venueId = venueId;
            oldBooking.date = dateStr;
            oldBooking.expectedAttendees = attendees;
            oldBooking.startTime = startStr;
            oldBooking.endTime = endStr;
            oldBooking.purpose = purpose;
            oldBooking.isRecurring = recurring;
            oldBooking.status = "pending"; // Revert to pending for re-approval
            
            saveBookings();
            showToast("Booking Rescheduled", `Booking request ${editId} modified and sent back for approvals.`, "success");
            
            addNotification("Reschedule Requested", `${requesterConfig.name} updated Booking ${editId} details.`);
        }
    } else {
        // New Reservation Request Creation
        if (recurring) {
            // Recurring reservation simulation for next 8 weeks
            const conflictDates = [];
            const datesToBook = [];
            
            let tempDate = new Date(dateStr);
            for (let i = 0; i < 8; i++) {
                const checkStr = formatDateString(tempDate);
                const loopConflict = checkBookingConflicts(venueId, checkStr, startStr, endStr);
                if (loopConflict) {
                    conflictDates.push(`${getReadableDate(checkStr)} (${loopConflict.type === 'timetable' ? 'Timetable Lock' : 'Approved Booking'})`);
                } else {
                    datesToBook.push(checkStr);
                }
                // Jump to next week
                tempDate.setDate(tempDate.getDate() + 7);
            }

            if (conflictDates.length > 0) {
                DOM.bookingFormError.textContent = `Recurring conflict: Fails on week dates: ${conflictDates.slice(0, 3).join(', ')}...`;
                DOM.bookingFormError.style.display = "block";
                return;
            }

            // Create parent and child linked bookings
            const parentId = "B-REC-" + Date.now().toString().slice(-4);
            
            datesToBook.forEach((dStr, idx) => {
                const subId = `${parentId}-${idx + 1}`;
                const newB = {
                    id: subId,
                    venueId,
                    date: dStr,
                    startTime: startStr,
                    endTime: endStr,
                    requesterName: state.userEmail || requesterConfig.name,
                    requesterRole: requesterConfig.displayRole,
                    purpose: `${purpose} (Recur Week ${idx + 1})`,
                    expectedAttendees: attendees,
                    status: "pending",
                    approverComments: "",
                    isRecurring: true,
                    recurrenceParent: parentId,
                    checkedIn: false
                };
                state.bookings.push(newB);
            });

            saveBookings();
            showToast("Recurring Request Submitted", `Submitted 8 weekly reservations linked to series ${parentId}.`, "success");
            addNotification("New Recurring Request", `${state.userEmail || requesterConfig.name} requested recurring bookings for ${getVenueName(venueId)}.`);

        } else {
            // Standard Single Booking
            const newId = "B-" + Date.now().toString().slice(-4);
            const newBooking = {
                id: newId,
                venueId,
                date: dateStr,
                startTime: startStr,
                endTime: endStr,
                requesterName: state.userEmail || requesterConfig.name,
                requesterRole: requesterConfig.displayRole,
                purpose,
                expectedAttendees: attendees,
                status: "pending",
                approverComments: "",
                isRecurring: false,
                recurrenceParent: null,
                checkedIn: false
            };

            state.bookings.push(newBooking);
            saveBookings();
            showToast("Request Submitted", `Booking request ${newId} submitted successfully.`, "success");
            addNotification("Booking Requested", `${state.userEmail || requesterConfig.name} submitted request ${newId} for ${getVenueName(venueId)}.`);
        }
    }

    closeBookingModal();

    closeBookingModal();
    updatePendingBadgeCount();
    
    // Redirect view to bookings list
    const bookingsNav = document.querySelector(`.nav-item[data-view="bookings"]`);
    if (bookingsNav) bookingsNav.click();
});

// --- APPROVER ACTIONS MODAL WORKFLOW ---

let activeReviewBookingId = null;

window.openApprovalModal = function(bookingId) {
    try {
        const booking = state.bookings.find(b => b.id === bookingId);
        if (!booking) {
            showToast("Error", "Booking not found in memory.", "danger");
            return;
        }

        activeReviewBookingId = bookingId;
        
        DOM.reviewId.textContent = booking.id;
        DOM.reviewRequester.textContent = booking.requesterName;
        DOM.reviewRequesterRole.textContent = booking.requesterRole;
        DOM.reviewVenue.textContent = getVenueName(booking.venueId);
        DOM.reviewTime.textContent = `${getReadableDate(booking.date)} | ${booking.startTime} - ${booking.endTime}`;
        DOM.reviewAttendees.textContent = booking.expectedAttendees || "N/A";
        DOM.reviewPurpose.textContent = booking.purpose || "N/A";
        DOM.reviewRecurrence.textContent = booking.isRecurring ? "Weekly Series" : "One-time Slot";
        DOM.approvalComment.value = "";

        try {
            const pendingConflicts = checkOverlappingPendingRequestsCount(booking);
            const hasTimetableConflict = checkAcademicTimetableConflict(booking.venueId, booking.date, booking.startTime, booking.endTime);

            if (hasTimetableConflict) {
                DOM.reviewConflictWarning.style.display = "flex";
                DOM.reviewConflictText.textContent = "Conflict flagged! This slots overlaps with an official academic timetable class block.";
            } else if (pendingConflicts > 0) {
                DOM.reviewConflictWarning.style.display = "flex";
                DOM.reviewConflictText.textContent = `Warning: ${pendingConflicts} other pending requests are competing for the same slot. Confirming this will automatically reject them.`;
            } else {
                DOM.reviewConflictWarning.style.display = "none";
            }
        } catch (err) {
            console.error(err);
            DOM.reviewConflictWarning.style.display = "none";
        }

        DOM.approvalModal.classList.add("active");
    } catch (e) {
        console.error(e);
        showToast("System Error", "Failed to open approval modal.", "danger");
    }
};

function closeApprovalModal() {
    DOM.approvalModal.classList.remove("active");
    activeReviewBookingId = null;
}
DOM.closeApprovalModal.addEventListener("click", closeApprovalModal);

function autoRejectConflictingBookings(confirmedBooking) {
    const startH = parseInt(confirmedBooking.startTime.split(":")[0]);
    const endH = parseInt(confirmedBooking.endTime.split(":")[0]);

    const conflicts = state.bookings.filter(b => 
        b.id !== confirmedBooking.id && 
        b.venueId === confirmedBooking.venueId && 
        b.date === confirmedBooking.date && 
        b.status === "pending"
    );

    conflicts.forEach(b => {
        const bStart = parseInt(b.startTime.split(":")[0]);
        const bEnd = parseInt(b.endTime.split(":")[0]);

        if (startH < bEnd && bStart < endH) {
            b.status = "rejected";
            b.approverComments = `Automatically rejected due to conflicting scheduling priority: ${confirmedBooking.id}`;
            addNotification("Booking Rejected", `Your request ${b.id} was rejected because slot conflicts with approved booking ${confirmedBooking.id}.`);
        }
    });
}

DOM.btnApproveRequest.addEventListener("click", () => {
    try {
        if (!activeReviewBookingId) return;
        const bIndex = state.bookings.findIndex(b => b.id === activeReviewBookingId);
        if (bIndex === -1) return;
        
        const booking = state.bookings[bIndex];
        
        const hasApprovedConflict = checkBookingConflicts(booking.venueId, booking.date, booking.startTime, booking.endTime);
        if (hasApprovedConflict && hasApprovedConflict.type !== "pending") {
            showToast("Approval Denied", "Slot was recently confirmed for another event or timetable change.", "danger");
            closeApprovalModal();
            return;
        }

        booking.status = "approved";
        booking.approverComments = DOM.approvalComment.value.trim() || "Approved. Make sure to present your QR code at check-in.";
        
        try { autoRejectConflictingBookings(booking); } catch(e) {}

        saveBookings().then(() => {
            showToast("Request Approved", `Confirmed booking ${booking.id} reservation successfully.`, "success");
            addNotification("Booking Confirmed", `Your booking request ${booking.id} for ${getVenueName(booking.venueId)} has been APPROVED.`);

            closeApprovalModal();
            updatePendingBadgeCount();
            
            const activeNav = document.querySelector(".nav-item.active");
            if (activeNav) {
                renderView(activeNav.dataset.view);
                if (activeNav.dataset.view === "calendar") renderCalendar();
            } else {
                renderView("approvals");
            }
        });
    } catch(err) {
        console.error(err);
        showToast("System Error", "Failed to approve booking.", "danger");
    }
});

DOM.btnRejectRequest.addEventListener("click", () => {
    if (!activeReviewBookingId) return;
    const comment = DOM.approvalComment.value.trim();
    if (!comment) {
        DOM.approvalComment.style.borderColor = "var(--error)";
        showToast("Comment Required", "Please provide a reason for rejecting this request.", "warning");
        return;
    }
    DOM.approvalComment.style.borderColor = "var(--border)";

    const bIndex = state.bookings.findIndex(b => b.id === activeReviewBookingId);
    if (bIndex !== -1) {
        const booking = state.bookings[bIndex];
        booking.status = "rejected";
        booking.approverComments = comment;

        saveBookings().then(() => {
            showToast("Request Rejected", `Booking ${booking.id} has been declined.`, "danger");
            addNotification("Booking Rejected", `Your request ${booking.id} has been rejected. Reason: "${comment}"`);

            closeApprovalModal();
            updatePendingBadgeCount();
            
            const activeNav = document.querySelector(".nav-item.active");
            if (activeNav) {
                renderView(activeNav.dataset.view);
                if (activeNav.dataset.view === "calendar") renderCalendar();
            } else {
                renderView("approvals");
            }
        });
    }
});


DOM.btnModifyRequest.addEventListener("click", () => {
    if (!activeReviewBookingId) return;
    const comment = DOM.approvalComment.value;
    if (!comment.trim()) {
        showToast("Comment Required", "Please details the required modifications in the comments box.", "warning");
        return;
    }

    const bIndex = state.bookings.findIndex(b => b.id === activeReviewBookingId);
    if (bIndex !== -1) {
        const booking = state.bookings[bIndex];
        booking.approverComments = `Modification Required: ${comment}`;
        // Leave status as pending, but requester will see HOD/Estate comments asking to change
        saveBookings();
        
        showToast("Modification Sent", `Sent comments back to requester for modifications.`, "warning");
        addNotification("Modifications Required", `Approver requested modifications for Booking ${booking.id}: "${comment}"`);

        closeApprovalModal();
        updatePendingBadgeCount();
        renderView("approvals");
    }
});

// --- CLOCK CONTROLS SIMULATION ---
DOM.advanceTimeBtn.addEventListener("click", () => {
    // Advance simulated time by 1 Day
    state.simulatedDateTime.setDate(state.simulatedDateTime.getDate() + 1);
    updateClockUI();

    const formattedToday = formatDateString(state.simulatedDateTime);
    
    // Auto mark non-checked-in approved bookings from past dates as expired
    state.bookings.forEach(b => {
        if (b.status === "approved" && b.date < formattedToday) {
            b.status = "cancelled";
            b.approverComments = "Expired: Event date passed without check-in.";
            addNotification("Booking Expired", `Booking ${b.id} expired due to missed check-in.`);
        }
    });
    saveBookings();

    showToast("Simulated Time Advanced", `Date shifted to ${getReadableDate(formattedToday)}`, "success");
    
    // Update active view
    const currentActiveView = document.querySelector(".app-view.active").id.replace("view-", "");
    renderView(currentActiveView);
});

// --- THEME SWAPPING ---
DOM.themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");
    if (isDark) {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
        DOM.themeText.textContent = "Dark Mode";
        localStorage.setItem("juit_theme", "light");
    } else {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
        DOM.themeText.textContent = "Light Mode";
        localStorage.setItem("juit_theme", "dark");
    }
});

// Theme local storage read
const savedTheme = localStorage.getItem("juit_theme");
if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    DOM.themeText.textContent = "Dark Mode";
}

// Search and Filter Events
DOM.venueSearch.addEventListener("input", renderCatalogue);
DOM.filterCapacity.addEventListener("change", renderCatalogue);
DOM.filterFacility.addEventListener("change", renderCatalogue);

DOM.calendarVenueSelect.addEventListener("change", renderCalendar);
DOM.calendarDateInput.addEventListener("input", renderCalendar);

// Calendar View Mode toggles
DOM.btnCalendarDayView.addEventListener("click", () => {
    state.calendarViewMode = "day";
    DOM.btnCalendarDayView.className = "btn btn-sm btn-primary";
    DOM.btnCalendarDayView.style.background = "var(--primary-grad)";
    DOM.btnCalendarDayView.style.color = "white";
    DOM.btnCalendarWeekView.className = "btn btn-sm btn-outline";
    DOM.btnCalendarWeekView.style.background = "transparent";
    DOM.btnCalendarWeekView.style.color = "var(--text-primary)";
    renderCalendar();
});

DOM.btnCalendarWeekView.addEventListener("click", () => {
    state.calendarViewMode = "week";
    DOM.btnCalendarWeekView.className = "btn btn-sm btn-primary";
    DOM.btnCalendarWeekView.style.background = "var(--primary-grad)";
    DOM.btnCalendarWeekView.style.color = "white";
    DOM.btnCalendarDayView.className = "btn btn-sm btn-outline";
    DOM.btnCalendarDayView.style.background = "transparent";
    DOM.btnCalendarDayView.style.color = "var(--text-primary)";
    renderCalendar();
});

// Modal real-time conflict checker
DOM.bookingVenue.addEventListener("change", checkModalConflicts);
DOM.bookingDate.addEventListener("change", checkModalConflicts);
DOM.bookingStart.addEventListener("change", checkModalConflicts);
DOM.bookingEnd.addEventListener("change", checkModalConflicts);

// Navigation clicks mapping
DOM.navItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        DOM.navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");
        renderView(item.dataset.view);
    });
});

// Login Modal events
DOM.loginForm.addEventListener("submit", submitLogin);
DOM.closeLoginBtn.addEventListener("click", closeLoginModal);

// Admin Venue events
if (DOM.btnAddVenue) {
    DOM.btnAddVenue.addEventListener("click", openAddVenueModal);
}
if (DOM.closeAddVenueBtn) {
    DOM.closeAddVenueBtn.addEventListener("click", closeAddVenueModal);
}
if (DOM.cancelAddVenueBtn) {
    DOM.cancelAddVenueBtn.addEventListener("click", closeAddVenueModal);
}
if (DOM.addVenueForm) {
    DOM.addVenueForm.addEventListener("submit", submitAddVenue);
}

// Create quick action click
DOM.newBookingBtn.addEventListener("click", () => {
    // Open modal with first venue
    openBookingModal(state.venues[0].id);
});

// Notification bell click dropdown toggle
DOM.notiBellBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    DOM.notiDropdown.classList.toggle("active");
});
document.addEventListener("click", () => {
    DOM.notiDropdown.classList.remove("active");
});
DOM.notiDropdown.addEventListener("click", (e) => e.stopPropagation());

DOM.clearNotiBtn.addEventListener("click", () => {
    state.notifications = [];
    saveNotifications();
    renderNotificationsUI();
});

// --- DATASET SYNCHRONIZATION LOGIC ---
let syncState = {
    parsedData: [],
    headers: [],
    columnMapping: {},
    uploadedFileName: null,
    inputMethod: "paste" // "paste" or "file"
};

function initSyncEvents() {
    const btnPaste = document.getElementById("btn-input-paste");
    const btnFile = document.getElementById("btn-input-file");
    const pasteContainer = document.getElementById("paste-input-container");
    const fileContainer = document.getElementById("file-input-container");
    
    if (btnPaste && btnFile) {
        btnPaste.addEventListener("click", () => {
            syncState.inputMethod = "paste";
            btnPaste.className = "btn btn-sm btn-primary";
            btnFile.className = "btn btn-sm btn-outline";
            pasteContainer.style.display = "block";
            fileContainer.style.display = "none";
        });
        
        btnFile.addEventListener("click", () => {
            syncState.inputMethod = "file";
            btnFile.className = "btn btn-sm btn-primary";
            btnPaste.className = "btn btn-sm btn-outline";
            fileContainer.style.display = "block";
            pasteContainer.style.display = "none";
        });
    }

    const dropZone = document.getElementById("sync-drop-zone");
    const fileInput = document.getElementById("sync-file-input");
    const fileNameDiv = document.getElementById("sync-file-name");

    if (dropZone && fileInput) {
        dropZone.addEventListener("click", () => fileInput.click());
        
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("dragover");
        });
        
        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("dragover");
        });
        
        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("dragover");
            if (e.dataTransfer.files.length > 0) {
                handleSyncFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener("change", () => {
            if (fileInput.files.length > 0) {
                handleSyncFile(fileInput.files[0]);
            }
        });
    }

    function handleSyncFile(file) {
        syncState.uploadedFileName = file.name;
        if (fileNameDiv) {
            fileNameDiv.textContent = `Selected File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            fileNameDiv.style.display = "block";
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const rawTextarea = document.getElementById("sync-raw-text");
            if (rawTextarea) rawTextarea.value = e.target.result;
            
            // Auto detect format from extension
            const ext = file.name.split('.').pop().toLowerCase();
            const formatSelect = document.getElementById("sync-format-select");
            if (formatSelect) {
                if (ext === "json") formatSelect.value = "json";
                else if (ext === "tsv") formatSelect.value = "tsv";
                else if (ext === "csv") formatSelect.value = "csv";
            }
        };
        reader.readAsText(file);
    }

    const btnParse = document.getElementById("btn-parse-data");
    if (btnParse) {
        btnParse.addEventListener("click", processParsedData);
    }
}

function parseCSVLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

function renderSyncView() {
    // If not admin, do nothing
    if (state.currentRole !== "admin") return;
    
    // Clear/Reset mapping output if empty
    if (syncState.parsedData.length === 0) {
        const previewBody = document.getElementById("sync-preview-body");
        if (previewBody) {
            previewBody.innerHTML = `
                <div class="sync-empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <p>Please enter or upload data and click "Parse & Review Data" to map and preview.</p>
                </div>
            `;
        }
    }
}

function processParsedData() {
    const rawTextarea = document.getElementById("sync-raw-text");
    const rawText = rawTextarea ? rawTextarea.value.trim() : "";
    if (!rawText) {
        showToast("Sync Error", "Please paste data or upload a file first.", "danger");
        return;
    }

    let format = document.getElementById("sync-format-select").value;
    const hasHeaders = document.getElementById("sync-has-headers").checked;

    if (format === "auto") {
        if (rawText.startsWith("[") || rawText.startsWith("{")) {
            format = "json";
        } else if (rawText.includes("\t")) {
            format = "tsv";
        } else {
            format = "csv";
        }
    }

    let rows = [];
    let headers = [];

    try {
        if (format === "json") {
            const parsed = JSON.parse(rawText);
            const dataArray = Array.isArray(parsed) ? parsed : [parsed];
            if (dataArray.length === 0) throw new Error("Empty JSON array");
            
            // Extract headers from keys of the first item
            headers = Object.keys(dataArray[0]);
            
            // Convert to matching matrix rows
            rows = dataArray.map(item => headers.map(h => item[h] !== undefined ? String(item[h]) : ''));
        } else {
            const delimiter = format === "tsv" ? "\t" : ",";
            const lines = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
            if (lines.length === 0) throw new Error("No text data rows found");

            if (hasHeaders) {
                headers = parseCSVLine(lines[0], delimiter);
                rows = lines.slice(1).map(line => parseCSVLine(line, delimiter));
            } else {
                const sampleCols = parseCSVLine(lines[0], delimiter).length;
                headers = Array.from({ length: sampleCols }, (_, i) => `Column ${i + 1}`);
                rows = lines.map(line => parseCSVLine(line, delimiter));
            }
        }

        syncState.parsedData = rows;
        syncState.headers = headers;
        
        renderMappingAndPreview();
        showToast("Data Parsed", `Found ${rows.length} rows and ${headers.length} columns.`, "success");
    } catch (err) {
        showToast("Parse Failure", `Failed to parse data: ${err.message}`, "danger");
        console.error(err);
    }
}

function renderMappingAndPreview() {
    const previewBody = document.getElementById("sync-preview-body");
    if (!previewBody) return;

    // Define target schema fields
    const schemaFields = [
        { key: "venueName", label: "Venue Name / ID *", desc: "Venue name (e.g. Seminar Hall 1)", required: true },
        { key: "teacherName", label: "Teacher / Requester *", desc: "Teacher name (e.g. Dr. Rajesh Sharma)", required: true },
        { key: "date", label: "Date *", desc: "YYYY-MM-DD", required: true },
        { key: "startTime", label: "Start Time *", desc: "HH:MM", required: true },
        { key: "endTime", label: "End Time *", desc: "HH:MM", required: true },
        { key: "purpose", label: "Purpose / Class", desc: "Purpose (e.g. CS-101 Lecture)", required: false },
        { key: "capacity", label: "Venue Capacity", desc: "Optional capacity (e.g. 100)", required: false }
    ];

    // Try to auto-guess mapping by header names
    const guessMapping = {};
    schemaFields.forEach(field => {
        guessMapping[field.key] = -1; // default: not mapped
        const searchTerms = {
            venueName: ["venue", "room", "class", "hall", "location", "space"],
            teacherName: ["teacher", "prof", "fac", "requester", "name", "instructor"],
            date: ["date", "day", "when"],
            startTime: ["start", "from", "time"],
            endTime: ["end", "to"],
            purpose: ["purpose", "event", "class", "subject", "course", "title", "activity"],
            capacity: ["cap", "seats", "size"]
        }[field.key];

        for (let i = 0; i < syncState.headers.length; i++) {
            const h = syncState.headers[i].toLowerCase();
            if (searchTerms.some(term => h.includes(term))) {
                guessMapping[field.key] = i;
                break;
            }
        }
    });

    // Generate mapping selectors HTML
    let mappingHTML = `
        <div class="mapping-grid">
    `;

    schemaFields.forEach(field => {
        mappingHTML += `
            <div class="mapping-item">
                <label for="map-${field.key}">${field.label}</label>
                <select id="map-${field.key}" class="form-input sync-map-select" style="padding: 0.35rem 0.5rem; font-size: 0.78rem;">
                    <option value="-1">-- Not Mapped --</option>
                    ${syncState.headers.map((h, idx) => `
                        <option value="${idx}" ${guessMapping[field.key] === idx ? 'selected' : ''}>${h}</option>
                    `).join('')}
                </select>
            </div>
        `;
    });

    mappingHTML += `</div>`;

    // Preview area container
    previewBody.innerHTML = `
        <div class="mapping-section" style="text-align: left;">
            <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Map Dataset Columns</h4>
            <p class="text-secondary" style="font-size: 0.78rem; margin-bottom: 0.75rem;">Link columns from your pasted table/file to the JUIT database fields.</p>
            ${mappingHTML}
        </div>

        <div id="sync-preview-table-container">
            <!-- Dynamic Preview Table will be injected here -->
        </div>
    `;

    // Bind event listeners on mapping change to update preview in real-time
    const mapSelects = previewBody.querySelectorAll(".sync-map-select");
    mapSelects.forEach(select => {
        select.addEventListener("change", updateSyncPreviewTable);
    });

    // Run initial preview rendering
    updateSyncPreviewTable();
}

function updateSyncPreviewTable() {
    const container = document.getElementById("sync-preview-table-container");
    if (!container) return;

    // Get current mapping selections
    const mapping = {
        venueName: parseInt(document.getElementById("map-venueName").value),
        teacherName: parseInt(document.getElementById("map-teacherName").value),
        date: parseInt(document.getElementById("map-date").value),
        startTime: parseInt(document.getElementById("map-startTime").value),
        endTime: parseInt(document.getElementById("map-endTime").value),
        purpose: parseInt(document.getElementById("map-purpose").value),
        capacity: parseInt(document.getElementById("map-capacity").value)
    };

    // Check if required fields are mapped
    const missingRequired = [];
    if (mapping.venueName === -1) missingRequired.push("Venue Name / ID");
    if (mapping.teacherName === -1) missingRequired.push("Teacher / Requester");
    if (mapping.date === -1) missingRequired.push("Date");
    if (mapping.startTime === -1) missingRequired.push("Start Time");
    if (mapping.endTime === -1) missingRequired.push("End Time");

    if (missingRequired.length > 0) {
        container.innerHTML = `
            <div class="sync-empty-state" style="height: 200px;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p style="font-size: 0.85rem;">Please map all required columns: <strong>${missingRequired.join(', ')}</strong></p>
            </div>
        `;
        return;
    }

    // Process rows and build metrics
    let newVenuesCount = 0;
    let validBookingsCount = 0;
    let conflictsCount = 0;
    let warningsCount = 0;

    const validatedRows = [];
    // Keep track of timeslots assigned during *this* parse batch to flag internal double-bookings
    const internalScheduleTracker = {};

    syncState.parsedData.forEach((row, rowIdx) => {
        const venueNameVal = row[mapping.venueName];
        const teacherNameVal = row[mapping.teacherName];
        const dateVal = row[mapping.date] ? row[mapping.date].trim() : "";
        const startTimeVal = row[mapping.startTime] ? row[mapping.startTime].trim() : "";
        const endTimeVal = row[mapping.endTime] ? row[mapping.endTime].trim() : "";
        const purposeVal = mapping.purpose !== -1 ? row[mapping.purpose] : "Class Lecture";
        const capacityVal = mapping.capacity !== -1 && row[mapping.capacity] ? parseInt(row[mapping.capacity]) : 60;

        const rowResult = {
            index: rowIdx + 1,
            venueName: venueNameVal,
            teacherName: teacherNameVal,
            date: dateVal,
            time: `${startTimeVal} - ${endTimeVal}`,
            purpose: purposeVal,
            statusBadge: "",
            statusClass: "",
            warningText: "",
            isValid: true,
            venueId: "",
            capacity: capacityVal
        };

        // Validate basic cells
        if (!venueNameVal || !teacherNameVal || !dateVal || !startTimeVal || !endTimeVal) {
            rowResult.isValid = false;
            rowResult.statusBadge = "Invalid Data";
            rowResult.statusClass = "rejected";
            rowResult.warningText = "Missing required cell value.";
            warningsCount++;
            validatedRows.push(rowResult);
            return;
        }

        // Venue ID computation
        const venueIdVal = venueNameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
        rowResult.venueId = venueIdVal;

        // Check if venue exists
        const venueExists = state.venues.some(v => v.id === venueIdVal || v.name.toLowerCase() === venueNameVal.toLowerCase());
        let venueStatusLabel = "";
        if (!venueExists) {
            newVenuesCount++;
            venueStatusLabel = " [New Venue]";
        }

        // Date validation: YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateVal)) {
            rowResult.isValid = false;
            rowResult.statusBadge = "Invalid Date";
            rowResult.statusClass = "rejected";
            rowResult.warningText = "Date must be in YYYY-MM-DD format (e.g. 2026-08-01).";
            warningsCount++;
            validatedRows.push(rowResult);
            return;
        }

        // Time format check (HH:MM)
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(startTimeVal) || !timeRegex.test(endTimeVal)) {
            rowResult.isValid = false;
            rowResult.statusBadge = "Invalid Time";
            rowResult.statusClass = "rejected";
            rowResult.warningText = "Time must be in HH:MM format (e.g. 09:00).";
            warningsCount++;
            validatedRows.push(rowResult);
            return;
        }

        const startH = parseInt(startTimeVal.split(":")[0]);
        const endH = parseInt(endTimeVal.split(":")[0]);
        if (startH >= endH) {
            rowResult.isValid = false;
            rowResult.statusBadge = "Time Conflict";
            rowResult.statusClass = "rejected";
            rowResult.warningText = "Start time must be before end time.";
            warningsCount++;
            validatedRows.push(rowResult);
            return;
        }

        // Check conflicts against standard database
        const conflict = checkBookingConflicts(venueIdVal, dateVal, startTimeVal, endTimeVal);
        
        // Check conflicts inside current batch list (prevent double booking of teachers/venues in same sheet)
        let internalConflict = false;
        const startHour = parseInt(startTimeVal.split(":")[0]);
        const endHour = parseInt(endTimeVal.split(":")[0]);
        for (let h = startHour; h < endHour; h++) {
            const key = `${venueIdVal}|${dateVal}|${h}`;
            if (internalScheduleTracker[key]) {
                internalConflict = true;
                break;
            }
        }

        if (conflict) {
            rowResult.isValid = false;
            rowResult.statusClass = "rejected";
            conflictsCount++;
            if (conflict.type === "timetable") {
                rowResult.statusBadge = "Class Conflict";
                rowResult.warningText = `Overlaps with blocked slot: "${conflict.className}"`;
            } else {
                rowResult.statusBadge = "Booking Overlap";
                rowResult.warningText = `Overlaps with approved booking by ${conflict.booking.requesterName} ("${conflict.booking.purpose}")`;
            }
        } else if (internalConflict) {
            rowResult.isValid = false;
            rowResult.statusClass = "rejected";
            rowResult.statusBadge = "Sheet Duplicate";
            rowResult.warningText = `Time conflict detected with another row in this spreadsheet upload.`;
            conflictsCount++;
        } else {
            // Success! Save slot in batch tracker to prevent duplicates later in sheet loop
            for (let h = startHour; h < endHour; h++) {
                const key = `${venueIdVal}|${dateVal}|${h}`;
                internalScheduleTracker[key] = true;
            }
            
            rowResult.statusClass = "success";
            rowResult.statusBadge = venueExists ? "Ready" : "Ready [New Venue]";
            validBookingsCount++;
        }

        validatedRows.push(rowResult);
    });

    // Render Preview Table & Action Controls
    const importMode = document.getElementById("sync-mode-select").value;

    let previewTableHTML = `
        <div class="preview-summary-bar" style="margin-top: 1rem; text-align: left;">
            <div class="preview-summary-stats">
                <div class="preview-stat-item">
                    <span class="preview-stat-dot total"></span>
                    <span>Total Rows: <strong>${validatedRows.length}</strong></span>
                </div>
                <div class="preview-stat-item">
                    <span class="preview-stat-dot new-venue"></span>
                    <span>New Venues: <strong>${newVenuesCount}</strong></span>
                </div>
                <div class="preview-stat-item">
                    <span class="preview-stat-dot booking"></span>
                    <span>Valid Imports: <strong>${validBookingsCount}</strong></span>
                </div>
                ${conflictsCount > 0 ? `
                <div class="preview-stat-item">
                    <span class="preview-stat-dot conflict"></span>
                    <span class="text-danger">Conflicts: <strong>${conflictsCount}</strong></span>
                </div>` : ''}
                ${warningsCount > 0 ? `
                <div class="preview-stat-item">
                    <span class="preview-stat-dot warning"></span>
                    <span class="text-warning">Errors: <strong>${warningsCount}</strong></span>
                </div>` : ''}
            </div>
            <div>
                <span class="status-badge ${importMode === 'overwrite' ? 'rejected' : 'pending'}" style="font-size:0.75rem; text-transform:uppercase;">${importMode} Mode</span>
            </div>
        </div>

        <div class="sync-table-container">
            <table class="data-table" style="font-size: 0.8rem;">
                <thead>
                    <tr>
                        <th style="width: 50px;">Row</th>
                        <th>Status</th>
                        <th>Venue</th>
                        <th>Teacher / Requester</th>
                        <th>Date & Time</th>
                        <th>Purpose / Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    ${validatedRows.slice(0, 30).map(r => `
                        <tr>
                            <td>${r.index}</td>
                            <td><span class="status-badge ${r.statusClass}" style="font-size:0.7rem; padding:0.15rem 0.35rem;">${r.statusBadge}</span></td>
                            <td><strong>${r.venueName}</strong></td>
                            <td>${r.teacherName}</td>
                            <td>${r.date} <br><span class="text-muted" style="font-size:0.72rem;">${r.time}</span></td>
                            <td class="${r.isValid ? '' : 'text-danger'}">${r.isValid ? r.purpose : `⚠️ ${r.warningText}`}</td>
                        </tr>
                    `).join('')}
                    ${validatedRows.length > 30 ? `
                        <tr>
                            <td colspan="6" style="text-align: center; color: var(--text-muted); font-style: italic; padding: 0.75rem;">
                                ... showing first 30 of ${validatedRows.length} rows ...
                            </td>
                        </tr>
                    ` : ''}
                </tbody>
            </table>
        </div>

        <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; justify-content: flex-end;">
            <button class="btn btn-secondary" id="btn-cancel-sync">Clear Data</button>
            <button class="btn btn-success" id="btn-execute-sync" ${validBookingsCount === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                Confirm & Sync ${validBookingsCount} Bookings
            </button>
        </div>
    `;

    container.innerHTML = previewTableHTML;

    // Bind action buttons
    document.getElementById("btn-cancel-sync").addEventListener("click", () => {
        syncState.parsedData = [];
        syncState.headers = [];
        syncState.columnMapping = {};
        syncState.uploadedFileName = null;
        const textElement = document.getElementById("sync-raw-text");
        if (textElement) textElement.value = "";
        const fileInput = document.getElementById("sync-file-input");
        if (fileInput) fileInput.value = "";
        const fileNameDiv = document.getElementById("sync-file-name");
        if (fileNameDiv) fileNameDiv.style.display = "none";
        renderSyncView();
    });

    document.getElementById("btn-execute-sync").addEventListener("click", () => {
        executeSync(validatedRows.filter(r => r.isValid));
    });
}

async function executeSync(validRows) {
    const importMode = document.getElementById("sync-mode-select").value;
    
    showToast("Starting Synchronization...", `Creating venues and importing booking records...`, "pending");
    
    try {
        // 1. Create missing venues
        const newVenues = [];
        for (let row of validRows) {
            const venueExists = state.venues.some(v => v.id === row.venueId);
            const alreadyStaged = newVenues.some(v => v.id === row.venueId);
            if (!venueExists && !alreadyStaged) {
                const newVenue = {
                    id: row.venueId,
                    name: row.venueName,
                    capacity: row.capacity || 60,
                    type: (row.capacity || 60) <= 30 ? "Small" : ((row.capacity || 60) > 150 ? "Large" : "Medium"),
                    facilities: ["ac", "projector"],
                    facilitiesLabels: ["Auto Sync Created", "Air Conditioning", "Projector Screen"],
                    description: `Automatically created via dataset synchronization on ${new Date().toLocaleDateString()}`,
                    approver: "estate",
                    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 17v-2a3 3 0 0 1 6 0v2"/></svg>`
                };
                newVenues.push(newVenue);
            }
        }

        // Push new venues to server one by one
        let venuesCreated = 0;
        for (let v of newVenues) {
            const res = await fetch('/api/venues', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(v)
            });
            if (res.ok) {
                venuesCreated++;
            } else {
                console.error("Failed to save venue:", v.name);
            }
        }

        // Re-fetch venues so we have them loaded
        await fetchVenues();

        // 2. Prepare bookings to upload
        const newBookings = validRows.map(row => {
            const times = row.time.split(" - ");
            return {
                id: "B-" + Math.floor(Math.random() * 900000 + 100000),
                venueId: row.venueId,
                date: row.date,
                startTime: times[0],
                endTime: times[1],
                requesterName: row.teacherName,
                requesterRole: "Faculty Member",
                purpose: row.purpose,
                expectedAttendees: row.capacity || 60,
                status: "approved",
                approverComments: "Imported via Dataset Sync",
                isRecurring: false,
                recurrenceParent: null,
                checkedIn: false
            };
        });

        // Save Bookings
        let syncSuccess = false;
        if (importMode === "overwrite") {
            // Replace all: PUT request to /api/bookings
            const res = await fetch('/api/bookings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBookings)
            });
            syncSuccess = res.ok;
        } else {
            // Append: POST list of bookings
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBookings)
            });
            syncSuccess = res.ok;
        }

        if (syncSuccess) {
            showToast("Sync Successful!", `Synchronized: ${venuesCreated} new venues and ${newBookings.length} bookings.`, "success");
            
            // Clear sync state
            syncState.parsedData = [];
            syncState.headers = [];
            syncState.columnMapping = {};
            syncState.uploadedFileName = null;
            const textElement = document.getElementById("sync-raw-text");
            if (textElement) textElement.value = "";
            const fileInput = document.getElementById("sync-file-input");
            if (fileInput) fileInput.value = "";
            const fileNameDiv = document.getElementById("sync-file-name");
            if (fileNameDiv) fileNameDiv.style.display = "none";
            
            // Reload and navigate to calendar
            await fetchVenues();
            await fetchBookings();
            
            const calendarNav = document.querySelector(`.nav-item[data-view="calendar"]`);
            if (calendarNav) {
                calendarNav.click();
            }
        } else {
            throw new Error("Server rejected booking database updates.");
        }
    } catch (err) {
        showToast("Sync Failed", `Failed to complete synchronization: ${err.message}`, "danger");
        console.error(err);
    }
}

// Core Startup Initialization
async function init() {
    await initializeState();
    updateClockUI();
    renderNotificationsUI();
    updateRoleViews();
    initSyncEvents();
    
    // Default load catalogue
    renderView("catalogue");
}

window.onload = init;
