var SearchComponent = require('./SearchComponent');

var MainContainer = React.createClass({

	getInitialState: function() {
		return {
			title: "Filinger",
		}
	},

	render: function() {
		return (
			<div className='container'>
				<SearchComponent />
			</div>
		)
	}

});

module.exports = MainContainer;
