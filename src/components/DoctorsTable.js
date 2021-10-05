import { useState } from 'react';

// Material UI
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    Paper,
    CircularProgress,
} from '@material-ui/core';

function DoctorsTable(props) {
    const {
        // Styles
        classes,
        referpatientpageClasses,

        // Data
        doctorsData,
        loading,

        // Open dialog on schedule button click
        handleOpenScheduleDialog,
    } = props;
    const numTableCols = 9;

    // Pagination states
    const [page, updatePage] = useState(0);
    const [rowsPerPage, updateRowsPerPage] = useState(10);

    // Change pagination page
    const handleChangePage = (newPage) => {
        updatePage(newPage);
    };
    
    // Change pagaination count amount
    const handleChangeRowsPerPage = (event) => {
        updateRowsPerPage(parseInt(event.target.value, 10));
        updatePage(0);
    };

    // Create table rows
    const createTableRows = (searchResults) => {
        return doctorsData.map((doctor) => {
            const {
                userId,
                email,
                phone,
                firstName,
                lastName,
                userType,
                userSpeciality,
                insurance,
                service,
                address,
                city,
                state,
                zip,
                distance
            } = doctor;

            // Format 
            return (
                <TableRow key={userId}>
                    <TableCell>{ firstName } { lastName }</TableCell>
                    <TableCell>{ userType }</TableCell>
                    <TableCell>{ userSpeciality }</TableCell>
                    <TableCell>{ service }</TableCell>
                    <TableCell>{ insurance }</TableCell>
                    <TableCell>{ `${address}, ${city} ${state} ${zip}` }</TableCell>
                    <TableCell>{ phone }</TableCell>
                    <TableCell>{ Math.floor(distance) }mi</TableCell>
                    <TableCell>
                        <Button
                            classes={{ root: `${ classes.primaryButton } ${ referpatientpageClasses.scheduleButton }` }}
                            onClick={() => handleOpenScheduleDialog(userId, email, `${firstName} ${lastName}`, userType, userSpeciality, `${address}, ${city} ${state} ${zip}`)}
                        >
                            Check Availability
                        </Button>
                    </TableCell>
                </TableRow>
            );
        });
    };

    // Search for results row
    const searchForResults = (
        <TableRow key={0}>
            <TableCell colSpan={numTableCols}>
                <span className='noResults'>Search for results</span>
            </TableCell>
        </TableRow>
    );

    // No results row
    const noResults = (
        <TableRow key={0}>
            <TableCell colSpan={numTableCols} >
                <div className='noResults'>No results to display</div>
            </TableCell>
        </TableRow>
    );

    // Error row
    const errorResults = (
        <TableRow key={0}>
            <TableCell colSpan={numTableCols} >
                <div className='noResults errorMessage'>Sorry, this request failed. Please try again later.</div>
            </TableCell>
        </TableRow>
    );

    let tableRows;
    if (!doctorsData) {
        tableRows = searchForResults;
    } else if (doctorsData === 'error') {
        tableRows = errorResults;
    } else if (doctorsData.length === 0) {
        tableRows = noResults;
    } else {
        tableRows = createTableRows(doctorsData);
    };

    return (        
        <TableContainer component={Paper}>
            <Table>

                {/* Table header */}
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Speciality</TableCell>
                        <TableCell>Services</TableCell>
                        <TableCell>Insurance</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Distance</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                {/* Table body */}
                <TableBody>

                    {/* Show rows or loading */}
                    {
                        !loading
                        ? tableRows
                        : <TableRow key={0}>
                            <TableCell colSpan={numTableCols}>
                                <CircularProgress size={40} />
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>

                {/* Table footer */}
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            colSpan={numTableCols}
                            count={ doctorsData ? doctorsData.length : 0 }
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

export default DoctorsTable;