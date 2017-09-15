var constants = require('../Constants');
var axios = require('axios');
var CompanyComponent = require('./CompanyComponent');
var FilingComponent = require('./FilingComponent');

var SearchComponent = React.createClass({

	getInitialState: function () {
		return {
			symbol: 'AAPL',
			metadata: {},
			filings: [],
			hidden: true,
			status: false
		}
	},

	componentWillMount: function () {
		constants.DEBUG_SEARCH && console.log("componentWillMount(SearchComponent)");
		axios.get(constants.EC2_INUSE.concat(constants.RESOURCE_API_SEARCH),
							{ params: {
									symbol: "AAPL"
								}
							}
		)
			.then(function(response) {
				constants.DEBUG_SEARCH && console.log("Initial response", response);
				//metadata = response.data.company_data;
				this.setState(
					{
						metadata: response.data.company_data,
						symbol: "AAPL",
						hidden: false,
						status: true
					}
				);
				constants.DEBUG_SEARCH && console.log("Initial metadata", response.data.company_data);
			}.bind(this));
	},

	handleInput: function (e) {
		this.setState({ 
			symbol: e.target.value,
			hidden: true
		})
	},

	companySearch: function() {
		axios.get(constants.EC2_INUSE.concat(constants.RESOURCE_API_SEARCH),
							  { params: {
										symbol: this.state.symbol
									}
								}
			)
			.then(function(response) {
				constants.DEBUG_SEARCH && console.log(response);
				if (response.data.status == 'NOK') {
					this.setState(
						{
							hidden: false,
							status: false
						}
					)
				} else {
					this.setState(
						{
							metadata: response.data.company_data,
							hidden: false,
							status: true
						}
					);
				}
				constants.DEBUG_SEARCH && console.log(this.state.metadata);
			}.bind(this));
	},

	_renderFilings: function() {
		if (this.state.hidden) {
			return ;
		} else {
			return (
				<div className='result'>
					<CompanyComponent status={ this.state.status } metadata={ this.state.metadata }/>
			    <FilingComponent status={ this.state.status } company={ this.state.symbol } />
				</div>
			)
		}
	},

	render: function() {

		return (
			<div className='panel'>
				<div className='search'>
					<input type='text'
								 placeholder="Search Company by Trading Symbol (ex: AAPL)"
								 onChange={ this.handleInput } />
					<button className="btn-search" type='button' onClick={ this.companySearch }>Search</button>
				</div>
				{this._renderFilings()}
			</div>
		)
	}
});

module.exports = SearchComponent;
