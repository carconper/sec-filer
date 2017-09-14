var axios = require('axios');
var constants = require('../Constants');
var ListItem = require('./ListItem');

var FilingComponent = React.createClass({

	getInitialState: function () {
		return {
			ready: false
		}
	},

	render: function () {
		constants.DEBUG_FILING && console.log("Inside FilingComponent, rpops.filings", this.props.filings);
		filings = this.props.filings;
		constants.DEBUG_FILING && console.log("Inside FilingComponent, filings", filings);
		//filings = [1,2,3,4,5];
		fils = Array.prototype.slice.call(filings);

		return (
			<div className="list-container">
				{ fils.map(function(filing, index){ return <ListItem key={index} filing={filing}>Test</ListItem> }) }
			  <p>This is the list container</p>
			</div>	
		)
	}
});

module.exports = FilingComponent;
