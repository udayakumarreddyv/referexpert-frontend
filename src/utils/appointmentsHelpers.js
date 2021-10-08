// Sort appointments by date newest to furthest\
// This is only to be used in this file so no export
const sortAppointments = (appointmentsList) => {
    const moment = require('moment');
    return appointmentsList.sort((first, second) => {
        return moment(second.dateAndTimeString) - moment(first.dateAndTimeString);
    });
};

// Separate open, pending, and closed appointments
exports.separateAppointments = (appointmentsList) => {
    let pendingList = [];
    let openList = [];
    let completedList = [];

    // Loop through each appointment in list, separate into buckets
    appointmentsList.forEach((appointment) => {

        // Pending appointment, open appointment, completed appointment
        if (appointment.isAccepted === 'P') {
            pendingList.push(appointment);
        } else if (appointment.isAccepted === 'Y' && appointment.isServed === 'N') {
            openList.push(appointment);
        } else if (appointment.isServed === 'Y') {
            completedList.push(appointment);
        } else {
            console.log(`Rejected appointment: ${appointment.appointmentId}`);
        };
    });

    // Sort appointments by dates
    pendingList = sortAppointments(pendingList);
    openList = sortAppointments(openList);
    completedList = sortAppointments(completedList);

    return { pendingList, openList, completedList };
};