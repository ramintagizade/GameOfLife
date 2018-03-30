import React from 'react';


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

export default Cell;