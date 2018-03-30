import React from 'react';
import Cell from './cell';

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

export default Board;