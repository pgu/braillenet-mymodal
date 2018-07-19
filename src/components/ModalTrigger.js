import React, { Component } from 'react';

class ModalTrigger extends Component {
  render() {
    return (
      <button onClick={this.props.openModal}>{this.props.triggerText}</button>
    );
  }
}

export default ModalTrigger;



