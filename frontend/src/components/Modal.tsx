import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import ReactModal from "react-modal";
import "./Modal.css";

interface PathParams {
  isOpen: boolean;
  closeModal: Function;
  title: string;
  message: string;
  buttonType: "Delete" | "Publish" | "Archive" | "Create draft" | "Re-publish";
  buttonAction: Function;
  ariaHideApp?: boolean;
}

function Modal(props: PathParams) {
  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={() => {
        props.closeModal();
      }}
      className="modal"
      overlayClassName="overlay"
      shouldFocusAfterRender={false}
      aria={{
        labelledby: "title",
        describedby: "message",
      }}
      ariaHideApp={props.ariaHideApp !== false}
    >
      <div className="clearfix">
        <div
          className="float-left"
          style={{
            maxWidth: "80%",
          }}
        >
          <h2 id="title" className="margin-top-0">
            {props.title}
          </h2>
        </div>
        <div className="float-right font-sans-md">
          <Button
            variant="unstyled"
            type="button"
            className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
            onClick={props.closeModal}
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="margin-right-1"
              size="1x"
              style={{ marginTop: "5px" }}
            />
            Close
          </Button>
        </div>
      </div>
      <div id="message" className="font-sans-md margin-top-2 margin-bottom-6">
        {props.message}
      </div>

      <Button type="button" variant="base" onClick={props.buttonAction}>
        {props.buttonType}
      </Button>
      <Button
        variant="unstyled"
        type="button"
        className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
        onClick={props.closeModal}
      >
        Cancel
      </Button>
    </ReactModal>
  );
}

export default Modal;
