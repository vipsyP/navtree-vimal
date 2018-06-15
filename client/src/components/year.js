import React, { Component } from 'react';
import Team from './team';

class Year extends Component {

    //The constructor is called only the first time the component is rendered
    //Any changes in props will not be reflected in here
    //Instead, changes to props are reflected in componentWillReceiveProps(nextProps) {}
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            isOpens: []
        }
        this.players = [];
    }

    // Recieve new props
    componentWillReceiveProps(nextProps) {
        this.setState({
            teams: nextProps.teams, 
            isOpens: Array(nextProps.teams.length).fill(false)
        });  
    }

    // handle clicks to a year node
    expandTeamNode(expandedTeam) {

        let scope = this;
        fetch('http://localhost:3000/'+scope.props.year+'/'+expandedTeam+"/players")
        .then((response)=> {
            return response.json()
        })
        .then((myJson)=> {
            scope.players = myJson;

            //set new state -- isOpens of the team clicked
            scope.setState(
                {isOpens: scope.state.teams.map((team, index, array) => {
                    if(scope.state.isOpens[index]==false && team == expandedTeam) {
                        return true;
                    }
                    else {
                        return false;
                    }
                })}
            );
        });
    }

    render() {

        // if the year node is expanded, render teams
        if(this.props.isOpen) {
            const h1Style = {
                color: 'red'
            };
            return (
                <div>
                    <h3 style={h1Style} onClick = {this.props.handleYearClick}>{this.props.year}</h3>
                    {
                        this.state.teams.map((team, index, array) => {
                            // if the team node is expanded, pass players to it
                            if(this.state.isOpens[index]){ 
                                return <Team year = {this.props.year} team = {team} isOpen = {this.state.isOpens[index]} handleTeamClick = {this.expandTeamNode.bind(this, team)} players = {this.players}/>
                            }
                            // else do not pass players
                            else{
                                return <Team year = {this.props.year} team = {team} isOpen = {this.state.isOpens[index]} handleTeamClick = {this.expandTeamNode.bind(this, team)} players = {[]}/>
                            }
                        })
                    }
                </div>
             );
        }

        //else do not render the teams
        else {
            return (
                <h3 onClick = {this.props.handleYearClick}>{this.props.year}</h3>
             );
        }
    }
}

export default Year;
