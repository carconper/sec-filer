var axios = require('axios');
var constants = require('../Constants');
var Waypoint = require('react-waypoint');		
var ListItem = require('./ListItem');

var FilingComponent = React.createClass({

	getInitialState: function () {
		return {
			symbol: '',
			filingsShown: [],
			filingsLeft: false,
			begin: 0,
			ready: false,
			status: false 
		}
	},

	componentWillMount: function () {
		// Load first batch of filings passed
		constants.DEBUG_FILING && console.log("componentWillMount(): ", this.props.company, this.props.status);
		if (!this.props.status) {
			constants.DEBUG_FILING && console.log("componentWillMount(): iNot ready to load filings");
		} else {
			axios.get(constants.EC2_INUSE.concat(constants.RESOURCE_API_FILINGS),
								{ params: {
										symbol: this.props.company,
										begin: this.state.begin,
										count: 10
									}
								}
			)
			.then(function(response) {
				constants.DEBUG_FILING && console.log("componentWillMount(): Response Filing", response);
				this.setState(
					{
						filingsShown: this.buildFilings(response.data.filing_list),
						status: true,
						filingsLeft: true,
						symbol: this.props.company,
						//CHECK Instead of 10, should be the size of the returned filing list
						begin: this.state.begin + 11
					}
				);
				constants.DEBUG_FILING && console.log("componentWillMount(): Adapted Filings",this.state.filingsShown);
			}.bind(this));
		};
	},

	buildFilings: function (fils) {
		constants.DEBUG_FILING && console.log("buildFilings(): fils", fils);
		length = fils.length;
		var elements = [];
		for (var i = 0; i < length; i++) {
			constants.DEBUG_FILING && console.log("buildFilings():", i, fils[i]['form']);
			var name = fils[i]['form'];
			var desc = fils[i]['desc'];
			var date = fils[i]['date'];
			var link = fils[i]['link'];
			elements.push(<ListItem key={i + this.state.begin} name={name} description={desc} date={date} url={link}/>);
		}
		return elements;
	},

	_renderFilings: function () {
		constants.DEBUG_FILING && console.log("_renderFilings(): filingsShown", this.state.filingsShown);
		if (this.props.company != this.state.symbol) {
			this.setState({
					filingsShown: [],
					filingsLeft: true,
					symbol: this.props.symbol
			})
		} else {
			return (
				<table className='filings'>
					<tbody>
						{this.state.filingsShown}
					</tbody>
				</table>
			)
		};
	},

	_renderMore: function () {
		constants.DEBUG_FILING && console.log("_renderMore():", this.state.symbol, this.state.begin);
		constants.DEBUG_FILING && console.log("_renderMore(): url --> ", constants.EC2_INUSE.concat(constants.RESOURCE_API_FILINGS));
		// This function will take care of retrieving more filings
		additionalFilings = [];
		axios.get(constants.EC2_INUSE.concat(constants.RESOURCE_API_FILINGS),
							{ params: 
								{
									symbol: this.state.symbol,
									begin: this.state.begin,
									count: 40
								}
							}
		)
		.then(function(response) {
			constants.DEBUG_FILING && console.log("Response", response);
			if (response.statusText == 'NOK') {  
				constants.DEBUG_FILING && console.log("denderMore(): Responsei is NOK!!");
				this.setState({filingsLeft: false}) ;
				return ;
			} else {
				additionalFilings = this.buildFilings(response.data.filing_list);
				constants.DEBUG_FILING && console.log("renderMore(): length of additionalFilings", additionalFilings.length, additionalFilings);
				this.setState({
					filingsShown: this.state.filingsShown.concat(additionalFilings),
					begin: this.state.begin + 40
				});
			};
		}.bind(this));
	},

	_renderWaypoint: function (symbol) {
		constants.DEBUG_FILING && console.log("_renderWaypoint():", this.state.filingsLeft);
		if (this.state.filingsLeft) {
			return (
				<div className='loading'>
					<Waypoint onEnter={this._renderMore} />
					<p>Loading more filings...</p>
				</div>
			);
		} else {
			return ;
		};
	},

	render: function () {
		constants.DEBUG_FILING && console.log("===========RENDER===BEGIN================");
		constants.DEBUG_FILING && console.log("Symbol", this.props.company);
		constants.DEBUG_FILING && console.log("Filings left", this.state.filingsLeft);
		constants.DEBUG_FILING && console.log("Filings begin", this.state.begin);
		constants.DEBUG_FILING && console.log("===========RENDER===END================");

		return (
			<div className="list-container">
				{this.state.status ? (
					this._renderFilings()	
				) : (
					<p>No Filings available</p>
				)}
				<div className="infinite-scroll-example_waypoint">
					{this._renderWaypoint()}
				</div>
			</div>	
		)
	}
});

module.exports = FilingComponent;
