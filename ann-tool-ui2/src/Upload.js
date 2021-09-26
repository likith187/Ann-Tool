import React from 'react'
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import axios from 'axios';
import { Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CheckIcon from '@material-ui/icons/Check';
import PropTypes from 'prop-types';
import GetAppIcon from '@material-ui/icons/GetApp';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import './Upload.css'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    label: {
        colot: "white"
    },
    progroot: {
        bottom: "0",
        right: "0",
        display: "inline-block",
        position: "fixed",
        width: "200px",
        padding: "10px",
        backgroundColor: "white",
        flexGrow: 1,
    },
    progress: {
        display: "flex",
    },
    uploadText: {
        padding: "10px"
    }
}));

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);


export function Upload(props) {
    const [uploading, setUploading] = React.useState(false);
    const [uploadCount, setUploadCount] = React.useState(0);
    const [totalCount, setTotalCount] = React.useState(1);
    const classes = useStyles();

    return <div>
        <input
            accept=".txt"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => {
                if (e.target["files"].length > 0) {
                    setUploading(true)
                    setTotalCount(e.target["files"].length)
                    for (let file of e.target["files"]) {
                        let formData = new FormData();
                        formData.append("file", file);
                        formData.append("folder", props.folder);
                        axios.post('http://localhost:8080/fileUpload', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then(
                                setUploadCount(uploadCount => uploadCount + 1)
                            )
                    }
                    props.setTree();
                }
            }}
        />
        <label htmlFor="contained-button-file">
            <Button color="primary" style={{ color: '#FFFFFF' }} startIcon={<PublishIcon />} component="span">
                Upload
            </Button>
        </label>
        {uploading ?
            <div className={classes.progroot}>
                <div className={classes.progress}>
                    {uploadCount === totalCount ? <CheckIcon color="Primary" className="svg_icons" />
                        : <CircularProgress variant="indeterminate" />
                    }
                    <Typography color="textPrimary" classes={{ root: classes.uploadText }}>{uploadCount === totalCount ? "Uploaded" : "Uploading..."}</Typography>
                </div>
                <Typography align="right" color="textPrimary" display="block" variant="p">{uploadCount}/{totalCount}</Typography>
                <BorderLinearProgress variant="determinate" value={100 * (uploadCount / totalCount)} />
            </div>
            : null}
    </div>
}


function DownloadDialog(props) {
    const { onClose, selectedValue, open } = props;
    const [value, setValue] = React.useState('female');
    const handleChange = (event) => {
        setValue(event.target.value);
    };
    const handleClose = () => {
        onClose(selectedValue);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Download</DialogTitle>
            <DialogContent>
            <FormControl component="fieldset">
            <FormLabel component="legend">Folder</FormLabel>
            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                <FormControlLabel value="workspace" control={<Radio />} label="workspace" />
                <FormControlLabel value="current folder" control={<Radio />} label="current folder" />
                <FormControlLabel value="select folder" control={<Radio />} label="select folder" />
            </RadioGroup>
            </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
        </Dialog>
    );
}

DownloadDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export function Download() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };

    return (
        <div>
            <Button color="inherit" startIcon={<GetAppIcon />} onClick={handleClickOpen}>download</Button>
            <DownloadDialog open={open} onClose={handleClose} />
        </div>
    );
}

export default Upload;