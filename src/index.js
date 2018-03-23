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
				<Generation cbNext={this.getNext} nthGeneration={this.state.next}/>
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
			cells:[],
			updateCell:{i:-1,j:-1,color:""}
		};
		this.generate = this.generate.bind(this);
		this.updateCell = this.updateCell.bind(this);
		
	}
	updateCell(cell) {
		console.log(cell);
		let cells = [...this.state.cells];
		cells[cell.i][cell.j] = cell.color;
		this.setState({
			cells:cells
		});
	}
	generate(){

		var cells = [...this.state.cells];
		var newGenCell = []; 
		
		cells.forEach(function(row, x) {
	        newGenCell[x] = [];
	        row.forEach(function(cell, y) {
	            var alive = "black", count = countNeighbors(x, y);
	            
	            if (cell !="black") {
	                alive = count === 2 || count === 3 ? "red" : "black";
	            } else {
	                alive = count === 3 ? "yellow" : "black";
	            }
	            
	            newGenCell[x][y] = alive;
	        });
	    });
    	
    	cells = newGenCell
		
    	
    	function countNeighbors(r,c) {
    		function checkBounds(i,j) {
    			return (i>=0 && i<14 && j>=0 && j<50) && (cells[i][j]!="black");
    		}
    		let cnt = 0;
    		if(checkBounds(r-1,c-1)) cnt++;
    		if(checkBounds(r-1,c)) cnt++;
    		if(checkBounds(r-1,c+1)) cnt++;
    		if(checkBounds(r,c-1)) cnt++;
    		if(checkBounds(r,c+1)) cnt++;
    		if(checkBounds(r+1,c-1)) cnt++;
    		if(checkBounds(r+1,c)) cnt++;
    		if(checkBounds(r+1,c+1)) cnt++;
    		return cnt;
     	}

        this.setState({
        	cells:cells
        });

	}
	componentDidUpdate(prevProps, prevState) {
		if(prevProps.nextActive!=this.props.nextActive) {
			this.generate();
		}
	}
	componentDidMount() {
		var cells = [];
		for(let i=0;i<14;i++) {
			cells[i] = [];
			for(let j=0;j<50;j++){
				cells[i].push('black');
			}
		}
		this.setState({
			cells:cells
		});
	}

	render() {
		var self = this;
		var mapCells = this.state.cells.map(function(row,i){
			return row.map(function(elem, j){
				console.log(elem)
				return <Cell key={i+j} i={i} j={j} color={elem} style={{backgroundColor:elem}} updateCellCB={self.updateCell}/>; 
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
	}
	onClick(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		let i = this.props.i;
		let j = this.props.j;
		let color = this.props.color;
		if(color!="red" && color!="yellow") {
			color = "yellow";
		}
		else {
			color = "black";
		}
		this.props.updateCellCB({i:i,j:j,color:color});
		
		return false;
	}
	toggleClick() {

	}
	render() {
		return (
				<div className="cell"  onClick={this.onClick} refs={"container"} style={this.props.style}> </div> 
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
					<p>Generation: {this.props.nthGeneration}</p>
				</div>
			</div>
		);
	}
}
ReactDOM.render( <GameOfLife/>, document.getElementById('app'));

module.hot.accept();
