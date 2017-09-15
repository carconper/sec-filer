var constants = require('../Constants');
var axios = require('axios');
var CompanyComponent = require('./CompanyComponent');
var FilingComponent = require('./FilingComponent');

var SearchComponent = React.createClass({

	getInitialState: function () {
		return {
			symbol: '',
			metadata: {},
			filings: {},
			hidden: true,
			ready: true,
			comp_status: false,
			fil_status: false
		}
	},

	componentWillMount: function () {
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
						comp_status: true
					}
				);
				constants.DEBUG_SEARCH && console.log("Initial metadata", response.data.company_data);
			}.bind(this));


		axios.get(constants.EC2_INUSE.concat(constants.RESOURCE_API_FILINGS),
							  { params: {
										symbol: "AAPL",
										begin: 0,
										count: 10
									}
								}
			)
			.then(function(response) {
				constants.DEBUG_SEARCH && console.log("Response Filing", response);
				this.setState(
					{
						filings: response.data.filing_list,
						fil_status: true
					}
				);
				constants.DEBUG_SEARCH && console.log("Response filings",this.state.filings);
			}.bind(this));
	},

	handleInput: function (e) {
		this.setState({ symbol: e.target.value})
	},

	companySearch: function() {
		axios.get(constants.EC2_INUSE.concat(constants.RESOURCE_API_SEARCH),
		//axios.get('http://ec2-54-219-188-73.us-west-1.compute.amazonaws.com:5000/metadata',
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
							comp_status: false
						}
					)
				} else {
					this.setState(
						{
							metadata: response.data.company_data,
							hidden: false,
							comp_status: true
						}
					);
				}
				constants.DEBUG_SEARCH && console.log(this.state.metadata);
			}.bind(this));

		axios.get(constants.EC2_INUSE.concat(constants.RESOURCE_API_FILINGS),
							  { params: {
										symbol: this.state.symbol,
										begin: 0,
										count: 10
									}
								}
			)
			.then(function(response) {
				constants.DEBUG_SEARCH && console.log("Response Filing", response);
				if (response.data.status == 'NOK') {
					this.setState(
						{
							fil_status: false
						}
					)
				} else {
					this.setState(
						{
							filings: response.data.filing_list,
							fil_status: true
						}
					);
				}
				constants.DEBUG_SEARCH && console.log("Response filings",this.state.filings);
			}.bind(this));
	},

  _renderButton: function() {
    if (this.state.hidden) {
      return ;
    }
    return (
			<button className="btn-search" type='button'>Show Filings</button>
    )
  },

	render: function() {
		return (
			<div class='search'>
				<input type='text'
							 placeholder="Search Company by Trading Symbol (ex: AAPL)"
							 onChange={ this.handleInput } />
				<button className="btn-search" type='button' onClick={ this.companySearch }>Search</button>
        {this._renderButton()}
			  <CompanyComponent status={ this.state.comp_status } metadata={ this.state.metadata }/>
				<FilingComponent status={ this.state.fil_status } filings={ this.state.filings } />
			</div>
		)
	}
});

module.exports = SearchComponent;
