import React, { Component } from 'react';
import './App.css';
import Year from './components/year'

class App extends Component {

  // initialize variables
  constructor(props) {
    super(props);
    this.state = {
      title: 'The Navtree Project',
      years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
      isOpens: [false, false, false, false, false, false, false, false, false, false] 
    }
    this.teams = null;
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
    //console.log("this.teams: "+this.teams);
  });
  
    this.setState({
      isOpens: this.state.years.map((year, index, array) => 
      {
        if(this.state.isOpens[index] === false && this.state.years[index] === expandedYear) {
          return true;
        }
        else {
          return false;
        }
      })
    });
  }

  render() {

    return (
      <div className="App">
        <h1>{this.state.title}</h1>
        <br/>
  {this.state.years.map((year, index, array)=>{return <Year year = {year} isOpen = {this.state.isOpens[index]} handleYearClick = {this.expandYearNode.bind(this, year)}/>})}
      </div>
    );
  }
}

export default App;
