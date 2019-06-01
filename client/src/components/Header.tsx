import React from 'react';
import { Link } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles/';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ListIcon from '@material-ui/icons/List';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {lightBlue, blueGrey} from '@material-ui/core/colors/';

import '../App.css';


const theme = createMuiTheme({
      // Theme Colors
      palette: {
        primary: lightBlue,
        secondary: blueGrey,
      },
});
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
      list: {
        width: 250,
      },
      fullList: {
        width: 'auto',
      },
  }),

);

function TemporaryDrawer() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false
    });

    const toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
      ) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
    
        setState({ ...state, left : open });
    };

    const sideList = () => (
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
    
          <div>
            <Link to='/' style={{ textDecoration: 'none', color: 'black'}}><MenuItem><InboxIcon/>Deposit</MenuItem></Link>
            <Link to='/history' style={{ textDecoration: 'none', color: 'black'}}><MenuItem><ListIcon/>History</MenuItem></Link>
          </div> 
        </div>
    );

    return(
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} onClick={toggleDrawer(true)} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <div className="title">
                    <Typography variant="h6" className={classes.title}>
                    ETH BANK
                    </Typography>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer open={state.left} onClose={toggleDrawer(false)}>
                {sideList()}
            </Drawer>
        </div>
      </MuiThemeProvider>

    );
    
}

export default TemporaryDrawer;

