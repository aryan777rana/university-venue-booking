const bookingData = {
    "id": "B-REC-6001-2",
    "venueId": "conference",
    "date": "2026-07-22",
    "startTime": "08:00",
    "endTime": "09:00",
    "requesterName": "arya@gmail.com",
    "requesterRole": "Student Representative",
    "purpose": "timepass (Recur Week 2)",
    "expectedAttendees": 29,
    "status": "pending",
    "approverComments": "",
    "isRecurring": 1,
    "recurrenceParent": "B-REC-6001",
    "checkedIn": 0
};

const state = {
    bookings: [bookingData],
    venues: [{ id: "conference", name: "Executive Conference Room" }],
    settings: { timetableSynced: false },
    timetable: []
};

function getVenueName(venueId) {
    const venue = state.venues.find(v => v.id === venueId);
    return venue ? venue.name : "Unknown Venue";
}

function getReadableDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString("en-US", options);
}

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

function checkAcademicTimetableConflict(venueId, dateStr, startStr, endStr) {
    const startH = parseInt(startStr.split(":")[0]);
    const endH = parseInt(endStr.split(":")[0]);

    if (state.settings.timetableSynced) {
        const selectedDate = new Date(dateStr);
        const dayOfWeek = selectedDate.getDay();
        const timetableMatches = state.timetable.filter(t => t.venueId === venueId && t.day === dayOfWeek);

        for (const t of timetableMatches) {
            const classStart = parseInt(t.startTime.split(":")[0]);
            const classEnd = parseInt(t.endTime.split(":")[0]);
            
            if (startH < classEnd && classStart < endH) {
                return true; 
            }
        }
    }
    return false;
}

const DOM = {
    reviewId: { textContent: "" },
    reviewRequester: { textContent: "" },
    reviewRequesterRole: { textContent: "" },
    reviewVenue: { textContent: "" },
    reviewTime: { textContent: "" },
    reviewAttendees: { textContent: "" },
    reviewPurpose: { textContent: "" },
    reviewRecurrence: { textContent: "" },
    approvalComment: { value: "" },
    reviewConflictWarning: { style: { display: "" } },
    reviewConflictText: { textContent: "" },
    approvalModal: { classList: { add: (c) => console.log("Added class:", c) } }
};

let activeReviewBookingId = null;

function showToast(title, msg, type) {
    console.log(`TOAST [${type}]: ${title} - ${msg}`);
}

function openApprovalModal(bookingId) {
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
            console.error("Conflict check error:", err);
            DOM.reviewConflictWarning.style.display = "none";
        }

        DOM.approvalModal.classList.add("active");
        console.log("Modal opened successfully without errors!");
    } catch (e) {
        console.error("FATAL ERROR:", e);
        showToast("System Error", "Failed to open approval modal.", "danger");
    }
}

openApprovalModal("B-REC-6001-2");
