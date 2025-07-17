import React, { useEffect, useRef, useState } from 'react';
import { ESCAPE_KEYS, useEventListener } from '../../shared/UseEventListener';
import { PrintDataDynamicData, PrintData } from "../../components/Payment/Payment";
const SuspendItemAddModal = (props) => {


    const { onClickSuspendItemModal, suspendedItem, user, transactionDetails, printShow } = props;

    const componentRef = useRef();

    // User for Close the model on Escape
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            onClickSuspendItemModal();
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    const loadPrintBlock = () => {
        return (
            <div>
                <div className={''}>

                    {printShow ? <PrintData ref={componentRef} paymentPrint={transactionDetails} user={user} /> : ''}

                </div>
            </div>
        );
    }

    return (
        <div className="customer-modal delete-modal">
            <div
                className="modal-dialog modal-dialog-centered hide-show-dialog delete-content">
                <div className="modal-content px-2 px-sm-4 py-2">
                    <button type="button" className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={onClickSuspendItemModal}
                        onKeyPress={onClickSuspendItemModal}>X
                    </button>
                    <div className="modal-body">
                        <div className="row">
                            <div
                                className="col-sm-10 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4">
                                <div
                                    className="mb-3 pe-lg-2 me-lg-1 mt-0 mt-lg-0">
                                    <h4 className="modal-title border-bottom border-4 mb-3 pend-sm-90 mb-sm-4 mb-md-3 mt-sm-0 mt-2"
                                        id="deleteModal">Alert</h4>
                                </div>
                                <p className="heading-model text-start">
                                    Are you sure want to add order on Hold?
                                </p>
                            </div>
                            <div className="text-end">
                                <div
                                    className="d-flex justify-content-end mt-4 align-items-center">
                                    <button
                                        className="btn btn-primary modal-Yes-btn"
                                        aria-label="login"
                                        onClick={suspendedItem}>
                                        Yes
                                    </button>
                                    <button
                                        className="btn btn-primary model-No-btn"
                                        aria-label="Close"
                                        onClick={onClickSuspendItemModal}
                                        onKeyPress={onClickSuspendItemModal}>
                                        No
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-overlay" onClick={onClickSuspendItemModal}
                role="button" tabIndex="0" aria-label="background overlay"
                onKeyDown={onClickSuspendItemModal}>{ }</div>
        </div>
    );
};

export default SuspendItemAddModal;
