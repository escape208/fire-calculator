import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';

function AddEditQuarterlyData(props) {

    const { register, handleSubmit, setValue } = useForm();

    const symbol = useParams().symbol;

    const isAddMode = !symbol;

    const [alert, setAlert] = useState({ visible: false, status: '', message: '' });

    useEffect(() => {
        setAlert({ visible: false, status: '', message: '' });
        const fields = ['releaseDate', 'notes'];

        if (!isAddMode) {

            axios.get(`${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}/stock/${symbol}`)
                .then(response => {
                    fields.forEach(field => setValue(field, response.data[field]));
                })
                .catch(e => {
                    setAlert(
                        {
                            visible: true,
                            message: `Error retrieving Category: ${e.response.data}`,
                            status: "error",
                        });
                });
        } else {
            fields.forEach(field => setValue(field, ""));
        }
    }, [symbol]);

    const formOptions = {
        releaseDate: { required: "Release Date is required" }
    };

    function onSubmit(data) {
        return isAddMode
            ? addQuarterlyData(data)
            : updateQuarterlyData(symbol, data);

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({ ...alert, visible: false });
    };

    function addQuarterlyData(data) {

        setAlert({ ...alert, visible: false });

        console.log("New Quarterly Data - Sending data:");
        console.log(data);

        axios.post(`${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}/quarterlydata`, data)
            .then(() => {
                console.log(`Quarterly data added successfully`);
                setAlert(
                    {
                        visible: true,
                        message: `New quarterly update added for ${data.symbol}!`,
                        status: "success",
                    })
            })
            .catch(e => {
                setAlert(
                    {
                        visible: true,
                        message: `Error adding quarterly data: ${e}`,
                        status: "error",
                    })
            });
    }

    function updateQuarterlyData(symbol, data) {

        setAlert({ ...alert, visible: false });
        data.symbol = symbol;

        axios.put(`${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}/categories/`, data)
            .then(() => {
                console.log(`Category ${symbol} updated successfully`);
                setAlert(
                    {
                        visible: true,
                        message: `Category '${symbol}' updated successfully!`,
                        status: "success",
                    })

                props.setRefreshTable(props.refreshTable + 1);

            })
            .catch(e => {
                console.log(`Error updating category: ${e}`);
                setAlert(
                    {
                        visible: true,
                        message: `Error updating Category: ${e}`,
                        status: "error",
                    })
            })

        console.log({ data });

    }

    function handleAlerts() {
        if (alert.visible) {
            return (
                <Snackbar open={alert.visible} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} variant="filled" severity={alert.status} sx={{ width: '100%' }}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            );
        }
    }

    return (
        <>
            <Grid item sx={{ minWidth: 500 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Typography variant="h5" component="div" color="primary">
                        {isAddMode ? 'Add new quarterly data' : 'Edit quarterly data'}
                    </Typography>

                    <InputLabel id="release-date-label">Release Date</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                            components={['DatePicker']}
                        >
                            <DemoItem>
                                <DatePicker defaultValue={dayjs()} />
                            </DemoItem>
                        </DemoContainer>
                    </LocalizationProvider>
                    <InputLabel id="notes-label">Notes</InputLabel>
                    <TextField
                        id="notes"
                        labelid="notes-label"
                        multiline
                        minRows={5}
                        variant="outlined"
                        fullWidth
                    /><br /><br />
                    <Button variant="contained" type="submit">Submit</Button>
                    {handleAlerts()}
                </form>
            </Grid>
        </>
    );
}

export default AddEditQuarterlyData;