import { useState } from 'react';

// Time parsing
import * as moment from 'moment';

// Material UI
import {
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    Paper,
} from '@material-ui/core';

// Table for appointments that have been accepted and have not been completed
function OpenAppointments({ classes, appointmentsData }) {

    // Pagination states
    const [page, updatePage] = useState(0);
    const [rowsPerPage, updateRowsPerPage] = useState(10);

    // Change pagination page
    const handleChangePage = (event, newPage) => {
        updatePage(newPage);
    };
    
    // Change pagaination count amount
    const handleChangeRowsPerPage = (event) => {
        updateRowsPerPage(parseInt(event.target.value, 10));
        updatePage(0);
    };

    // Create pending appointment table rows
    const tableRows = appointmentsData.map((appointment) => {
        const { id, patient, appointmentTimestamp, referredBy, status } = appointment;
        const date = moment(appointmentTimestamp).format('MM/DD/YYYY');
        const time = moment(appointmentTimestamp).format('h:mm a');
        
        // Format 
        return (
            <TableRow key={patient}>
                <TableCell>{ patient }</TableCell>
                <TableCell>{ referredBy }</TableCell>
                <TableCell>{ date }</TableCell>
                <TableCell>{ time }</TableCell>
            </TableRow>
        );
    });

    return (
        <TableContainer component={Paper}>
            <Table>

                {/* Table header */}
                <TableHead>
                    <TableRow>
                        <TableCell>Patient</TableCell>
                        <TableCell>Referred by</TableCell>
                        <TableCell>Appointment Date</TableCell>
                        <TableCell>Appointment Time</TableCell>
                    </TableRow>
                </TableHead>

                {/* Table body */}
                <TableBody>{ tableRows }</TableBody>

                {/* Table footer */}
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            colSpan={4}
                            count={tableRows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default OpenAppointments;
