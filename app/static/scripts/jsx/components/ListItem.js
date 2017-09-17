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
			<tr className='tr-elem'>
				<td className='td-link'>
					<a className='form-link' href={href} target="_blank">{this.props.name}</a>
				</td>
				<td className='td-desc'>
					<a href={href} target="_blank">{this.props.description}</a>
				</td>
				<td className='td-date'>
					{this.props.date}
				</td>
			</tr>
    )
  }
});


module.exports = ListItem;
