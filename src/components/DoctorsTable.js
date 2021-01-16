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

    // Decide whether to show search for results, no results, or actual table rows
    let tableRows;
    if (!doctorsData) {

        // It's in an array so that counts of pagination doesn't raise error
        tableRows = [
            <TableRow key={0}>
                <TableCell colSpan={5}>
                    <span className='noResults'>Search for results</span>
                </TableCell>
            </TableRow>
        ];
    } else if (doctorsData.length === 0) {
        tableRows = [
            <TableRow key={0}>
                <TableCell colSpan={5} >
                    <div className='noResults'>No results to display</div>
                </TableCell>
            </TableRow>
        ];
    } else {

        // Create table rows with doctors data
        tableRows = doctorsData.map((doctor) => {
            const { id, name, type, city, zipcode } = doctor;
    
            // Format 
            return (
                <TableRow key={id}>
                    <TableCell>{ name }</TableCell>
                    <TableCell>{ type }</TableCell>
                    <TableCell>{ city }</TableCell>
                    <TableCell>{ zipcode }</TableCell>
                    <TableCell>
                        <Button
                            classes={{ root: `${ classes.primaryButton } ${ referpatientpageClasses.scheduleButton }` }}
                            onClick={() => handleOpenScheduleDialog(name, type, city, zipcode)}
                        >
                            Schedule
                        </Button>
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (        
        <TableContainer component={Paper}>
            <Table>

                {/* Table header */}
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>Zipcode</TableCell>
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
                            <TableCell colSpan={5}>
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
                            colSpan={5}
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