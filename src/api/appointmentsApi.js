// Fetch all appointments for user: open, pending
const fetchAppointments = async ({ userEmail, token }) => {
    try {
        const url = `/referexpert/myappointments/${userEmail}`;
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` }});
        if (response.status !== 200) throw new Error('Failed to fetch appointments data');
        return await response.json();
    } catch (err) {
        throw err;
    };
};

// Update the pending appointment status to accept or reject
const updatePendingAppointment = async ({ action, appointmentId, token }) => {
    try {
        // Url changes depending on accept or reject
        let url;
        if (action === 'accept') {
            url = 'referexpert/acceptappointment';
        } else if (action === 'reject') {
            url = 'referexpert/rejectappointment';
        } else {
            throw 'Invalid option for parameter "action", must be either: accept or reject';
        };

        // Send api request
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ appointmentId })
        });
        const results = await response.json();

        // Validate successful response
        const successMessage = 'Updated Successfully';
        if (!('message' in results)) throw results;
        if (results.message !== successMessage) throw results.message;
    } catch (err) {
        throw err;
    };
};

// Update an appointment to completed status
const completeAppointment = async ({ appointmentId, token }) => {
    try {
        const url = `referexpert/finalizeappointment`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appointmentId })
        });
        const results = await response.json();
        
        // Ensure message in response. catch erros elsewise
        const successMessage = 'Updated Successfully';
        if (!('message' in results)) throw results;
        if (results.message !== successMessage) throw results.message; 
    } catch (err) {
        throw err;
    };
};

export {
    fetchAppointments,
    updatePendingAppointment,
    completeAppointment
}