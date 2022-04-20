import { useState } from 'react';

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
import moment from 'moment';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    actionButton: {
        fontSize: '11px',
    },
}));

// Validates that the availabilityType is a valid option for determining which table to show
const validateAvailabilityType = (availabilityType) => {
    const validTypes = ['request', 'response'];
    if (!validTypes.includes(availabilityType)) {
        throw new Error('Invalid option for "availabilityType" must be either: request or response');
    };
};

function AvailabilityTable ({
    classes,
    availabilityData,
    availabilityType,
    handleOpenAvailabilityResponseDialog,
    handleOpenConfirmResponseDialog
}) {
    const availabilityTableClasses = useStyles();

    // Validate that availability type is a suitable option
    validateAvailabilityType(availabilityType);
    const numTableCols = availabilityType === 'request' ? 5 : 4;

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

    // Convert appointment status values to words. ex: Y -> Accepted
    const convertAcceptedSymbol = (symbol) => {
        switch (symbol) {
            case 'Y':
                return 'Accepted';
            case 'N':
                return 'Rejected';
            case 'P':
                return 'Pending';
            default:
                throw 'Invalid option for symbol parameter';
        };
    };

    // Create referrals table rows
    const createTableRows = (referralsData) => {
        return referralsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((referral) => {
            const {
                appointmentId,
                appointmentFrom,
                appointmentTo,
                dateAndTimeString,
                fromFirstName,
                fromLastName,
                toFirstName,
                toLastName,
                subject,
                reason,
                isAccepted,
                isServed,
                patientName
            } = referral;

            // Determine what row type to create and then generate the row
            let tableRow;
            if (availabilityType === 'request') {
                let availabilityResponseDateTimes;
                if (dateAndTimeString === "") {
                    availabilityResponseDateTimes = 'N/A';
                } else {
                    availabilityResponseDateTimes = dateAndTimeString.split(',').map((dateTime) => moment(dateTime).format('MM/DD/YY hh:mm A'));
                    availabilityResponseDateTimes = availabilityResponseDateTimes.join(', ');
                };

                tableRow = (
                    <TableRow key={appointmentId}>
                        <TableCell>{ toFirstName } { toLastName }</TableCell>
                        <TableCell>{ reason }</TableCell>
                        <TableCell>{ subject }</TableCell>
                        <TableCell>{ availabilityResponseDateTimes }</TableCell>
                        <TableCell>
                            {
                                isAccepted === 'Y'
                                ? <Button
                                    classes={{ root: `${ classes.primaryButton } ${ availabilityTableClasses.actionButton }` }}
                                    onClick={() => handleOpenConfirmResponseDialog(appointmentId, appointmentTo, appointmentFrom, `${toFirstName} ${toLastName}`, subject, reason, dateAndTimeString)}
                                >Schedule</Button>
                                : convertAcceptedSymbol(isAccepted)
                            }
                        </TableCell>
                    </TableRow>
                );
            } else {
                // This is the response row
                tableRow = (
                    <TableRow key={appointmentId}>
                        <TableCell>{ fromFirstName } { fromLastName }</TableCell>
                        <TableCell>{ reason }</TableCell>
                        <TableCell>{ subject }</TableCell>
                        <TableCell>
                        <Button
                            classes={{ root: `${ classes.primaryButton } ${ availabilityTableClasses.actionButton }` }}
                            onClick={() => handleOpenAvailabilityResponseDialog(appointmentId, `${fromFirstName} ${fromLastName}`, patientName, subject, reason)}
                        >
                            Respond
                        </Button>
                    </TableCell>
                    </TableRow>
                );
            };

            // Format 
            return tableRow;
        });
    };

    // Row with loading spinner
    const loadingRow = (
        <TableRow>
            <TableCell colSpan={numTableCols} className='noResults' style={{ textAlign: 'center' }}>
                <CircularProgress size={30} />
            </TableCell>
        </TableRow>
    );

    // No search results row
    let noResults;
    if (availabilityType === 'request') {
        noResults = (
            <TableRow>
                <TableCell colSpan={numTableCols}>You have not made any availability requests yet</TableCell>
            </TableRow>
        );
    } else {
        noResults = (
            <TableRow>
                <TableCell colSpan={numTableCols}>You have no pending availability responses</TableCell>
            </TableRow>
        );
    };

    // Error row
    const errorRow = (
        <TableRow key={0}>
            <TableCell colSpan={numTableCols} >
                <div className='noResults errorMessage'>Sorry, this request failed. Please try again later.</div>
            </TableCell>
        </TableRow>
    );

    // Decide what table header to use based on availability type
    // We do this so we don't have to have two separate tables
    let tableHeader;
    if (availabilityType === 'request') {
        tableHeader = (
            <TableHead className='tableHeader'>
                <TableRow>
                    <TableCell>To</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Requested appointment time(s)</TableCell>
                    <TableCell>Response</TableCell>
                    <TableCell>Status</TableCell>
                </TableRow>
            </TableHead>
        );
    } else {
        // Reponse header
        tableHeader = (
            <TableHead className='tableHeader'>
                <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Requested appointment time(s)</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
        );
    }

    // Decided what rows to populate table with
    let tableRows;
    if (!availabilityData) {
        tableRows = loadingRow;
    } else if (availabilityData === 'error') {
        tableRows = errorRow;
    } else if (availabilityData.length === 0) {
        tableRows = noResults;
    } else {
        tableRows = createTableRows(availabilityData);
    };

    return (
        <TableContainer component={Paper}>
            <Table>

                {/* Table header */}
                { tableHeader }

                {/* Table body */}
                <TableBody>{ tableRows }</TableBody>

                {/* Table footer */}
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            colSpan={numTableCols}
                            count={availabilityData ? availabilityData.length : 0}
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

export default AvailabilityTable;