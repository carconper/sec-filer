var axios = require('axios');
var constants = require('../Constants');

var ListItem = React.createClass({

  getInitialState: function() {
    return {
      selected: false,
    };
  },

	filingClicked: function() {
		this.setState({
			selected: true
		});
	},

  render: function () {
		var href = this.props.url;
		constants.DEBUG_SEARCH && console.log("render(ListItem)", href);

    return (
			<div className='element' onClick={this.filingClicked}>
				<a href={href} target="_blank">{this.props.name}</a>
				{this.props.description}
			</div>
    )
  }
});


module.exports = ListItem;
