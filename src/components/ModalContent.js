import React, {Component} from 'react';

class ModalContent extends Component {
  render () {
    return (
      <div class="modal-content">
        <p>Du texte</p>
        <button onClick={this.closeModal}>Fermer</button>
      </div>
    );
  }
}

export default ModalContent;



