import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useReactToPrint } from "react-to-print";
import { connect } from "react-redux";
import { PrintData, PrintDataDynamicData } from "../../components/Payment/Payment";
import { sendPrintApi } from "../../../src/store/action/finalizePaymentAction";
import { fetchTableData } from "../../store/action/tableAction";
import {
    deleteAllSuspendedSales, deleteSuspendedSales, editSuspendedSales, fetchSuspendedSales
} from "../../store/action/suspendedSalesAction";
import moment from "moment";
import DeleteSuspendedSales from "./DeleteSuspendedSales";
import { ESCAPE_KEYS, useEventListener } from "../UseEventListener";

const SuspendedSalesModal = (props) => {
    const { onPauseClickToggleModal, fetchSuspendedSales, fetchTableData, suspendedSales, onSelectTable, deleteSuspendedSales, deleteAllSuspendedSales, editSuspendedSales, user } = props;
    const [printShow, setPrintShow] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [deleteSuspendSalesModal, setDeleteSuspendSalesModal] = useState(false);
    const [deleteAllSalesModal, setDeleteAllSalesModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const componentRef = useRef();
    useEffect(() => {
        fetchSuspendedSales();
    }, []);

    // User for Close the model on Escape
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            onPauseClickToggleModal();
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    const deleteSuspendSale = (salesId) => {
        deleteSuspendedSales(salesId);
        setDeleteSuspendSalesModal(false);
        fetchTableData(user.location_id);
    };

    const deleteAllSuspendSale = (allSales) => {
        deleteAllSuspendedSales(allSales);
        setDeleteAllSalesModal(false);
        onPauseClickToggleModal(true);
    };

    const editSuspendSale = (salesId, tableID) => {
        onSelectTable(tableID);
        editSuspendedSales(salesId);
        fetchTableData(user.location_id);
        onPauseClickToggleModal(false);
    };

    const onClickDeleteSuspendSales = (id) => {
        setDeleteId(id);
        setDeleteSuspendSalesModal(!deleteSuspendSalesModal);

    };

    const onClickAllDeleteSuspendSales = () => {
        setDeleteAllSalesModal(!deleteAllSalesModal);
    };
    const printSuspendSale = (transaction) => {
        console.log(transaction);
        setTransactionDetails(transaction);
        setPrintShow(true);
        handlePrint();
    };
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });



    const loadPrintBlock = () => {
        return (
            <div>
                <div className={'d-none'}>
                    {printShow ? <PrintDataDynamicData ref={componentRef} paymentPrint={transactionDetails.print} user={user} /> : ''}
                    {printShow ? <PrintData ref={componentRef} paymentPrint={transactionDetails.print} user={user} /> : ''}
                    <button id="printReceiptHold" onClick={handlePrint}>Print this out!</button>
                </div>
            </div>
        );
    }
    const loadSuspendedSales = (suspendedSale, index) => {
        return (
            <div
                className="card custom-pause-card" key={index}>
                <ul className="list-group list-group-flush border-0" key={index}>

                    <li className="list-group-item border-0 custom-color mb-1">
                        {suspendedSale.additional_notes}
                    </li>
                    <li className="list-group-item border-0 custom-color mb-1">
                        Order Type. {suspendedSale.order_name}
                    </li>
                    <li className="list-group-item border-0 custom-color p-0">
                        Mobile No. {suspendedSale.mobile}
                    </li>
                    <li className="list-group-item border-0 custom-color p-0">
                        Name. {suspendedSale.name}
                    </li>
                    <li className="list-group-item border-0 custom-color p-0">
                        Order No. {suspendedSale.call_no}
                    </li>
                    <li className="list-group-item border-0 custom-color p-0">
                        Invoice No. {suspendedSale.invoice_no}
                    </li>
                    <li className="list-group-item border-0 custom-color p-0">
                        {moment(suspendedSale.sale_date).format('MM/DD/YYYY')}
                    </li>
                    <li className="list-group-item border-0 custom-color fw-bold mb-2 p-0">
                        <i className="fas fa-user me-1" />
                        {suspendedSale.name}
                    </li>
                    <li onClick={() => editSuspendSale(suspendedSale.id, suspendedSale.res_table_id)} className="list-group-item border-0 custom-color fw-bold mb-2 p-0">
                        <i className="fas fa-table me-1" />
                        {suspendedSale.table_name}
                    </li>
                    <li className="list-group-item border-0 custom-color fw-bold mb-2 p-0">
                        <i className="fas fa-solid fa-hotel me-1" />
                        {suspendedSale.waiter}
                    </li>
                    <li className="list-group-item border-0 custom-color p-0">
                        <i className="fas fa-cubes me-1" />Total
                        Items: {suspendedSale.total_items}
                    </li>
                    <li className="list-group-item border-0 custom-color p-0 mb-3">
                        <i className="fas fa-money-bill-alt me-1" />Total:
                        {parseFloat(suspendedSale.final_total).toFixed(2)}﷼
                    </li>
                </ul>

                {/*  <button type="button" onMouseEnter={() => printSuspendSale(suspendedSale)} onClick={handlePrint}
                    className="list-group-item border-0 custom-success">
                    Print<i className="fa fa-print text-muted fa-x" aria-hidden="true" title="Click to print" />
                </button> */}
                <button type="button" onClick={() => printSuspendSale(suspendedSale)}
                    className="list-group-item border-0 custom-success">
                    Print<i className="fa fa-print text-muted fa-x" aria-hidden="true" title="Click to print" />
                </button>

                <button type="button" onClick={() => editSuspendSale(suspendedSale.id, suspendedSale.res_table_id)}
                    className="list-group-item border-0 custom-right">
                    Edit Sale<i className="fas fa-arrow-circle-right ms-1" />
                </button>

                <button type="button" onClick={() => onClickDeleteSuspendSales(suspendedSale.id)}
                    className="list-group-item border-0 custom-trash">
                    Returned<i className="fas fa-undo ms-1" />
                </button>
                {deleteSuspendSalesModal &&
                    <DeleteSuspendedSales onClickDeleteSuspendSales={onClickDeleteSuspendSales}
                        deleteSuspendSale={() => deleteSuspendSale(deleteId)}
                        title={"Are you sure want to returned sale?"} heading={"Returned"}
                    />}
                {loadPrintBlock()}
            </div>
        )
    };

    if (suspendedSales.length === 0) {
        return ''
    };

    return (
        <div className=" pause-modal pos-modal">
            <div
                className="modal-dialog modal-dialog-centered hide-show-dialog">
                <div
                    className="modal-content px-2 px-sm-4 py-2">
                    <button type="button" className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={onPauseClickToggleModal}
                        onKeyPress={onPauseClickToggleModal}>X
                    </button>
                    <div className="modal-body">
                        <div className="row">
                            <div
                                className="col-lg-11 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4 custom-sales">
                                <div
                                    className=" pe-lg-2 me-lg-1 mt-0 mt-sm-5 mt-lg-0 customer-modal__select-customer p-3 pb-4">
                                    <h5 className="modal-title payment-modal__top-title border-bottom border-4 mb-3 mb-sm-4 mb-md-3 mt-sm-0 mt-4"
                                        id="paymentModalLabel">
                                        On Hold Sales
                                    </h5>
                                    {deleteAllSalesModal &&
                                        <DeleteSuspendedSales onClickDeleteSuspendSales={onClickAllDeleteSuspendSales}
                                            deleteSuspendSale={() => deleteAllSuspendSale(suspendedSales.salesIds)}
                                            title={"Are you sure want to return sales?"} heading={"Returned"}
                                        />}

                                    <div className="row customer-modal__new-customer sales-scroll m-0">
                                        {
                                            suspendedSales.sales.length !== 0 ? suspendedSales.sales.map((suspendedSale, index) => {
                                                return loadSuspendedSales(suspendedSale, index)
                                            }) : <h3 className="text-center active py-3">No Suspended Sales
                                                Available</h3>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="pause-footer">
                                {suspendedSales.sales.length === 0 ? '' :
                                    <button
                                        onClick={onClickAllDeleteSuspendSales}
                                        className="btn modal-btn modal-footer-btn customer-modal__add-btn mt-3 pause_footer-btn">
                                        <i className="fas fa-undo me-1" />
                                        Returned All
                                    </button>
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-overlay"
                onClick={onPauseClickToggleModal}
                role="button" tabIndex="0"
                aria-label="background overlay"
                onKeyDown={onPauseClickToggleModal}>{ }</div>
        </div>
    )
};


SuspendedSalesModal.propTypes = {
    fetchSuspendedSales: PropTypes.func,
    deleteSuspendedSales: PropTypes.func,
    deleteAllSuspendedSales: PropTypes.func,
    editSuspendedSales: PropTypes.func,
};

const mapStateToProps = (state) => {
    const { suspendedSales, editSuspendedSale, user, locations } = state;
    return { suspendedSales, editSuspendedSale, user, locations };
};

export default connect(mapStateToProps, {
    fetchSuspendedSales,
    fetchTableData,
    deleteSuspendedSales,
    deleteAllSuspendedSales,
    editSuspendedSales
})(SuspendedSalesModal);
