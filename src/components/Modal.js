import ModalTrigger from "./ModalTrigger";
import ModalContent from "./ModalContent";
import React from "react";


class Modal extends React.Component {

  // componentDidMount() {
  //   document.body.appendChild(this.node);
  //   this.renderPortal(this.props);
  // }

  render () {
    return (
      <React.Fragment>
        <ModalTrigger triggerText="Open"/>
        <ModalContent/>
      </React.Fragment>
    );
  }


}

export default Modal;
