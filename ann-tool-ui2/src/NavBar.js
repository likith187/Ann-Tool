import './NavBar.css'
import React, { Component, useState } from 'react'
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { styled } from '@material-ui/core/styles';
import { ListItem, TextField } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { Upload } from './Upload';
import { useHistory } from 'react-router-dom'
import axios from 'axios';

const options = [
    { value: 'ner', label: 'NER' },
    { value: 'realtion', label: 'RELATION-LINKING' },
];

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'black' : 'black',
    }),
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
    formControl: {
        margin: theme.spacing(1),
        width: "90%",
        minWidth: 120,
        alignContent: "center",
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        backgroundColor: 'white',
        color: 'black'
    },
    select: {
        backgroundColor: 'white',
        color: 'black'
    },
    lsitem: {
        paddingRight: "0px",
        paddingTop: "0px",
        paddingBottom: "0px",
        marginRight: "20px",
        fontSize: "14px",
        overflowWrap: "anywhere"
    },
    textfield: {
        width: "50%",
        fontSize: "13px"
    }
}));


export function SimpleSelect() {
    const annotators = [{
        label: 'NER',
        value: 'ner',
    },
    {
        label: 'RELATION LINKER',
        value: 'rel'
    }
    ]
    const [annotator, setAnnotator] = React.useState(annotators[0]);
    const handleChange = (event) => {
        setAnnotator(event);
    };

    return (
        <Select
            value={annotator}
            onChange={handleChange}
            options={options}
            styles={customStyles}
        />
    );
}

export const MyTypography = styled(ListItem)({
    fontSize: "20px",
    fontWeight: "700"
});

let nodeid = 0;
export function MyTreeItem(props) {
    const [hover, setHover] = React.useState(false);
    const history = useHistory();
    const classes = useStyles()
    function getTree(x) {
        return (<TreeItem nodeId={nodeid++} label={x['name']} setTree={props.setTree}
            classes={{ 'label': classes.lsitem }}
        >{
                x['children'].map(y => <TreeItem nodeId={nodeid++} label={y} onClick={() => {
                    history.push(`/workspace/${x['name']}/${y}`)
                }} setTree={props.setTree} classes={{ 'label': classes.lsitem }} />)

            }
        </TreeItem>);
    }
    if (hover) {
        return <div className="fleft" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {getTree(props.children)}
            <Upload path={props.children['name']} setTree={props.setTree}></Upload>
        </div>
    }
    else {
        return <div className="fleft" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {getTree(props.children)}
        </div>
    }

}

export function FileSystemNavigator(props) {
    const classes = useStyles();
    const [folderCreate, setFolderCreate] = useState(false);
    let nodeId = 0;

    function createFolder(folder) {
        let formData = new FormData();
        formData.append("folder", folder);
        axios.post('http://localhost:8080/createFolder', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    function keyPress(e) {
        if (e.keyCode === 13) {
            createFolder(e.target.value)
            e.target.value = ''
            setFolderCreate(false)
            props.setTree()
        }
    }

    function getTreeItems(){
        let arr = []
        for(let i in props.tree){
            arr.push(
                <TreeItem setTree={props.setTree} label={i} nodeId={(nodeId++).toString()} classes={{ 'label': classes.lsitem }}
                    onLabelClick={(e) => {
                        e.preventDefault();
                        props.navigateToFile(i, props.tree[i][0], 0)
                    }
                    }
                >
                    {props.tree[i].map((y, index) => <TreeItem label={y} nodeId={(nodeId++).toString()} classes={{ 'label': classes.lsitem }} onClick={() => {
                        props.navigateToFile(i, y, index);
                    }} />)}
                </TreeItem>
            )
        }
        return arr;
    }

    return (
        <div>
            <ListItem selected="true" classes={{ root: classes.lsitem }} disableGutters="true">
                <MyTypography align="center" gutterBottom="true" classes={{ root: classes.lsitem }}>workspace</MyTypography>
                <CreateIcon onClick={() => setFolderCreate(!folderCreate)} />
            </ListItem>
            <ListItem>
                <TextField onKeyDown={keyPress} hidden={!folderCreate} classes={{ 'root': classes.textfield }} />
            </ListItem>
            <ListItem>
                <TreeView
                    className={classes.root}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                    {
                        getTreeItems()
                    }
                </TreeView>
            </ListItem>
        </div>
    );

}

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.className = props.className
        this.state = {
            selectedOption: options[0],
        };
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

    render() {
        return (
            <div className={this.className}>
                <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
                    <span className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none fs-4">
                        Sidebar
                    </span>
                    <hr />
                    <div className="mb-5">
                        <span className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none fs-5">
                            Annotator
                        </span>
                        <SimpleSelect />
                    </div>
                    <div className="row-m3">
                        <FileSystemNavigator></FileSystemNavigator>
                    </div>
                </div>
            </div>
        );
    }
}