import { useState } from 'react';

// Utils
import * as moment from 'moment';

// Material UI
import {
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

function Referrals ({ classes, referralsData }) {

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
                subject,
                reason,
                isAccepted,
                isServed
            } = referral;
            const date = moment(dateAndTimeString).format('h:mma MM/DD/YY');
            
            // Format 
            return (
                <TableRow key={appointmentId}>
                    <TableCell>{ fromFirstName } { fromLastName }</TableCell>
                    <TableCell>{ date }</TableCell>
                    <TableCell>{ subject }</TableCell>
                    <TableCell>{ reason }</TableCell>
                    <TableCell>{ convertAcceptedSymbol(isAccepted) }</TableCell>
                    <TableCell>{ isServed }</TableCell>
                </TableRow>
            );
        });
    };

    // Row with loading spinner
    const loadingRow = (
        <TableRow>
            <TableCell colSpan={6} className='noResults' style={{ textAlign: 'center' }}>
                <CircularProgress size={30} />
            </TableCell>
        </TableRow>
    );

    // No search results row
    const noResults = (
        <TableRow>
            <TableCell colSpan={4}>You have not made any referrals yet</TableCell>
        </TableRow>
    );

    // Error row
    const errorRow = (
        <TableRow key={0}>
            <TableCell colSpan={5} >
                <div className='noResults errorMessage'>Sorry, this request failed. Please try again later.</div>
            </TableCell>
        </TableRow>
    );

    // Decided what rows to populate table with
    let tableRows;
    if (!referralsData) {
        tableRows = loadingRow;
    } else if (referralsData === 'error') {
        tableRows = errorRow;
    } else if (referralsData.length === 0) {
        tableRows = noResults;
    } else {
        tableRows = createTableRows(referralsData);
    };

    return (
        <TableContainer component={Paper}>
            <Table>

                {/* Table header */}
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Appointment Datetime</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Completed</TableCell>
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
                            count={referralsData ? referralsData.length : 0}
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

export default Referrals;