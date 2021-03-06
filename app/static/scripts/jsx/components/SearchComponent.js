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

	_renderSymbol: function() {
		if (this.state.hidden) {
			return ;
		} else {
			return (
				<div className='symbol'>
					<p className='symbol'>{this.state.symbol}</p>
				</div>
			)
		}
	},

	_renderCompany: function() {
		if (this.state.hidden) {
			return ;
		} else {
			return (
				<div className='company-panel'>
					<CompanyComponent status={ this.state.status } metadata={ this.state.metadata }/>
				</div>
			)
		}
	},

	_renderFilings: function() {
		if (this.state.hidden) {
			return ;
		} else {
			return (
				<div className='result'>
			    <FilingComponent status={ this.state.status } company={ this.state.symbol } />
				</div>
			)
		}
	},

	render: function() {

		return (
			<div className='panel'>
				<div className='company'>
					<div className='search'>
						<div className='search-control'>
							<input type='text'
										 placeholder="Symbol"
										 onChange={ this.handleInput } />
							<button className="" type='button' onClick={ this.companySearch }>Search</button>
						</div>
						{this._renderSymbol()}
					</div>
					{this._renderCompany()}
				</div>
				{this._renderFilings()}
			</div>
		)
	}
});

module.exports = SearchComponent;
