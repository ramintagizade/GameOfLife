import React from 'react';
import ReactDOM from 'react-dom';
require('../styles/index.scss');

class GameOfLife extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			next:0,
			initCellsActive:false
		};
		this.getNext = this.getNext.bind(this);
		this.initCells = this.initCells.bind(this);
		this.resetInitCells = this.resetInitCells.bind(this);
	}
	getNext(val) {
		this.setState({
			next:val+1
		});
	}
	initCells() {
		this.setState({
			initCellsActive:true
		});
	}
	resetInitCells() {
		this.setState({
			initCellsActive:false
		});
	}
	render() {
		return (
			<div > 
				<Generation cbNext={this.getNext} nthGeneration={this.state.next} cbInit={this.initCells}/>
				<Board nextActive={this.state.next} initCellsActive={this.state.initCellsActive} resetInitCellsCB={this.resetInitCells}/>
				
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
    			return (i>=0 && i<20 && j>=0 && j<50) && (cells[i][j]!="black");
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
		if(prevProps.initCellsActive!=this.props.initCellsActive){
			this.initCells();
			this.props.resetInitCellsCB();
		}
	}
	fillCells() {
		var cells = [];
		for(let i=0;i<20;i++) {
			cells[i] = [];
			for(let j=0;j<50;j++){
				if((i+j)%3==0) cells[i].push("yellow");
				else cells[i].push('black');
			}
		}
		this.setState({
			cells:cells,
		});
	}
	initCells() {
		var cells = [];
		for(let i=0;i<20;i++) {
			cells[i] = [];
			for(let j=0;j<50;j++){
				cells[i].push('black');
			}
		}
		this.setState({
			cells:cells,
		});
	}
	componentDidMount() {
		this.fillCells();
	}

	render() {
		var self = this;
		var mapCells = this.state.cells.map(function(row,i){
			return row.map(function(elem, j){
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

class Generation extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			generation:0,
			pause:false,
			run:false,
			lastActivity:""
		}
		this.next = this.next.bind(this);
		this.run = this.run.bind(this);
		this.pause = this.pause.bind(this);
		this.clear = this.clear.bind(this);
	}
	componentDidMount() {
		this.run();
	}
	next() {
		this.setState({
			generation:this.state.generation+1
		});
		this.props.cbNext(this.state.generation);
	}
	run() {
		var self = this;
		if(!this.state.run) {
			this.interval = setInterval(function(){
				self.props.cbNext(self.state.generation);
				self.setState({
					lastActivity:"run",
					generation:self.state.generation+1,
					pause:false,
					run:true
				});
			},500);
			return this.interval;
		}
	}
	pause() {
		var self = this;
		this.setState({
			run:false,
			pause:!this.state.pause},function(){
				if(this.state.pause)
					clearInterval(self.interval);
				else if(self.state.lastActivity=="run") self.run();
			});	
	}
	clear() {
		var self = this;
		this.setState({
			generation:0,
			run:false,
			pause:false,
			lastActivity:""
		});
		if(this.state.run)
			clearInterval(this.interval);
		this.props.cbNext(-1);
		this.props.cbInit();
	}
	render() {
		return (
			<div className="generation"> 
				<div className="generation">
					<div className="run" onClick={this.run}>Run </div> <div className="run" onClick={this.next}>Next </div>
					<div className="run" onClick={this.pause}>Pause </div><div className="run" onClick={this.clear}>Clear </div>
					<p>Generation: {this.props.nthGeneration}</p>
				</div>
			</div>
		);
	}
}
ReactDOM.render( <GameOfLife/>, document.getElementById('app'));

module.hot.accept();
