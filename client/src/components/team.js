import React, {Component} from 'react';
import Player from './player';
class Team extends Component {

    state = {
        players: ['A', 'B', 'C'],
        isOpens: [false, false, false]
    }

    expandPlayer(expandedPlayer) {
        console.log("expandedPlayer: "+ expandedPlayer);
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
    }

    render() {
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
                            return <Player player = {player} isOpen = {this.state.isOpens[index]} handlePlayerClick = {this.expandPlayer.bind(this, player)} />
                        })
                    }
                </div>
            );
        }

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