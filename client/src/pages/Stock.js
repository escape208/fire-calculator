import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Typography from '@mui/material/Typography';
import AddEditQuarterlyData from "../components/AddEditQuarterlyData";

const Stock = () => {
    const symbol = useParams().symbol;

    if (symbol) {
        document.title = symbol + " - Details";
    }

    const [alert, setAlert] = useState({ visible: false, status: 'info', message: '' });

    const [data, setData] = useState({ symbol: "QQQQ", name: "Stock Name", description: "Company Description", sector: "Company Sector", last_price: 0.00, last_price_retrieved: "" });

    useEffect(() => {
        var uri = `http://localhost:8000/stock/${symbol}`;

        axios.get(uri)
            .then(response => {
                console.log("Response");
                console.log(response.data);

                setData(response.data);
            })
            .catch(e => {
                console.log(`Error retrieving stock: ${e}`);
                setAlert(
                    {
                        visible: true,
                        message: `Error retrieving stock: ${e}`,
                        status: "error",
                    })
            });

    }, [symbol]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: "150px" }}>
                    <Typography color="primary" variant="h3" sx={{ flex: 1 }}>{data.symbol}</Typography>
                    <Typography color="text.secondary" sx={{ flex: 1 }} gutterBottom>
                        {data.name}
                    </Typography>
                    <Typography color="text.secondary" variant="caption" component="div" gutterBottom>
                        {data.description}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: "150px" }}>
                    <Typography color="primary" variant="h3" sx={{ flex: 1 }}>
                        ${data.last_price}
                    </Typography>
                    <Typography color="text.secondary" variant="caption" component="div" gutterBottom>
                        As of {data.last_price_retrieved}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={8}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: "150px" }}>
                    <AddEditQuarterlyData />
                </Paper>
            </Grid>
        </Grid>
    );

};

export default Stock;