import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Annotator from './Annotator';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { alpha, styled } from '@material-ui/core/styles';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, useParams, useRouteMatch, useHistory } from "react-router-dom";
import { SimpleSelect, FileSystemNavigator } from './NavBar'
import Login from './Login'
import AutoComplete from './AutoComplete';
import Button from '@material-ui/core/Button';
import BlockIcon from '@material-ui/icons/Block';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Upload, Download } from './Upload';
const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    typo: {
        variant: "h5",
        align: "center"
    },
    lsitem: {
        padding: "0px",
        align: "center",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",


    },
    alignItemsFlexStart: {
        alignItems: 'center',
    },
    search: {
        align: "center",
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    arrowStyles: {
        color: 'white',
        backgroundColor: '#583fcf',
        marginRight: '5px',
        '&:hover': {
            backgroundColor: 'white',
            color: '#583fcf',
            border: '1px',
            borderColor: '#583fcf'
        }
    }
}));

export const MyTypography = styled(ListItem)({
    fontSize: "20px",
    fontWeight: "700"
});

export const CurrentFileContext = React.createContext({
    state: '',
    setState: () => { }
})

function ResponsiveDrawer(props) {

    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [currentFileIndex, setCurrentFileIndex] = React.useContext(CurrentFileContext);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [folder, setFolder] = React.useState(useParams()[0]);
    const [tree, setTree] = React.useState([]);
    const [isTreeLoad, setIsTreeLoad] = React.useState(false);
    const history = useHistory();

    const fetchAndSetTree = async function (folder, file) {
        let response = await fetch('http://localhost:8080/folderTree');
        let data = await response.json();
        setTree(data);
        setIsTreeLoad(true);
        setCurrentFileIndex(data[folder].findIndex((x) => x===file))
    }


    const navigateToFile = function (folder, file, i) {
        history.push(`/workspace/${folder}/${file}`);
        setFolder(folder);
        if(i !== undefined){
            setCurrentFileIndex(i);
        }
    }

    const getFolder = function () {
        return folder
    }

    React.useEffect(() => {
        let splits = history.location.pathname.split('/')
        setFolder(splits[2]);
        fetchAndSetTree(splits[2], splits[3]);
    }, [history])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const getTreeItems = function () {
        let arr = []
        for (let i in tree) {
            arr.push(tree[i].map((x, j) => [i, x, j]))
        }
        return arr.flat()
    }

    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <List>
                <ListItem selected="true" classes={{ root: classes.lsitem }} disableGutters="true">
                    <MyTypography align="center" gutterBottom="true" classes={{ root: classes.lsitem }}>Annotator</MyTypography>
                </ListItem>
                <SimpleSelect />
                <Divider />
                <FileSystemNavigator tree={tree} setTree={fetchAndSetTree} navigateToFile={navigateToFile} />
                <Divider />
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;
    let { path } = useRouteMatch();


    if (!isTreeLoad) {
        return (<div>Not Loaded</div>)
    }
    else {
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant="h6" noWrap>
                            {folder}
                        </Typography>
                        <AutoComplete options={getTreeItems()} navigateToFile={navigateToFile} />
                        <Upload folder={folder} setTree={fetchAndSetTree} />
                        <Download folder={folder} />
                        <Button color="inherit">Log Out</Button>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <Switch>
                        <Route path={`${path}/:folder/:file`}>
                            <div className={classes.toolbar} />
                            <Annotator navigateToFile={navigateToFile} tree={tree} getFolder={getFolder} />
                        </Route>
                    </Switch>
                </main>
            </div >
        );
    }

}

// export default ResponsiveDrawer;
export default function App() {
    const [file, setFile] = React.useState('test');
    return (
        <CurrentFileContext.Provider value={[file, setFile]}>
            <div>
                <Router>
                    <Switch>
                        <Route path='/login'>
                            <Login />
                        </Route>
                        <Route path='/workspace'>
                            <ResponsiveDrawer />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </CurrentFileContext.Provider>);
}