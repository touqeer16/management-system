import React from 'react';
import { ESCAPE_KEYS, useEventListener } from '../../shared/UseEventListener';

const DeleteModal = (props) => {

    const { closeConfirmationModel, onConfirm, item } = props;

    const closeModel = () => {
        closeConfirmationModel();
    };

    const onDelete = () => {
        onConfirm(item);
    };

    // User for Close the model on Escape
    function handler ({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            closeModel();
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    return (
        <div className="customer-modal delete-modal">
            <div
                className="modal-dialog modal-dialog-centered hide-show-dialog">
                <div className="modal-content px-2 px-sm-4 py-2">
                    <button type="button" className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={closeModel}
                            onKeyPress={closeModel}>X
                    </button>
                    <div className="modal-body">
                        <div className="row">
                            <div
                                className="col-sm-10 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4">
                                <div
                                    className="mb-3 pe-lg-2 me-lg-1 mt-0 mt-lg-0">
                                    <h4 className="modal-title border-bottom border-4 mb-3 pend-sm-90 mb-sm-4 mb-md-3 mt-sm-0 mt-2"
                                        id="deleteModal">Delete</h4>
                                </div>
                                <p className="heading-model text-start">Are you
                                    sure want to delete product?</p>
                            </div>
                            <div className="text-end">
                                <div
                                    className="d-flex justify-content-end mt-4 align-items-center">
                                    <button
                                        className="btn btn-primary modal-Yes-btn"
                                        aria-label="login" onClick={onDelete}>
                                        Yes
                                    </button>
                                    <button
                                        className="btn btn-primary model-No-btn"
                                        aria-label="Close"
                                        onClick={closeModel}
                                        onKeyPress={closeModel}>
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-overlay" onClick={closeModel}
                 role="button" tabIndex="0" aria-label="background overlay"
                 onKeyDown={closeModel}>{}</div>
        </div>
    );
};

export default DeleteModal;
