import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from '@mui/x-data-grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Title from '../Title';
import { Box } from '@mui/material';

const StocksTable = (SearchString) => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([{ symbol: "", name: "", sector: "", last_price: 0.00, last_price_retrieved: "" }]);
    const [count, setCount] = useState(0);
    const [tableRefresh, setTableRefresh] = useState(0);
    const [openDeleteDialogue, setOpenDeleteDialogue] = useState({ visible: false, deleteId: 0, stockName: '' });
    const [alert, setAlert] = useState({ visible: false, content: '' });
    const [deleteAlert, setDeleteAlert] = useState({ visible: false, status: "success", content: '' });

    const columns = React.useMemo(() => [
        {
            headerName: 'Symbol',
            field: 'symbol',
            headerClassName: 'table--column--header',
            width: 100
        },
        {
            headerName: 'Name',
            field: 'name',
            headerClassName: 'table--column--header',
            width: 300
        },
        {
            headerName: 'Sector',
            field: 'sector',
            headerClassName: 'table--column--header',
            width: 300
        },
        {
            headerName: 'Last Price',
            field: 'last_price',
            headerClassName: 'table--column--header',
            width: 100
        },
        {
            headerName: 'Price Retreived',
            field: 'last_price_retrieved',
            headerClassName: 'table--column--header',
            width: 140
        }
    ], []
    );

    const handleClose = () => {
        setOpenDeleteDialogue({ ...openDeleteDialogue, visible: false, deleteId: 0, stockName: '' });
    };

    const handleAgree = () => {
        setOpenDeleteDialogue({ ...openDeleteDialogue, visible: false });

        axios.delete(`${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}/stock/${openDeleteDialogue.deleteId}`)
            .then(() => {
                setTableRefresh(tableRefresh => tableRefresh + 1);
                setDeleteAlert({ ...deleteAlert, visible: true, status: "success", content: `Stock ${openDeleteDialogue.deleteId} deleted successfully.` });
            })
            .catch(e => {
                console.log(`Error deleting stock: ${e.response.data}`);
                setDeleteAlert({ ...deleteAlert, visible: true, status: "error", content: `Error deleting Stock ${openDeleteDialogue.deleteId}: ${e.response.data}` });
            });

    };

    const handleDeleteClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setDeleteAlert({ ...alert, visible: false });
    };

    const handleRowClick = (param, event) => {
        console.log("Row:");
        console.log(param);
        window.location.href = "/stock/" + param.id
    };

    useEffect(() => {
        setIsLoading(true);

        var apiURL = `${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}/stock`;

        if (SearchString.data !== undefined) {
            console.log(`Search String: ${SearchString.data}`);
            apiURL = `${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}/stock?search=${SearchString.data}`
        }

        axios.get(apiURL)
            .then(response => {
                setData(response.data);
                setCount(response.data.length);
                setAlert({ ...alert, visible: false, content: '' });
            })
            .catch(e => {
                console.log(`Error fetching data:`);
                console.log(e);

                if (!e.response) {
                    setAlert({ ...alert, visible: true, content: "Unable to connect" });
                }
                else if (e.response.status === 401) {
                    setAlert({ ...alert, visible: true, content: "401 Not Authorized" });
                } else if (e.response.data) {
                    setAlert({ ...alert, visible: true, content: e.response.data });
                } else {
                    setAlert({ ...alert, visible: true, content: "Unknown Error" });
                }

            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [tableRefresh]);

    function showTable() {

        return (
            <>

                <Snackbar openDeleteDialogue={deleteAlert.visible} autoHideDuration={6000} onClose={handleDeleteClose}>
                    <Alert onClose={handleDeleteClose} variant="filled" severity={deleteAlert.status} sx={{ width: '100%' }}>
                        {deleteAlert.content}
                    </Alert>
                </Snackbar>

                <Dialog
                    open={openDeleteDialogue.visible}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Delete Stock?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete stock {openDeleteDialogue.deleteId} ({openDeleteDialogue.npidName})?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAgree} color="primary" variant='contained' autoFocus>
                            Yes
                        </Button>
                        <Button onClick={handleClose} color="secondary" variant='contained'>Cancel</Button>
                    </DialogActions>
                </Dialog>
                {
                    <Title>Stocks</Title>
                }
                {
                    (alert.visible === true) ?
                        <>
                            <Alert severity="error" variant="filled">Unable to load table: {alert.content}</Alert>
                        </>
                        :
                        ''
                }

                {
                    <Box
                        sx={{
                            width: '100%',
                            '& .table--column--header': {
                                // backgroundColor: '#1976d2',
                                color: '#1565c0'
                            },
                        }}
                    >
                        <DataGrid
                            getRowId={(row) => row.symbol}
                            rows={data}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            onRowClick={handleRowClick}
                        />
                    </Box>

                }
                {/* Only if there's not an active error, show the 'No Stocks to Display' message. */}
                {
                    (alert.visible === false && count === 0) ?
                        <>
                            No Stocks to display.
                        </>
                        :
                        ''
                }


            </>

        );

    }

    return (
        <>
            {isLoading ? <LoadingSpinner /> : showTable()}
        </>
    )
};

export default StocksTable;