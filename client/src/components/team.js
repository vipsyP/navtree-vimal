import React, {Component} from 'react';
import Player from './player';
class Team extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            isOpens: Array(0).fill(false)
        }
        this.stats = []
    }


    componentWillReceiveProps(nextProps) {
        console.log("The next props for team; "+JSON.stringify(nextProps) );
        this.setState({
            players: nextProps.players, 
            isOpens: Array(nextProps.players.length).fill(false)
        });  
    }

    expandPlayer(expandedPlayer) {
        console.log("expandedPlayer: "+ expandedPlayer);

        let scope = this;
        fetch('http://localhost:3000/'+scope.props.year+'/'+scope.props.team+"/"+expandedPlayer)
        .then((response)=> {
            return response.json()
        })
        .then((myJson)=> {
            this.stats = myJson;
            // console.log("The stats variable: "+this.stats);

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

        console.log("The stats variable: "+this.stats);
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
                            if(this.state.isOpens[index]){
                                return <Player player = {player} stats = {this.stats} isOpen = {this.state.isOpens[index]} handlePlayerClick = {this.expandPlayer.bind(this, player)} />
                            }
                            else{
                                return <Player player = {player} stats = {[]} isOpen = {this.state.isOpens[index]} handlePlayerClick = {this.expandPlayer.bind(this, player)} />
                            }
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