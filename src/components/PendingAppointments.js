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
        handlePendingAppointmentUpdate,
    } = props;
    const pendingAppointmentClasses = useStyles();

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
                <TableCell>
                    <Button
                        classes={{ root: `${ classes.primaryButton } ${ pendingAppointmentClasses.acceptButton }` }}
                        onClick={() => handlePendingAppointmentUpdate(id, 'accept')}
                    >
                        Accept
                    </Button>
                </TableCell>
                <TableCell>
                    <Button
                        classes={{ root: pendingAppointmentClasses.rejectButton }}
                        onClick={() => handlePendingAppointmentUpdate(id, 'reject')}
                    >
                        Reject
                    </Button>
                </TableCell>
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
                            colSpan={6}
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

export default PendingAppointments;
