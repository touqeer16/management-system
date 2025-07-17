import React from 'react';
import { ESCAPE_KEYS, useEventListener } from '../../shared/UseEventListener';
import {connect} from "react-redux";

const DeleteSuspendedSales = (props) => {

    const { onClickDeleteSuspendSales, deleteSuspendSale, title, heading } = props;

    // User for Close the model on Escape
    function handler ({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            onClickDeleteSuspendSales();
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    return (
        <div className="customer-modal delete-modal">
            <div
                className="modal-dialog modal-dialog-centered hide-show-dialog delete-content">
                <div className="modal-content px-2 px-sm-4 py-2">
                    <button type="button" className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onClickDeleteSuspendSales}
                            onKeyPress={onClickDeleteSuspendSales}>X
                    </button>
                    <div className="modal-body">
                        <div className="row">
                            <div
                                className="col-sm-10 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4">
                                <div
                                    className="mb-3 pe-lg-2 me-lg-1 mt-0 mt-lg-0">
                                    <h4 className="modal-title border-bottom border-4 mb-3 pend-sm-90 mb-sm-4 mb-md-3 mt-sm-0 mt-2"
                                        id="deleteModal">{heading}</h4>
                                </div>
                                <p className="heading-model text-start">{title}</p>
                            </div>
                            <div className="text-end">
                                {/*<div className="print-data">*/}
                                {/*    {isCheck && <PrintData ref={componentRef} paymentPrint={paymentPrints}/> }*/}
                                {/*</div>*/}
                                <div
                                    className="d-flex justify-content-end mt-4 align-items-center">
                                    {/*{isCheck ? <ReactToPrint*/}
                                    {/*        trigger={() =>*/}
                                    {/*            <div onClick={onClickDeleteSuspendSales}><button type="button"*/}
                                    {/*                               onClick={onClickDeleteSuspendSales}*/}
                                    {/*                               className="btn btn-primary modal-Yes-btn"*/}
                                    {/*                               aria-label="Print">*/}
                                    {/*          Yes*/}
                                    {/*            </button></div>}*/}
                                    {/*        content={() => componentRef.current}*/}
                                    {/*    /> :*/}
                                        <button
                                        className="btn btn-primary modal-Yes-btn"
                                        aria-label="login"
                                        onClick={deleteSuspendSale}>
                                        Yes
                                    </button>
                                    {/*}*/}
                                    <button
                                        className="btn btn-primary model-No-btn"
                                        aria-label="Close"
                                        onClick={onClickDeleteSuspendSales}
                                        onKeyPress={onClickDeleteSuspendSales}>
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(null, {})(DeleteSuspendedSales);
