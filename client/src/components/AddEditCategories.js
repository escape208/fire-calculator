import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { Card, CardActions, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';

function AddEditCategories(props) {

    const { register, handleSubmit, setValue } = useForm();

    const id = useParams().id;

    const isAddMode = !id;

    const [alert, setAlert] = useState({ visible: false, status: '', message: '' });

    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        setAlert({ visible: false, status: '', message: '' });

        if (!isAddMode) {
            // get npid and set form fields

            axios.get(`${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}/categories/${id}`)
                .then(response => {
                    const fields = ['name', 'description'];
                    fields.forEach(field => setValue(field, response.data[field]));
                    setEnabled(response.data.enabled.toString())
                })
                .catch(e => {

                    setAlert(
                        {
                            visible: true,
                            message: `Error retrieving Category: ${e.response.data}`,
                            status: "error",
                        })


                })
        } else {
            const fields = ['name', 'description'];
            fields.forEach(field => setValue(field, ""));
        }
    }, [id]);

    const handleEnabledChange = (event) => {
        setEnabled(event.target.value);
    };

    const formOptions = {
        name: { required: "Name is required" },
        description: { required: "Description is required" },
        enabled: { required: "Enabled is required" }
    };

    function onSubmit(data) {
        return isAddMode
            ? addCategory(data)
            : updateCategory(id, data);

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({ ...alert, visible: false });
    };

    function addCategory(data) {

        setAlert({ ...alert, visible: false });

        data.enabled = enabled;

        console.log("New Category - Sending data:");
        console.log(data);

        axios.post(`${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}/categories`, data)
            .then(() => {
                console.log(`${data.name} added successfully`);
                setAlert(
                    {
                        visible: true,
                        message: `New Category '${data.name}' added successfully!`,
                        status: "success",
                    })
                props.setRefreshTable(props.refreshTable + 1);
            })
            .catch(e => {
                if (e.response.status === 409) {
                    setAlert(
                        {
                            visible: true,
                            message: `A category with name '${data.name}' already exists.`,
                            status: "error",
                        })
                } else {
                    setAlert(
                        {
                            visible: true,
                            message: `Error adding category: ${e}`,
                            status: "error",
                        })
                }

            })
    }

    function updateCategory(id, data) {

        setAlert({ ...alert, visible: false });
        data.id = id;
        data.enabled = enabled;

        axios.put(`${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}/categories/`, data)
            .then(() => {
                console.log(`Category ${id} updated successfully`);
                setAlert(
                    {
                        visible: true,
                        message: `Category '${id}' updated successfully!`,
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
            <Grid container spacing={2} rowSpacing={2} justifyContent="center">
                <Grid item>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card variant="outlined" sx={{ maxWidth: 600, minWidth: 400, borderColor: 'primary.main' }} >
                            <CardContent>
                                <Typography variant="h5" component="div" color="primary">
                                    {isAddMode ? 'Add a New Category' : 'Edit an Existing Category'}
                                </Typography>

                                <InputLabel id="category-name-label">Name</InputLabel>
                                <TextField
                                    required
                                    id="Name"
                                    labelid="category-name-label"
                                    variant="outlined"
                                    {...register('name', formOptions.Name)}
                                />
                                <InputLabel id="description-label">Description</InputLabel>
                                <TextField
                                    required
                                    id="Description"
                                    labelid="description-label"
                                    multiline
                                    minRows={5}
                                    variant="outlined"
                                    fullWidth
                                    {...register('description', formOptions.Description)}
                                /><br /><br />
                                <InputLabel id="status-label">Enabled</InputLabel>
                                <FormControl fullWidth>
                                    <RadioGroup
                                        required
                                        row
                                        aria-labelledby="enabled-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        id="Enabled"
                                        value={enabled}
                                        onChange={handleEnabledChange}
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="True" />
                                        <FormControlLabel value="false" control={<Radio />} label="False" />
                                    </RadioGroup>
                                </FormControl>

                            </CardContent>
                            <CardActions>
                                <Button variant="contained" type="submit">Submit</Button>
                            </CardActions>

                            {handleAlerts()}

                        </Card>
                    </form>
                </Grid>
            </Grid>
        </>
    );
}

export default AddEditCategories;