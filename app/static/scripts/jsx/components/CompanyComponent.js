var axios = require('axios');
var constants = require('../Constants');

var CompanyComponent = React.createClass({
	
	getInitialState: function () {
		return {
		}
	},

	render: function () {

		constants.DEBUG_SEARCH && console.log("PROPS metadata", this.props.metadata);

		return (
			<div class="company">
				<p> Company Name: { this.props.metadata['companyname'] } </p>
				<p> CIK: { this.props.metadata['cik'] } </p>
				<p> { this.props.metadata['siccode'] } | { this.props.metadata['sicdescription'] } </p>
				<p> { this.props.metadata['marketoperator'] } </p>
			</div>
		)
	}
});

module.exports = CompanyComponent;
