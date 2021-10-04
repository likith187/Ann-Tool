import { List, ListItem, makeStyles } from "@material-ui/core";
import { useAutocomplete } from "@material-ui/lab";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { alpha } from '@material-ui/core/styles';
import React from 'react';
import { CurrentFileContext } from './App'

const useStyles = makeStyles((theme) => ({
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
    listbox: {
        width: 300,
        overflowWrap: "anywhere",
        margin: 0,
        padding: 0,
        zIndex: 1,
        position: 'absolute',
        listStyle: 'none',
        backgroundColor: theme.palette.background.paper,
        color: 'black',
        overflow: 'auto',
        maxHeight: 200,
        border: '1px solid rgba(0,0,0,.25)',
        '& li[data-focus="true"]': {
            backgroundColor: '#4a8df6',
            color: 'white',
            cursor: 'pointer',
        },
        '& li:active': {
            backgroundColor: '#2977f5',
            color: 'white',
        },
    },
}
));

export default function AutoComplete(props) {
    let classes = useStyles();
    const [currentFileIndex, setCurrentFileIndex] = React.useContext(CurrentFileContext);
    const {
        getInputProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        inputValue
    } = useAutocomplete({
        id: 'use-autocomplete-demo',
        options: props.options,
        getOptionLabel: (option) => option[1],
    });
    return <div>
        <div className={classes.search}>
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                placeholder="Search…"
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                {...getInputProps()}
            />
        </div>
        {groupedOptions.length > 0 && inputValue.length > 3 ? (
            <List className={classes.listbox} {...getListboxProps()}>
                {groupedOptions.map((option, index) => (
                    <ListItem {...getOptionProps({ option, index })}
                        onClick={() => {
                            setCurrentFileIndex(option[2])
                            props.navigateToFile(option[0], option[1])
                        }}>
                        {option[1]
                        }</ListItem>
                ))}
            </List>
        ) : null}
    </div>
}