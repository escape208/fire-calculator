import React from "react";
import Chart from "../Chart"
import Deposits from '../Deposits';
import Grid from '@mui/material/Grid';
import StocksTable from "../components/StockTable";
import Paper from '@mui/material/Paper';

const HomePage = () => {
    document.title = "FIRE Calculator";
    return (
        <Grid container spacing={3}>
            {/* Stocks Table */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <StocksTable />
                </Paper>
            </Grid>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Chart />
                </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Deposits />
                </Paper>
            </Grid>
        </Grid>
    );

};

export default HomePage;