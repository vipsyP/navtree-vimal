import React, {Component} from 'react';
import Player from './player';
class Team extends Component {

    //set initial state
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            isOpens: Array(0).fill(false)
        }
        this.stats = []
    }

    // Recieve new props
    componentWillReceiveProps(nextProps) {
        console.log("The next props for team; "+JSON.stringify(nextProps) );
        this.setState({
            players: nextProps.players, 
            isOpens: Array(nextProps.players.length).fill(false)
        });  
    }

    // handle clicks to a player node
    expandPlayer(expandedPlayer) {
        console.log("expandedPlayer: "+ expandedPlayer);

        let scope = this;
        fetch('http://localhost:3000/'+scope.props.year+'/'+scope.props.team+"/"+expandedPlayer)
        .then((response)=> {
            return response.json()
        })
        .then((myJson)=> {
            this.stats = myJson;

            //set new state -- isOpens of the team clicked
            this.setState({
                isOpens: this.state.players.map((player, index, array)=> {
                    console.log("player: "+player+", expandedPlayer: "+expandedPlayer);
                    if(expandedPlayer == player && this.state.isOpens[index] == false) {
                        return true;
                    }
                    else {
                        return false;
                    }
                })
            });
        });
    }

    render() {
        // if the team node is expanded, render players
        if(this.props.isOpen){
            const h5Style = {
                marginLeft: "100px",
                color:'red'
            };
            return (
                <div>
                    <h5 style = {h5Style} onClick = {this.props.handleTeamClick}>{this.props.team}</h5>
                    {
                        this.state.players.map((player, index, array) => {
                            // if the player node is expanded, pass player statistics
                            if(this.state.isOpens[index]){
                                return <Player player = {player} stats = {this.stats} isOpen = {this.state.isOpens[index]} handlePlayerClick = {this.expandPlayer.bind(this, player)} />
                            }
                            // else, do not pass player statistics                            
                            else{
                                return <Player player = {player} stats = {[]} isOpen = {this.state.isOpens[index]} handlePlayerClick = {this.expandPlayer.bind(this, player)} />
                            }
                        })
                    }
                </div>
            );
        }

        //else do not render the players
        const h5Style = {
            marginLeft: "100px"
        };
        return (
            <div>
                <h5 style = {h5Style} onClick = {this.props.handleTeamClick}>{this.props.team}</h5>
            </div>
        );
    }
}

export default Team;