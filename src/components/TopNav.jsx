import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

const TopNav = ({ currentPage }) => {
  const router = useRouter();
  return (
    <AppBar position="static" sx={{
      // background: 'linear-gradient(to bottom, #FF9900, rgba(255, 165, 0, 0))',
      bgcolor:'#FF9900',
    }}>
      <Toolbar>
        <Typography fontSize={16} fontWeight={400} color={'black'} sx={{ flexGrow: 1 }}>
          Stryt Vannie Georgie
        </Typography>
            <Button
              variant="contained"
              href={router.pathname === '/' ? '/music-videos' : '/'}
              sx={{color:'black', bgcolor: '#FFD600',}}
            >
              {router.pathname === '/' ? 'Music Videos' : 'Home'}
            </Button>
         
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
