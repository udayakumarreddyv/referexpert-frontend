// Fetch pending availability responses for the user
exports.fetchAvailabilityResponses = async ({ userEmail, token, updateState }) => {
    try {
        const url = `referexpert/myavailabilityresponses/${userEmail}`;
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` }});
        const results = await response.json();
        
        // Filter out results that have already been responded to
        // This prevents the user from responding to the same request twice
        const filteredResults = results.filter((item) => item.isAccepted !== 'Y');
        updateState(filteredResults);
    } catch (err) {
        throw err;
    };
};

// Fetch availability requests made by user
exports.fetchPendingAvailabilityRequests = async ({ userEmail, token, updateState }) => {
    try {
        const url = `referexpert/myavailabilityrequests/${userEmail}`;
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` }});
        const results = await response.json();
        
        // Filter out any requests where user has completed the appointment request
        // This prevents the user from requesting the same appointment twice
        const filteredResults = results.filter((item) => item.isServed === '');
        updateState(filteredResults);
    } catch (err) {
        throw err;
    };
};

// Fetch referrals user had made
exports.fetchReferrals = async ({ userEmail, token, updateState }) => {
    try {
        const url = `referexpert/myreferrals/${userEmail}`;
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` }});
        const results = await response.json();
        
        // Update referrals state
        updateState(results);
    } catch (err) {
        throw err;
    };
};

// Submit a availability response from doctor B to doctor A
exports.submitAvailabilityResponse = async ({ appointmentId, dateAndTimeString, token }) => {
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
        return await response.json();
    } catch (err) {
        throw err;
    };
};

// Schedule appointment via api request
exports.submitAppointment = async ({ appointmentFrom, appointmentTo, dateAndTimeString, subject, reason, token }) => {
    try {
        const url = 'referexpert/requestappointment';
        const body = { appointmentFrom, appointmentTo, dateAndTimeString, subject, reason };
        console.log(body)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const results = await response.json();

        // Validate appointment was scheduled sucessfully
        const successResponseText = 'Appointment Request Successful';
        if (!('message' in results)) throw results;
        if (results.message !== successResponseText) throw results.message;
    } catch (err) {
        throw err;
    };
};

// Finalize availability response api
exports.submitFinalizeAvailabilityResponse = async ({ appointmentId, token }) => {
    try {
        const url = 'referexpert/finalizeavailability';
        const body = { appointmentId };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const results = await response.json();

        // Validate availability response was finalized sucessfully
        const successResponseText = 'Updated Successfully';
        if (!('message' in results)) throw results;
        if (results.message !== successResponseText) throw results.message;
    } catch (err) {
        throw err;
    };
};

// Reject availability response api
exports.submitRejectAvailabilityResponse = async ({ appointmentId, token }) => {
    try {
        const url = 'referexpert/rejectavailability';
        const body = { appointmentId };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const results = await response.json();

        // Validate availability response was rejected sucessfully
        const successResponseText = 'Updated Successfully';
        if (!('message' in results)) throw results;
        if (results.message !== successResponseText) throw results.message;
    } catch (err) {
        throw err;
    };
};