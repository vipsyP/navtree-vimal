import React from 'react';

const Player = (props) => {

    console.log("isOpen: "+props.isOpen);

    if(props.isOpen) {
        const h6Style = {
            marginLeft: '300px',
            color: 'red'
        };  
        const h1Style = {
            marginLeft: '500px',
            color: 'green'
        };  
        return (
            <div>
                <h6 style = {h6Style} onClick = {props.handlePlayerClick}>{props.player}</h6>
                <h1 style = {h1Style}>Batting runs: {props.stats[0]}</h1>
            </div>
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