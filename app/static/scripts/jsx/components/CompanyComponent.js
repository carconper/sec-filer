var axios = require('axios');
var constants = require('../Constants');

var CompanyComponent = React.createClass({
	
	getInitialState: function () {
		return {
		}
	},

	render: function () {

		constants.DEBUG_SEARCH && console.log("PROPS metadata", this.props.metadata);
		constants.DEBUG_SEARCH && console.log("PROPS status", this.props.status);

		return (
			<div class="company">
				{this.props.status ? (
					<div class="metadata">
						<p> Company Name: {this.props.metadata['companyname']} </p>
						<p> CIK: {this.props.metadata['cik']} </p>
						<p> {this.props.metadata['siccode']} | {this.props.metadata['sicdescription']} </p>
						<p> {this.props.metadata['marketoperator']} </p>
					</div>
				) : (
						<p> Company doesnt exist. Try another Trading Symbol </p>
				)}
			</div>
		);
	}
});

module.exports = CompanyComponent;
