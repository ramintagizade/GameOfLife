import React from 'react';

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
export default Generation;