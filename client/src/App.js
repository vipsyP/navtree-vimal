import React, { Component } from 'react';
import './App.css';
import Year from './components/year'

class App extends Component {

  // initialize variables

//   componentWillReceiveProps(nextProps) {


// }


  constructor(props) {
	super(props);

	let scope = this;

	this.state ={

		title: 'The Navtree Project',
		years: [],
		isOpens: []

	};
	fetch('http://localhost:3000/years')
	.then((response)=> {
		return response.json()
	})
	.then((myJson)=> {
		console.log(myJson);
		scope.players = myJson;
		// console.log("The players are: "+scope.players);
		debugger;
		console.log("years recieved: "+myJson);
		scope.setState({
			title: 'The Navtree Project',
			// years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
			// isOpens: [false, false, false, false, false, false, false, false, false, false] 

			years: myJson, 
            isOpens: Array(myJson.length).fill(false)
		  });
		// scope.state = 
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
      console.log(myJson);
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

          if(this.state.isOpens[index]) {
            console.log("App map, teams: "+this.teams+", isOpens: "+this.state.isOpens[index]);
            return <Year year = {year} isOpen = {this.state.isOpens[index]} handleYearClick = {this.expandYearNode.bind(this, year)} teams = {this.teams}/>
          }
        
          else{
            console.log("App map, teams: "+this.teams+", isOpens: "+this.state.isOpens[index]);
            return <Year year = {year} isOpen = {this.state.isOpens[index]} handleYearClick = {this.expandYearNode.bind(this, year)} teams = {[]}/>
          }
        
        })
      }
      </div>
    );
  }
}

export default App;
