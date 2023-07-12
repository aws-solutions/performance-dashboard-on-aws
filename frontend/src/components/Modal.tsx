/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import ReactModal from "react-modal";
import "./Modal.css";
import { useTranslation } from "react-i18next";

interface PathParams {
    isOpen: boolean;
    closeModal: () => void;
    title: string;
    message: string | React.ReactNode;
    buttonType: string;
    buttonAction: () => void;
    ariaHideApp?: boolean;
}

function Modal(props: PathParams) {
    const { t } = useTranslation();
    return (
        <ReactModal
            isOpen={props.isOpen}
            onRequestClose={() => {
                props.closeModal();
            }}
            className="modal usa-modal"
            overlayClassName="overlay"
            shouldFocusAfterRender={true}
            shouldReturnFocusAfterClose={true}
            aria={{
                labelledby: t("title"),
                describedby: t("message"),
                modal: "true",
            }}
            ariaHideApp={true}
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
                        ariaLabel={t("GlobalClose")}
                    >
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="margin-right-1"
                            size="1x"
                            style={{ marginTop: "5px" }}
                        />
                    </Button>
                </div>
            </div>
            <div id="message" className="font-sans-md margin-top-2 margin-bottom-6">
                {props.message}
            </div>

            <Button type="button" variant="base" onClick={props.buttonAction}>
                {props.buttonType}
            </Button>
        </ReactModal>
    );
}

export default Modal;
