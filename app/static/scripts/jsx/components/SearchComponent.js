var constants = require('../Constants');
var axios = require('axios');

var SearchComponent = React.createClass({

	getInitialState: function () {
		return {
			symbol: '',
			metadata: '',
      hidden: true
		}
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
				this.setState(
					{
						metadata: response.data.company_data,
            hidden: false
					}
				);
				constants.DEBUG_SEARCH && console.log(this.state.metadata);
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
			</div>
		)
	}
});

module.exports = SearchComponent;
