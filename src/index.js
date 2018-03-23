import React from 'react';
import ReactDOM from 'react-dom';
require('../styles/index.scss');

class GameOfLife extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			next:0,
		}
		this.getNext = this.getNext.bind(this);
	}
	getNext(val) {
		this.setState({
			next:val+1
		});
	}
	render() {
		return (
			<div > 
				<Generation cbNext={this.getNext}/>
				<Board nextActive={this.state.next}/>
				<Settings/>
			</div>

		);
	}
}


class Board extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			cells:[]
		}
		
	}
	componentDidUpdate(prevProps, prevState) {
		if(prevProps.nextActive!=this.props.nextActive) {
			alert("active " + this.props.nextActive);
		}
	}
	componentDidMount() {
		var cells = [];
		for(let i=0;i<20;i++) {
			cells[i] = [];
			for(let j=0;j<140;j++){
				cells[i].push('*');
			}
		}
		this.setState({
			cells:cells
		});
	}

	render() {
		var mapCells = this.state.cells.map(function(row,i){
			
			return row.map(function(elem, j){
				return <Cell key={i+j} i={i} j={j}/>; 
			});
		});

		return (
			<div  className="Board"> 
			{mapCells}
				
			</div>
		);
	}
}

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.state = {
			// yellow , red, black 
			livingCondition:'black'				
		}
	}
	onClick(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		let i = this.props.i;
		let j = this.props.j;
		var div = document.getElementsByClassName("cell");
		//convert 1d to 2d 
		var cell = [];
		let cnt = 0;
		for(let i=0;i<20;i++) {
			cell[i] = [];
			for(let j=0;j<140;j++) {
				cell[i].push(div[cnt]);
				cnt++;
			}
		}
		//let curDiv = div[i*87 + j].style.backgroundColor;
		let curDiv = cell[i][j].style.backgroundColor;
		if(curDiv !="green") {
			cell[i][j].style.backgroundColor = "green";
		}
		else {
			cell[i][j].style.backgroundColor = "black";
		}
		
		if(this.state.livingConditio=="black") {
			this.setState({
				livingCondition:'yellow'
			});
		}
		return false;
	}
	toggleClick() {

	}
	render() {
		return (
				<div className="cell"  onClick={this.onClick} refs={"container"}> </div> 
		);
	}
}

class Settings extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div className="settings"> 
				<div className="settings-size"><p>Board Size:</p>
					<div className="size">Size:  </div><div className="size">Size: </div><div className="size">Size: </div>
				</div>
				<div className="settings-speed"><p>Sim Speed:</p>
					<div className="speed">Slow  </div><div className="speed">Medium </div><div className="speed">Fast </div>
				</div>
			</div>
		);
	}
}

class Generation extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			generation:0,
		}
		this.next = this.next.bind(this);
	}
	next() {
		this.setState({
			generation:this.state.generation+1
		});
		this.props.cbNext(this.state.generation);
	}
	render() {
		return (
			<div className="generation"> 
				<div className="generation">
					<div className="run">Run </div> <div className="run" onClick={this.next}>Next </div><div className="run">Pause </div><div className="run">Clear </div>
					<p>Generation: </p>
				</div>
			</div>
		);
	}
}
ReactDOM.render( <GameOfLife/>, document.getElementById('app'));

module.hot.accept();
