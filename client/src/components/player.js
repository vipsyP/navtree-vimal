import React from 'react';

const Player = (props) => {

    console.log("isOpen: "+props.isOpen);

    // if the player node is expanded, render batting runs
    if(props.isOpen) {
        const h6Style = {
            marginLeft: '300px',
            color: 'red'
        };  
        const h1Style = {
            marginLeft: '450px',
            color: 'green'
        };  
        return (
            <div>
                <h6 style = {h6Style} onClick = {props.handlePlayerClick}>{props.player}</h6>
                <h2 style = {h1Style}>Batting runs: {props.stats[0]}</h2>
            </div>
        );
    }
    // else, do not render batting runs
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