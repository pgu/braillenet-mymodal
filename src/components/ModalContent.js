import React, {Component} from 'react';
import {createPortal} from "react-dom";
import ModalPortal from "./ModalPortal";
// import { polyfill } from "react-lifecycles-compat";

export const portalClassName = "ReactModalPortal";
export const bodyOpenClassName = "ReactModal__Body--open";

function getParentElement(parentSelector) {
  return parentSelector();
}

class ModalContent extends Component {

  static defaultProps = {
    isOpen: false,
    portalClassName,
    bodyOpenClassName,
    ariaHideApp: true,
    closeTimeoutMS: 0,
    shouldFocusAfterRender: true,
    shouldCloseOnEsc: true,
    shouldCloseOnOverlayClick: true,
    shouldReturnFocusAfterClose: true,
    parentSelector: () => document.body
  };

  static defaultStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.75)"
    },
    content: {
      position: "absolute",
      top: "40px",
      left: "40px",
      right: "40px",
      bottom: "40px",
      border: "1px solid #ccc",
      background: "#fff",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "4px",
      outline: "none",
      padding: "20px"
    }
  };

  componentDidMount() {
    this.node.className = this.props.portalClassName;

    const parent = getParentElement(this.props.parentSelector);
    parent.appendChild(this.node);
  }

  getSnapshotBeforeUpdate(prevProps) {
    const prevParent = getParentElement(prevProps.parentSelector);
    const nextParent = getParentElement(this.props.parentSelector);
    return { prevParent, nextParent };
  }

  componentDidUpdate(prevProps, _, snapshot) {
    const { isOpen, portalClassName } = this.props;

    if (prevProps.portalClassName !== portalClassName) {
      this.node.className = portalClassName;
    }

    const { prevParent, nextParent } = snapshot;
    if (nextParent !== prevParent) {
      prevParent.removeChild(this.node);
      nextParent.appendChild(this.node);
    }

    // Stop unnecessary renders if modal is remaining closed
    if (!prevProps.isOpen && !isOpen) return;
  }

  componentWillUnmount() {
    if (!this.node || !this.portal) return;

    const state = this.portal.state;
    const now = Date.now();
    const closesAt =
      state.isOpen &&
      this.props.closeTimeoutMS &&
      (state.closesAt || now + this.props.closeTimeoutMS);

    if (closesAt) {
      if (!state.beforeClose) {
        this.portal.closeWithTimeout();
      }

      setTimeout(this.removePortal, closesAt - now);
    } else {
      this.removePortal();
    }
  }

  removePortal = () => {
    const parent = getParentElement(this.props.parentSelector);
    parent.removeChild(this.node);
  };

  portalRef = ref => {
    this.portal = ref;
  };

  renderPortal = props => {
    const portal = createPortal(
      this,
      <ModalPortal defaultStyles={ModalContent.defaultStyles} {...props} />,
      this.node
    );
    this.portalRef(portal);
  };

  render () {

    if (!this.node) {
      this.node = document.createElement("div");
    }

    return createPortal(
      <ModalPortal
        ref={this.portalRef}
        defaultStyles={ModalContent.defaultStyles}
        {...this.props}
      />,
      this.node
    );
  }
}

// polyfill(ModalContent);

export default ModalContent;



