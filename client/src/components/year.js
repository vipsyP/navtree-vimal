import React, { Component } from 'react';
import Team from './team';

class Year extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teams: [
                "Sunrisers Hyderabad",
                "Rising Pune Supergiant",
                "Kolkata Knight Riders",
                "Kings XI Punjab",
                "Royal Challengers Bangalore",
                "Mumbai Indians",
                "Delhi Daredevils",
                "Gujarat Lions",
                "Chennai Super Kings",
                "Rajasthan Royals",
                "Deccan Chargers",
                "Pune Warriors",
                "Kochi Tuskers Kerala",
                "Rising Pune Supergiants"

                ], 

                isOpens: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] 
        }
    }

    expandTeamNode(expandedTeam) {
        console.log("works too!");
        this.setState(
            {isOpens: this.state.teams.map((team, index, array) => {
                if(this.state.isOpens[index]==false && team == expandedTeam) {
                    return true;
                }
                else {
                    return false;
                }
            })}
        );
    }

    render() {
        if(this.props.isOpen) {
            const h1Style = {
                color: 'red'
            };
            return (
                <div>
                    <h3 style={h1Style} onClick = {this.props.handleYearClick}>{this.props.year}</h3>
                    {
                        this.state.teams.map((team, index, array) => {
                            return <Team team = {team} isOpen = {this.state.isOpens[index]} handleTeamClick = {this.expandTeamNode.bind(this, team)}/>
                        })
                    }
                </div>
             );
        }
        else {
            return (
                <h3 onClick = {this.props.handleYearClick}>{this.props.year}</h3>
             );
        }
    }
}

export default Year;
