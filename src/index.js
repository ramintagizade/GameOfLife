import React from 'react';
import ReactDOM from 'react-dom';
require('../styles/index.scss');
import Generation from './generation';
import Board from './board';

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






ReactDOM.render( <GameOfLife/>, document.getElementById('app'));

module.hot.accept();
