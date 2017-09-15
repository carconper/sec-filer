var axios = require('axios');
var constants = require('../Constants');

var ListItem = React.createClass({

  getInitialState: function() {
    return {
      selected: false,
    };
  },

  render: function () {

    return (
      <div className='element' onClick={this.listSelect}>{this.props.filing['desc']}</div>
    )
  }
});


module.exports = ListItem;
