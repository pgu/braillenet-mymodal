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
      <div>
        <ModalTrigger triggerText="Open"/>
        <ModalContent/>
      </div>
    );
  }


}

export default Modal;
