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
  buttonType: "Delete" | "Publish";
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
      shouldFocusAfterRender={false}
      ariaHideApp={props.ariaHideApp !== false}
    >
      <div className="clearfix">
        <div
          className="float-left"
          style={{
            maxWidth: "80%",
          }}
        >
          <h2 className="margin-top-0">{props.title}</h2>
        </div>
        <div className="float-right font-sans-md">
          <Button
            variant="unstyled"
            type="button"
            className="margin-left-1"
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
      <div className="font-sans-md margin-top-2 margin-bottom-4">
        {props.message}
      </div>

      <Button type="button" variant="base" onClick={props.buttonAction}>
        {props.buttonType}
      </Button>
      <Button
        variant="unstyled"
        type="button"
        className="margin-left-1"
        onClick={props.closeModal}
      >
        Cancel
      </Button>
    </ReactModal>
  );
}

export default Modal;
