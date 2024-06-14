import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ResourceMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Typography variant="h6" sx={{ textTransform: 'none' }}>Resources</Typography>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => window.open("/resources/outcomes")}>Goal Outcomes</MenuItem>
        <MenuItem onClick={() => window.open("/resources/measurements")}>Goal Measuring</MenuItem>
        <MenuItem onClick={() => window.open("/resources/deadlines")}>Goal Deadlines</MenuItem>
        <MenuItem onClick={() => window.open("/resources/achievability")}>Goal Achievability</MenuItem>
      </Menu>
    </Box>
  );
}
