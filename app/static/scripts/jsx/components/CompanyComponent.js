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
			<div className="metadata">
				{this.props.status ? (
					<div className="info">
						<table>
							<tr>
								<th>Company</th>
								<td>{this.props.metadata['companyname']}</td>
							</tr>
							<tr>
								<th>CIK</th>
								<td>{this.props.metadata['cik']}</td>
							</tr>
							<tr>
								<th>SIC Code</th>
								<td>{this.props.metadata['siccode']}</td>
							</tr>
							<tr>
								<th>SIC Desc</th>
								<td>{this.props.metadata['sicdescription']}</td>
							</tr>
							<tr>
								<th>Market</th>
								<td>{this.props.metadata['marketoperator']}</td>
							</tr>
						</table>
					</div>
				) : (
						<p> Company doesnt exist. Try another Trading Symbol </p>
				)}
			</div>
		);
	}
});

module.exports = CompanyComponent;
