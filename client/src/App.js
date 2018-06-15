import React, { Component } from 'react';
import './App.css';
import Year from './components/year'

// The navtree component
class App extends Component {

  constructor(props) {
	super(props);

	//set initial state
	this.state ={
		title: 'The Navtree Project',
		years: [],
		isOpens: []
	};

	//fetch years from server
	let scope = this;
	fetch('http://localhost:3000/years')
	.then((response)=> {
		return response.json()
	})
	.then((myJson)=> {
		scope.players = myJson;
		console.log("years recieved: "+myJson);
		scope.setState({
			years: myJson, 
            isOpens: Array(myJson.length).fill(false)
		});
	});

    this.teams = [];
  }

  // handle clicks to a year node
  expandYearNode = (expandedYear) => {
    let scope = this;

    fetch('http://localhost:3000/'+expandedYear+'/teams')
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      scope.teams = myJson;

      //set new state -- isOpens of the year clicked
      scope.setState({
        isOpens: scope.state.years.map((year, index, array) => 
        {
          if(scope.state.isOpens[index] === false && scope.state.years[index] === expandedYear) {
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
    return (
      	<div className="App">
    	<h1>{this.state.title}</h1>
			<br/>
      	{
      	  this.state.years.map((year, index, array)=>{
						// if the years node is expanded, pass teams to it					
      	    if(this.state.isOpens[index]) {
      	      return <Year year = {year} isOpen = {this.state.isOpens[index]} handleYearClick = {this.expandYearNode.bind(this, year)} teams = {this.teams}/>
						}
						// else don't pass teams to it					
      	    else{
      	      return <Year year = {year} isOpen = {this.state.isOpens[index]} handleYearClick = {this.expandYearNode.bind(this, year)} teams = {[]}/>
      	    }
      	  })
      	}
      </div>
    );
  }
}

export default App;
