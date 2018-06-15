import React from 'react';

const Player = (props) => {

    console.log("isOpen: "+props.isOpen);

    if(props.isOpen) {
        const h6Style = {
            marginLeft: '300px',
            color: 'red'
        };  
        return (
            <h6 style = {h6Style} onClick = {props.handlePlayerClick}>{props.player}</h6>
        );
    }
    else {
        const h6Style = {
            marginLeft: '300px'
        };
        return (
            <h6 style = {h6Style} onClick = {props.handlePlayerClick}>{props.player}</h6>
        );
    }
    
}

export default Player;