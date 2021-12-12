import * as React from 'react';
import Box from '@mui/material/Box';
import {Popper as MuiPopper} from '@mui/material';
import Fade from '@mui/material/Fade';

export default function Popper({children, anchorEl}) {
    console.log("setAnchorEl", anchorEl)
  return (
      <>
      <MuiPopper style={{zIndex: 999}} disablePortal={false} open={Boolean(anchorEl)} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={0}>
            <Box sx={{  background: "white"}}>
            {children}
            </Box>
          </Fade>
        )}
      </MuiPopper>
      
      </>
  );
}