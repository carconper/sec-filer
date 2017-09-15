var SearchComponent = require('./SearchComponent');
var ResultsComponent = require('./ResultsComponent');

var MainContainer = React.createClass({

	getInitialState: function() {
		return {
			title: "Filinger",
		}
	},

	render: function() {
		return (
			<div className='container'>
				<h1> MainContainer Component </h1>
				<SearchComponent />
			</div>
		)
	}

});

module.exports = MainContainer;
