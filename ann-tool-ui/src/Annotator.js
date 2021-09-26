import './Annotator.css'
import Content from './Content';
import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import BlockIcon from '@material-ui/icons/Block';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { makeStyles } from '@material-ui/core/styles';
import {CurrentFileContext} from './App'
import { useLocation } from "react-router";

const useStyles = makeStyles((theme) => ({
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

export default function Annotator(props) {
    const classes = useStyles();
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [arr, setArr] = React.useState([]);
    const [nextArr, setNextArr] = React.useState([]);
    const [prevArr, setPrevArr] = React.useState([]);
    const [currentFileIndex, setCurrentFileIndex] = React.useContext(CurrentFileContext);
    const tags = ['NAME', 'SKILL', 'EMAILID', 'PHONENUMBER'];
    const [selectedTag, setSelectedTag] = React.useState(tags[0]);
    const location = useLocation();
    
    async function fetchArr(folder, file, setArr) {
        let response = await fetch(`http://localhost:8080/${folder}/${file}`)
        let data = await response.json();
        setArr(data['ner']);
        setIsLoaded(true);
        console.log(data)
        return data['ner'];
      }

    React.useEffect(() => {
        let link = location.pathname.replace('/workspace/', '')
        let [ folder, file ] = link.split('/')
        fetchArr(folder, file, setArr);
    }, [location])

    function isActive(value) {
        return 'btn btn-outline-light span-pad ' + ((value === selectedTag) ? 'active' : 'default');
    }

    function setTagActive(event) {
        if (event.target.textContent !== "") {
            setSelectedTag(event.target.textContent)
        }
    }

    function getSelectedTag() {
        return selectedTag
    }

    function getTags() {
        return tags.map((x) => {
            return (
                <label className={isActive(x)} onClickCapture={setTagActive}>
                    <input type="radio" name="tags" className="tag" hidden="" />
                    {x}
                </label>);
        })
    }


    return (
        <div className={props.className}>
            <div className="title-wrapper row">
                <div className="col-md-8 mx-1 my-2">
                    <div className="row">
                        <div>
                            {getTags()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row content">
                <div className="col-md-auto">
                    <Content getSelectedTag={getSelectedTag} isLoaded={isLoaded} setArr={setArr}>{arr}</Content>
                </div>
            </div>
            <div className="arrowicons">
                <IconButton classes={{ 'root': classes.arrowStyles }} color="inherit"
                    onClick={() => {
                        if (currentFileIndex > 0) {
                            setArr([]);
                            props.navigateToFile(props.getFolder(), props.tree[props.getFolder()][currentFileIndex - 1]);
                            setCurrentFileIndex(currentFileIndex => currentFileIndex - 1);
                        }
                    }}><ArrowBackIcon /></IconButton>
                <IconButton classes={{ 'root': classes.arrowStyles }} color="inherit"
                    onClick={() => {
                        if (currentFileIndex < props.tree[props.getFolder()].length - 1) {
                            setArr([]);
                            props.navigateToFile(props.getFolder(), props.tree[props.getFolder()][currentFileIndex + 1]);
                            setCurrentFileIndex(currentFileIndex => currentFileIndex + 1);
                        }
                    }}><ArrowForwardIcon /></IconButton>
                <IconButton classes={{ 'root': classes.arrowStyles }} color="inherit" ><CheckIcon /></IconButton>
                <IconButton classes={{ 'root': classes.arrowStyles }} color="inherit" ><BlockIcon /></IconButton>
                <IconButton classes={{ 'root': classes.arrowStyles }} color="inherit" ><CloseIcon /></IconButton>
            </div>
        </div>);
}