import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Nav = () => {

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              FIRE Calculator
            </Typography>
            <Button color="inherit" href="/">Home</Button>
            <Button color="inherit" href="/Stocks">Stocks</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Nav;