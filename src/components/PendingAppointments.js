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
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    acceptButton: {
        fontSize: '12px',
    },
    rejectButton: {
        color: '#ffffff',
        backgroundColor: '#ff6961',
        fontSize: '12px',
        '&:hover': {
            backgroundColor: '#ff5148',
        }
    },
}));

function PendingAppointments(props) {
    const {
        classes,
        appointmentsData,
        handlePendingDialogOpen,
    } = props;
    const pendingAppointmentClasses = useStyles();
    const numTableCols = 6;

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

    // Create table rows
    const createTableRows = (appointmentsData) => {

        // No appointments, show no appointments message
        if (appointmentsData.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={numTableCols}>You have no pending appointments at this time</TableCell>
                </TableRow>
            );
        };

        return appointmentsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment) => {
            const {
                appointmentId,
                appointmentFrom,
                appointmentTo,
                dateAndTimeString,
                fromFirstName,
                fromLastName,
                subject,
                reason,
                isAccepted,
                isServed
            } = appointment;
            // const date = moment(dateAndTimeString).format('MM/DD/YY h:mma');

            // Format 
            return (
                <TableRow key={appointmentId}>
                    <TableCell>{ fromFirstName } { fromLastName }</TableCell>
                    <TableCell>{ dateAndTimeString }</TableCell>
                    <TableCell>{ subject }</TableCell>
                    <TableCell>{ reason }</TableCell>
                    <TableCell>
                        <Button
                            classes={{ root: `${ classes.primaryButton } ${ pendingAppointmentClasses.acceptButton }` }}
                            onClick={() => handlePendingDialogOpen(appointmentId, 'accept')}
                        >
                            Accept
                        </Button>
                    </TableCell>
                    <TableCell>
                        <Button
                            classes={{ root: pendingAppointmentClasses.rejectButton }}
                            onClick={() => handlePendingDialogOpen(appointmentId, 'reject')}
                        >
                            Reject
                        </Button>
                    </TableCell>
                </TableRow>
            );
        });
    };

    // Create table rows based on state of data received
    let tableRows;
    if (!appointmentsData) {
        tableRows = (
            <TableRow key={0}>
                <TableCell colSpan={numTableCols} >
                    <CircularProgress size={40} />
                </TableCell>
            </TableRow>
        );
        
    } else if (appointmentsData === 'error') {
        tableRows = (
            <TableRow key={0}>
                <TableCell colSpan={numTableCols} >
                    <div className='noResults errorMessage'>Sorry, this request failed. Please try again later.</div>
                </TableCell>
            </TableRow>
        );
    } else {
        tableRows = createTableRows(appointmentsData);
    };

    return (
        <TableContainer component={Paper}>
            <Table>

                {/* Table header */}
                <TableHead className='tableHeader'>
                    <TableRow>
                        <TableCell>Referred by</TableCell>
                        <TableCell>Appointment Time</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell colSpan={2}>Accept/Reject</TableCell>
                    </TableRow>
                </TableHead>

                {/* Table body */}
                <TableBody>{ tableRows }</TableBody>

                {/* Table footer */}
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            colSpan={numTableCols}
                            count={appointmentsData && Array.isArray(appointmentsData) ? appointmentsData.length : 0}
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

export default PendingAppointments;
