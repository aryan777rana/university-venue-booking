import re

with open("app.js", "r", encoding="utf-8") as f:
    content = f.read()

# We need to completely rewrite the section from window.openApprovalModal = ... to the end of DOM.btnRejectRequest.addEventListener

# Let's find the start
start_marker = "// --- APPROVER ACTIONS MODAL WORKFLOW ---"
if start_marker not in content:
    print("Could not find start marker")
    exit(1)

# Find where it actually starts
start_idx = content.find(start_marker)

# Let's find the end of the reject listener
# It ends with:
#         updatePendingBadgeCount();
#         renderView("approvals");
#     }
# });
# 
# DOM.btnModifyRequest.addEventListener("click", () => {
end_marker = "DOM.btnModifyRequest.addEventListener"
end_idx = content.find(end_marker, start_idx)

if end_idx == -1:
    print("Could not find end marker")
    exit(1)

# Ensure new booking logic is restored right before the start marker!
new_booking_restore = """
    closeBookingModal();
    updatePendingBadgeCount();
    
    // Redirect view to bookings list
    const bookingsNav = document.querySelector(`.nav-item[data-view="bookings"]`);
    if (bookingsNav) bookingsNav.click();
});

// --- APPROVER ACTIONS MODAL WORKFLOW ---
"""

# Let's clean up whatever mess is before the start marker that got mangled.
# We will just replace everything from the end of closeBookingModal to btnModifyRequest.

# Find "closeBookingModal();" right before start_idx
close_booking_idx = content.rfind("closeBookingModal();", 0, start_idx)

new_content = content[:close_booking_idx + len("closeBookingModal();")] + "\n" + new_booking_restore + """
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

\n""" + content[end_idx:]

with open("app.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Repair completed.")
