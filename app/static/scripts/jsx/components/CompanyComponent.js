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
								<th>{this.props.metadata['companyname']}</th>
							</tr>
							<tr>
								<td>CIK</td>
								<td>{this.props.metadata['cik']}</td>
							</tr>
							<tr>
								<td>SIC Code</td>
								<td>{this.props.metadata['siccode']}</td>
							</tr>
							<tr>
								<td>SIC Desc</td>
								<td>{this.props.metadata['sicdescription']}</td>
							</tr>
							<tr>
								<td>Market</td>
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
