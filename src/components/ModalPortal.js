import React, { Component } from "react";
import * as focusManager from "../helpers/focusManager";
import scopeTab from "../helpers/scopeTab";

const CLASS_NAMES = {
  overlay: "ReactModal__Overlay",
  content: "ReactModal__Content"
};

const TAB_KEY = 9;
const ESC_KEY = 27;

export default class ModalPortal extends Component {

  static defaultProps = {
    style: {
      overlay: {},
      content: {}
    },
    defaultStyles: {}
  };

  constructor (props) {
    super(props);

    this.state = {
      afterOpen: false,
      beforeClose: false
    };

    this.shouldClose = null;
  }

  componentDidMount () {
    if (this.props.isOpen) {
      this.open();
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (process.env.NODE_ENV !== "production") {
      if (prevProps.bodyOpenClassName !== this.props.bodyOpenClassName) {
        // eslint-disable-next-line no-console
        console.warn(
          'React-Modal: "bodyOpenClassName" prop has been modified. ' +
          "This may cause unexpected behavior when multiple modals are open."
        );
      }
      if (prevProps.htmlOpenClassName !== this.props.htmlOpenClassName) {
        // eslint-disable-next-line no-console
        console.warn(
          'React-Modal: "htmlOpenClassName" prop has been modified. ' +
          "This may cause unexpected behavior when multiple modals are open."
        );
      }
    }

    if (this.props.isOpen && !prevProps.isOpen) {
      this.open();
    } else if (!this.props.isOpen && prevProps.isOpen) {
      this.close();
    }

    // Focus only needs to be set once when the modal is being opened
    if (
      this.props.shouldFocusAfterRender &&
      this.state.isOpen &&
      !prevState.isOpen
    ) {
      this.focusContent();
    }
  }

  componentWillUnmount () {
    this.afterClose();
    clearTimeout(this.closeTimer);
  }

  setOverlayRef = overlay => {
    this.overlay = overlay;
    this.props.overlayRef && this.props.overlayRef(overlay);
  };

  setContentRef = content => {
    this.content = content;
    this.props.contentRef && this.props.contentRef(content);
  };

  beforeOpen () {
    const {
      appElement,
      htmlOpenClassName,
      bodyOpenClassName
    } = this.props;

  }

  afterClose = () => {
    const {
      appElement,
      htmlOpenClassName,
      bodyOpenClassName
    } = this.props;

    if (this.props.shouldFocusAfterRender) {
      if (this.props.shouldReturnFocusAfterClose) {
        focusManager.returnFocus();
        focusManager.teardownScopedFocus();
      } else {
        focusManager.popWithoutFocus();
      }
    }
  };

  open = () => {
    this.beforeOpen();
    if (this.state.afterOpen && this.state.beforeClose) {
      clearTimeout(this.closeTimer);
      this.setState({ beforeClose: false });
    } else {
      if (this.props.shouldFocusAfterRender) {
        focusManager.setupScopedFocus(this.node);
        focusManager.markForFocusLater();
      }

      this.setState({ isOpen: true }, () => {
        this.setState({ afterOpen: true });

        if (this.props.isOpen && this.props.onAfterOpen) {
          this.props.onAfterOpen();
        }
      });
    }
  };

  close = () => {
    if (this.props.closeTimeoutMS > 0) {
      this.closeWithTimeout();
    } else {
      this.closeWithoutTimeout();
    }
  };

  // Don't steal focus from inner elements
  focusContent = () =>
    this.content && !this.contentHasFocus() && this.content.focus();

  closeWithTimeout = () => {
    const closesAt = Date.now() + this.props.closeTimeoutMS;
    this.setState({ beforeClose: true, closesAt }, () => {
      this.closeTimer = setTimeout(
        this.closeWithoutTimeout,
        this.state.closesAt - Date.now()
      );
    });
  };

  closeWithoutTimeout = () => {
    this.setState(
      {
        beforeClose: false,
        isOpen: false,
        afterOpen: false,
        closesAt: null
      },
      this.afterClose
    );
  };

  handleKeyDown = event => {
    if (event.keyCode === TAB_KEY) {
      scopeTab(this.content, event);
    }

    if (this.props.shouldCloseOnEsc && event.keyCode === ESC_KEY) {
      event.stopPropagation();
      this.requestClose(event);
    }
  };

  handleOverlayOnClick = event => {
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }

    if (this.shouldClose && this.props.shouldCloseOnOverlayClick) {
      if (this.ownerHandlesClose()) {
        this.requestClose(event);
      } else {
        this.focusContent();
      }
    }
    this.shouldClose = null;
  };

  handleContentOnMouseUp = () => {
    this.shouldClose = false;
  };

  handleOverlayOnMouseDown = event => {
    if (!this.props.shouldCloseOnOverlayClick && event.target == this.overlay) {
      event.preventDefault();
    }
  };

  handleContentOnClick = () => {
    this.shouldClose = false;
  };

  handleContentOnMouseDown = () => {
    this.shouldClose = false;
  };

  requestClose = event =>
    this.ownerHandlesClose() && this.props.onRequestClose(event);

  ownerHandlesClose = () => this.props.onRequestClose;

  shouldBeClosed = () => !this.state.isOpen && !this.state.beforeClose;

  contentHasFocus = () =>
    document.activeElement === this.content ||
    this.content.contains(document.activeElement);

  buildClassName = (which, additional) => {
    const classNames =
      typeof additional === "object"
        ? additional
        : {
          base: CLASS_NAMES[ which ],
          afterOpen: `${CLASS_NAMES[ which ]}--after-open`,
          beforeClose: `${CLASS_NAMES[ which ]}--before-close`
        };
    let className = classNames.base;
    if (this.state.afterOpen) {
      className = `${className} ${classNames.afterOpen}`;
    }
    if (this.state.beforeClose) {
      className = `${className} ${classNames.beforeClose}`;
    }
    return typeof additional === "string" && additional
      ? `${className} ${additional}`
      : className;
  };

  attributesFromObject = (prefix, items) =>
    Object.keys(items).reduce((acc, name) => {
      acc[ `${prefix}-${name}` ] = items[ name ];
      return acc;
    }, {});

  render () {
    const { className, overlayClassName, defaultStyles } = this.props;
    const contentStyles = className ? {} : defaultStyles.content;
    const overlayStyles = overlayClassName ? {} : defaultStyles.overlay;

    return this.shouldBeClosed() ? null : (
      <div
        ref={this.setOverlayRef}
        className={this.buildClassName("overlay", overlayClassName)}
        style={{ ...overlayStyles, ...this.props.style.overlay }}
        onClick={this.handleOverlayOnClick}
        onMouseDown={this.handleOverlayOnMouseDown}
        aria-modal="true"
      >
        <div
          ref={this.setContentRef}
          style={{ ...contentStyles, ...this.props.style.content }}
          className={this.buildClassName("content", className)}
          tabIndex="-1"
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleContentOnMouseDown}
          onMouseUp={this.handleContentOnMouseUp}
          onClick={this.handleContentOnClick}
          role={this.props.role}
          aria-label={this.props.contentLabel}
          {...this.attributesFromObject("aria", this.props.aria || {})}
          {...this.attributesFromObject("data", this.props.data || {})}
        >
          {this.props.children}
        </div>
      </div>
    );
  }


}


