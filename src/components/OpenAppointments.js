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
    completeButton: {
        fontSize: '12px',
    },
}));

// Table for appointments that have been accepted and have not been completed
function OpenAppointments({ classes, appointmentsData, handleCompleteDialogOpen }) {
    const openAppointmentsClasses = useStyles();
    const numTableCols = 5;

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
    const createTableRows = (appointmentsData) => {

        // No appointments, show message
        if (appointmentsData.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={numTableCols}>
                        You have no open appointments at this time
                    </TableCell>
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
            // const date = moment(dateAndTimeString).format('h:mma MM/DD/YY');
            
            // Format 
            return (
                <TableRow key={appointmentId}>
                    <TableCell>{ fromFirstName } { fromLastName }</TableCell>
                    <TableCell>{ dateAndTimeString }</TableCell>
                    <TableCell>{ subject }</TableCell>
                    <TableCell>{ reason }</TableCell>
                    <TableCell>
                        <Button
                            classes={{ root: `${ classes.primaryButton } ${ openAppointmentsClasses.completeButton }` }}
                            onClick={() => handleCompleteDialogOpen(appointmentId)}
                        >
                            Complete
                        </Button>
                    </TableCell>
                </TableRow>
            );
        });
    };

    // Appointments data has not loaded yet
    if (!appointmentsData) {
        return <CircularProgress size={40} />;
    };

    // Create pending appointment table rows
    const tableRows = createTableRows(appointmentsData);

    return (
        <TableContainer component={Paper}>
            <Table>

                {/* Table header */}
                <TableHead className='tableHeader'>
                    <TableRow>
                        <TableCell>Referred by</TableCell>
                        <TableCell>Appointment Datetime</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Complete</TableCell>
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
                            count={appointmentsData.length}
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
