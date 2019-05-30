import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles/';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {lightBlue, blueGrey} from '@material-ui/core/colors/';


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
          <List>
            {['Save Money', 'History'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          
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
                    <Typography variant="h6" className={classes.title}>
                        ETH BANK
                    </Typography>
          
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

