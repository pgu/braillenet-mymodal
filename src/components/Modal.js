import ModalTrigger from "./ModalTrigger";
import ModalContent from "./ModalContent";
import React, {Component} from "react";


// ModalTrigger
// ModalContent -> Modal (-> ModalPortal)

class Modal extends Component {

  constructor() {
    super();

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render () {
    return (
      <React.Fragment>
        <ModalTrigger triggerText="Open" openModal="this.openModal"/>
        <ModalContent
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="Modal d'exemple"
        ></ModalContent>
      </React.Fragment>
    );
  }


}

export default Modal;
