import { checkForBadResponse } from '../utils/apiHelpers';

// Fetch pending availability responses for the user
const fetchAvailabilityResponses = async ({ userEmail, token }) => {
    try {
        const url = `referexpert/myavailabilityresponses/${userEmail}`;
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` }});
        
        // Catch a failed response
        checkForBadResponse({ status: response.status, functionName: 'fetchAvailabilityResponses' });

        // Filter out results that have already been responded to
        // This prevents the user from responding to the same request twice
        const results = await response.json();
        return results.filter((item) => item.isAccepted !== 'Y');
    } catch (err) {
        throw err;
    };
};

// Fetch availability requests made by user
const fetchPendingAvailabilityRequests = async ({ userEmail, token }) => {
    try {
        const url = `referexpert/myavailabilityrequests/${userEmail}`;
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` }});
        
        // Catch a failed response
        checkForBadResponse({ status: response.status, functionName: 'fetchPendingAvailabilityRequests' });

        // Filter out any requests where user has completed the appointment request
        // This prevents the user from requesting the same appointment twice
        const results = await response.json();
        return results.filter((item) => item.isServed === '');
    } catch (err) {
        throw err;
    };
};

// Fetch referrals user had made
const fetchReferrals = async ({ userEmail, token }) => {
    try {
        const url = `referexpert/myreferrals/${userEmail}`;
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` }});
        
        // Catch a failed response
        checkForBadResponse({ status: response.status, functionName: 'fetchReferrals' });

        // Update referrals state
        return await response.json();
    } catch (err) {
        throw err;
    };
};

// Submit a availability response from doctor B to doctor A
const submitAvailabilityResponse = async ({ appointmentId, dateAndTimeString, token }) => {
    try {
        const url = 'referexpert/availabilityresponse';
        const body = { appointmentId, dateAndTimeString };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // Catch a failed response
        checkForBadResponse({ status: response.status, functionName: 'submitAvailabilityResponse' });

        return await response.json();
    } catch (err) {
        throw err;
    };
};

// Schedule appointment via api request
const submitAppointment = async ({
    appointmentFrom,
    appointmentTo,
    dateAndTimeString,
    subject,
    reason,
    patientName,
    patientEmail,
    patientPhone,
    token
}) => {
    try {
        const url = 'referexpert/requestappointment';
        const body = {
            appointmentFrom,
            appointmentTo,
            dateAndTimeString,
            subject,
            reason,
            patientName,
            patientEmail,
            patientPhone,
            token
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // Catch a failed response
        checkForBadResponse({ status: response.status, functionName: 'submitAppointment' });

        // Validate appointment was scheduled sucessfully
        const results = await response.json();
        const successResponseText = 'Appointment Request Successful';
        if (!('message' in results)) throw results;
        if (results.message !== successResponseText) throw results.message;
    } catch (err) {
        throw err;
    };
};

// Finalize availability response api
const submitFinalizeAvailabilityResponse = async ({ appointmentId, token }) => {
    try {
        const url = 'referexpert/finalizeavailability';
        const body = { appointmentId };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // Catch a failed response
        checkForBadResponse({ status: response.status, functionName: 'submitFinalizeAvailabilityResponse' });

        // Validate availability response was finalized sucessfully
        const results = await response.json();
        const successResponseText = 'Updated Successfully';
        if (!('message' in results)) throw results;
        if (results.message !== successResponseText) throw results.message;
    } catch (err) {
        throw err;
    };
};

// Reject availability response api
const submitRejectAvailabilityResponse = async ({ appointmentId, token }) => {
    try {
        const url = 'referexpert/rejectavailability';
        const body = { appointmentId };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // Catch a failed response
        checkForBadResponse({ status: response.status, functionName: 'submitRejectAvailabilityResponse' });

        // Validate availability response was rejected sucessfully
        const results = await response.json();
        const successResponseText = 'Updated Successfully';
        if (!('message' in results)) throw results;
        if (results.message !== successResponseText) throw results.message;
    } catch (err) {
        throw err;
    };
};

export {
    fetchAvailabilityResponses,
    fetchPendingAvailabilityRequests,
    fetchReferrals,
    submitAvailabilityResponse,
    submitAppointment,
    submitFinalizeAvailabilityResponse,
    submitRejectAvailabilityResponse
};