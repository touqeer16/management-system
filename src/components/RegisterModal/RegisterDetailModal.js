import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchRegisterDetails, fetchRegisterDetailsFromIndexDB } from "../../store/action/registerDetailsAction";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { ESCAPE_KEYS, useEventListener } from "../../shared/UseEventListener";

const RegisterDetailModal = (props) => {
    const { onRegisterClickToggleModal, fetchRegisterDetails, fetchRegisterDetailsFromIndexDB, registerDetails } = props;
    const componentRef = useRef();
    const [isWifiConnection, setIsWifiConnection] = useState(true);


    useEffect(() => {
        //every second check internet connection
        const interval = setInterval(() => {
            if (navigator.onLine) {
                setIsWifiConnection(true);
            } else {
                setIsWifiConnection(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isWifiConnection) {
            fetchRegisterDetailsFromIndexDB();
        } else {
            fetchRegisterDetails();
        }
    }, []);

    // User for Close the model on Escape
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            onRegisterClickToggleModal();
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    if (registerDetails.length === 0) {
        return ''
    }



    class PrintData extends React.Component {

        render() {
            return (
                <div className="col-lg-11 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4 p-2">
                    <div
                        className="mb-3 pe-lg-2 me-lg-1 mt-0 mt-sm-5 mt-lg-0">
                        <h5 style={{ "font-size": "16px" }} className="modal-title payment-modal__top-title border-bottom border-4 mb-3 pend-sm-90 mb-sm-4 mb-md-3 mt-sm-0 mt-4 details-title text-center"
                            id="paymentModalLabel">
                            Register Details
                            ({moment(registerDetails.register_details.open_time).format('Do MMM, YYYY h:mm A')} - {moment(registerDetails.register_details.close_time).format('Do MMM, YYYY h:mm A')})
                        </h5>
                        <div className="col-sm-12">
                            <table className="table">
                                <tbody className="d-inline-table w-100">
                                    <tr className="text-center">
                                        <th colSpan={2}>
                                            Payments
                                        </th>
                                    </tr>

                                    <tr>
                                        <td>
                                            {registerDetails.payment_types.cash}:
                                        </td>
                                        <td>
                                            <span
                                                className="display_currency"
                                                data-currency_symbol="true">{registerDetails.register_details.total_cash ? parseFloat(registerDetails.register_details.total_cash).toFixed(2) : 0.00}﷼</span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {registerDetails.payment_types.card}:
                                        </td>
                                        <td>
                                            <span
                                                className="display_currency" data-currency_symbol="true">
                                                {registerDetails.register_details.total_card ? parseFloat(registerDetails.register_details.total_card).toFixed(2) : 0.00}﷼</span>
                                        </td>
                                    </tr>

                                    {
                                        registerDetails && registerDetails.register_details.clientAppArray.map((client_app, index) => {
                                            let showPrepaidvalue = 'd-none';
                                            if (client_app.total_prepaid_value > 0) {
                                                showPrepaidvalue = '';
                                            }
                                            let showCashvalue = 'd-none';
                                            if (client_app.total_cash_value > 0) {
                                                showCashvalue = '';
                                            }
                                            let showCardvalue = 'd-none';
                                            if (client_app.total_card_value > 0) {
                                                showCardvalue = '';
                                            }

                                            return (
                                                <>
                                                    <tr className={`${showPrepaidvalue}`}>
                                                        <td>
                                                            {client_app.app_prepaid_tite}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className="display_currency"
                                                                data-currency_symbol="true">{client_app.total_prepaid_value ? parseFloat(client_app.total_prepaid_value).toFixed(2) : 0.00}﷼</span>
                                                        </td>
                                                    </tr>
                                                    <tr className={`${showCashvalue}`}>
                                                        <td>
                                                            {client_app.app_cash_tite}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className="display_currency"
                                                                data-currency_symbol="true">{client_app.total_cash_value ? parseFloat(client_app.total_cash_value).toFixed(2) : 0.00}﷼</span>
                                                        </td>
                                                    </tr>
                                                    <tr className={`${showCardvalue}`}>
                                                        <td>
                                                            {client_app.app_card_tite}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className="display_currency"
                                                                data-currency_symbol="true">{client_app.total_card_value ? parseFloat(client_app.total_card_value).toFixed(2) : 0.00}﷼</span>
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                    <tr className="">
                                        <th>
                                            Total payments - المبلغ الإجمالي:
                                        </th>
                                        <td>
                                            <b>
                                                <span className="display_currency d-none" data-currency_symbol="true">
                                                    {registerDetails.register_details.total_sale ? (parseFloat(registerDetails.register_details.total_sale) + parseFloat(registerDetails.register_details.cash_in_hand)).toFixed(2) : 0.00}﷼
                                                </span>
                                                <span className="display_currency" data-currency_symbol="true">
                                                    {registerDetails.register_details.total_payment_new ? parseFloat(registerDetails.register_details.total_payment_new).toFixed(2) : 0.00}﷼
                                                </span>
                                            </b>
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <th>
                                            Total Return - المسترد الإجمالي:
                                        </th>
                                        <td>
                                            <b>
                                                <span className="display_currency d-none" data-currency_symbol="true">
                                                    {registerDetails.register_details.total_sale ? (parseFloat(registerDetails.register_details.total_sale - registerDetails.details.transaction_details.total_sales).toFixed(2)) : 0.00}﷼

                                                </span>
                                                <span
                                                    className="display_currency d-none"
                                                    data-currency_symbol="true">{registerDetails.register_details.total_refund ? parseFloat(registerDetails.register_details.total_refund).toFixed(2) : 0.00}﷼
                                                </span>

                                                <span className="display_currency" data-currency_symbol="true">
                                                    -{registerDetails.register_details.total_refund_cash_new ? (parseFloat(registerDetails.register_details.total_refund_cash_new).toFixed(2)) : 0.00}﷼

                                                </span>
                                            </b>
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <th>
                                            Net Payment - صافي المبلغ:
                                        </th>
                                        <td>
                                            <b>
                                                <span className="display_currency d-none" data-currency_symbol="true">
                                                    {registerDetails.register_details.total_sale ? parseFloat((registerDetails.register_details.total_sale + registerDetails.register_details.cash_in_hand) - (registerDetails.register_details.total_sale - registerDetails.details.transaction_details.total_sales)).toFixed(2) : 0.00}﷼
                                                </span>
                                                <span className="display_currency" data-currency_symbol="true">
                                                    {registerDetails.register_details.net_payment_new ? parseFloat(registerDetails.register_details.net_payment_new).toFixed(2) : 0.00}﷼
                                                </span>
                                            </b>
                                        </td>
                                    </tr>
                                    <tr className="text-center">
                                        <th colSpan={2}>
                                            Net payments by type
                                        </th>

                                    </tr>

                                    <tr className="">
                                        <th>
                                            Total Cash - كاش الإجمالي:
                                        </th>
                                        <td>
                                            <b>
                                                <span
                                                    className="display_currency d-none" data-currency_symbol="true">
                                                    {registerDetails.register_details.all_cash_new ? (parseFloat(registerDetails.register_details.all_cash_new)).toFixed(2) : 0.00}﷼
                                                </span>
                                                <span
                                                    className="display_currency" data-currency_symbol="true">
                                                    {registerDetails.register_details.total_cash ? (parseFloat(registerDetails.register_details.total_cash) + parseFloat(registerDetails.register_details.total_app_cash)).toFixed(2) : 0.00}﷼
                                                </span>
                                            </b>
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <th>
                                            Total Card - شبكه الإجمالي:
                                        </th>
                                        <td>
                                            <b>
                                                <span
                                                    className="display_currency" data-currency_symbol="true">
                                                    {registerDetails.register_details.all_card_new ? (parseFloat(registerDetails.register_details.all_card_new)).toFixed(2) : 0.00}﷼
                                                </span>
                                                <span
                                                    className="display_currency d-none" data-currency_symbol="true">
                                                    {registerDetails.register_details.total_card ? (parseFloat(registerDetails.register_details.total_card) + parseFloat(registerDetails.register_details.total_app_card)).toFixed(2) : 0.00}﷼
                                                </span>
                                            </b>
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <th>
                                            Prepaid App - مدفوع تطبيقات
                                        </th>
                                        <td>
                                            <b><span
                                                className="display_currency" data-currency_symbol="true">
                                                {registerDetails.register_details.total_prepaid ? parseFloat(registerDetails.register_details.total_prepaid).toFixed(2) : 0.00}﷼
                                            </span></b>
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <th>
                                            Total Discount -  إجمالي الخصم
                                        </th>
                                        <td>
                                            <b><span
                                                className="display_currency" data-currency_symbol="true">
                                                {registerDetails.register_details.total_discount ? parseFloat(registerDetails.register_details.total_discount).toFixed(2) : 0.00}﷼
                                            </span></b>
                                        </td>
                                    </tr>
                                    <tr className="text-center">
                                        <th colSpan={2}>
                                            Monetary custody - عهده نقديه
                                        </th>

                                    </tr>
                                    <tr className="success">
                                        <td>
                                            <b> Custody in the drawer -    العهدة في الدرج:</b>
                                        </td>
                                        <td>
                                            <b> <span
                                                className="display_currency"
                                                data-currency_symbol="true">{registerDetails.register_details.cash_in_hand ? parseFloat(registerDetails.register_details.cash_in_hand).toFixed(2) : 0.00}﷼
                                            </span> </b>
                                        </td>
                                    </tr>
                                    <tr className="success">
                                        <td>
                                            <b> Total expense - إجمالي المصروف:</b>
                                        </td>
                                        <td>
                                            <input type="number" className="form-control input_number" name="total_expense" id="total_expense" />
                                        </td>
                                    </tr>
                                    <tr className="success">
                                        <td>
                                            <b> Remainder of the Custody -  متبقى من العهدة:</b>
                                        </td>
                                        <td>
                                            <input type="number" className="form-control input_number" name="remainder_cash_in_hand" id="remainder_cash_in_hand" />
                                        </td>
                                    </tr>

                                    {/* Hidden Div */}
                                    <tr className="d-none">
                                        <td>
                                            {registerDetails.payment_types.custom_pay_1}:
                                        </td>
                                        <td>
                                            <span
                                                className="display_currency"
                                                data-currency_symbol="true">{registerDetails.register_details.total_custom_pay_1 ? parseFloat(registerDetails.register_details.total_custom_pay_1).toFixed(2) : 0.00}﷼</span>
                                        </td>
                                    </tr>
                                    <tr className="success d-none">
                                        <th>
                                            Total Payment in Cash - إجمالي الدفع نقدا:
                                        </th>
                                        <td>
                                            <b><span
                                                className="display_currency" data-currency_symbol="true">
                                                {registerDetails.register_details.total_cash ? (parseFloat(registerDetails.register_details.total_cash) + parseFloat(registerDetails.register_details.cash_in_hand) - parseFloat(registerDetails.register_details.total_cash_refund)).toFixed(2) : 0.00}﷼
                                            </span></b>
                                        </td>
                                    </tr>
                                    <tr className="success d-none">
                                        <th>
                                            Total Prepaid -   مدفوع :
                                        </th>
                                        <td>
                                            <b><span
                                                className="display_currency" data-currency_symbol="true">
                                                {registerDetails.register_details.total_prepaid ? parseFloat(registerDetails.register_details.total_prepaid).toFixed(2) : 0.00}﷼
                                            </span></b>
                                        </td>
                                    </tr>
                                    <tr className="success d-none">
                                        <th>
                                            Total Cards -   بطاقة :
                                        </th>
                                        <td>
                                            <b><span
                                                className="display_currency" data-currency_symbol="true">
                                                {registerDetails.register_details.all_card_sales ? (parseFloat(registerDetails.register_details.all_card_sales).toFixed(2)) : 0.00}﷼
                                            </span></b>
                                        </td>
                                    </tr>
                                    <tr className="success d-none">
                                        <th>
                                            Credit Sales:
                                        </th>
                                        <td>
                                            <b>
                                                <span className="display_currency" data-currency_symbol="true">
                                                    {registerDetails.register_details.total_sale ? (parseFloat(registerDetails.details.transaction_details.total_sales - registerDetails.register_details.total_sale).toFixed(2)) : 0.00}﷼
                                                </span>
                                            </b>
                                        </td>
                                    </tr>
                                    <tr className="d-none">
                                        <td>
                                            {registerDetails.payment_types.cheque}:
                                        </td>
                                        <td>
                                            <span
                                                className="display_currency"
                                                data-currency_symbol="true">{registerDetails.register_details.total_cheque ? parseFloat(registerDetails.register_details.total_cheque).toFixed(2) : 0.00}﷼</span>
                                        </td>
                                    </tr>
                                    <tr className="d-none">
                                        <td>
                                            {registerDetails.payment_types.custom_pay_1} Payment:
                                        </td>
                                        <td>
                                            <span
                                                className="display_currency"
                                                data-currency_symbol="true">{registerDetails.register_details.total_custom_pay_1 ? parseFloat(registerDetails.register_details.total_custom_pay_1).toFixed(2) : 0.00}﷼</span>
                                        </td>
                                    </tr>
                                    <tr className="d-none">
                                        <td>
                                            {registerDetails.payment_types.bank_transfer}:
                                        </td>
                                        <td>
                                            <span
                                                className="display_currency"
                                                data-currency_symbol="true">{registerDetails.register_details.total_bank_transfer ? parseFloat(registerDetails.register_details.total_bank_transfer).toFixed(2) : 0.00}﷼</span>
                                        </td>
                                    </tr>
                                    <tr className="d-none">
                                        <td>
                                            {registerDetails.payment_types.advance} Payment:
                                        </td>
                                        <td>
                                            <span
                                                className="display_currency"
                                                data-currency_symbol="true">{registerDetails.register_details.total_advance ? parseFloat(registerDetails.register_details.total_advance).toFixed(2) : 0.00}﷼</span>
                                        </td>
                                    </tr>
                                    <tr className="d-none">
                                        <td>
                                            Other Payments:
                                        </td>
                                        <td>

                                            <span
                                                className="display_currency" data-currency_symbol="true">
                                                {registerDetails.register_details.total_other ? parseFloat(registerDetails.register_details.total_other).toFixed(2) : 0.00}﷼</span>
                                        </td>
                                    </tr>


                                </tbody >
                            </table>
                            <hr className="register-border" />

                            <div className="col-xs-6">
                                <b>User : </b>
                                {registerDetails.register_details.user_name ? registerDetails.register_details.user_name : 'N/A'}
                                <br />
                                <b>Email : </b>
                                {registerDetails.register_details.email ? registerDetails.register_details.email : 'N/A'}
                                <br />
                                <b>Business Location : </b>
                                {registerDetails.register_details.location_name ? registerDetails.register_details.location_name : 'N/A'}
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="register-modal pos-modal">
            <div
                className="modal-dialog modal-dialog-centered hide-show-dialog">
                <div
                    className="modal-content border-0 px-2 px-sm-4 py-2">
                    <button type="button"
                        className="btn-close custom-close-btn"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={onRegisterClickToggleModal}
                        onKeyPress={onRegisterClickToggleModal}>X
                    </button>
                    <div className="modal-body">
                        <div className="row">
                            <PrintData ref={componentRef} />
                            <div className="Register-footer">
                                <ReactToPrint
                                    trigger={() => <button type="button"
                                        className="btn btn-primary footer-btn me-2  modal-btn"
                                        aria-label="Print">
                                        <i className="fa fa-print me-1" />
                                        Print
                                    </button>}
                                    content={() => componentRef.current}
                                />
                                <button type="button"
                                    className="btn btn-default footer-btn  modal-btn bg-secondary"
                                    data-dismiss="modal"
                                    onClick={onRegisterClickToggleModal}
                                    onKeyPress={onRegisterClickToggleModal}>Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-overlay"
                onClick={onRegisterClickToggleModal}
                role="button" tabIndex="0"
                aria-label="background overlay"
                onKeyDown={onRegisterClickToggleModal}>{ }</div>
        </div>
    )
}

RegisterDetailModal.propTypes = {
    fetchRegisterDetails: PropTypes.func,
    fetchRegisterDetailsFromIndexDB: PropTypes.func,
};

const mapStateToProps = (state) => {
    const { registerDetails } = state;
    return { registerDetails };
};

export default connect(mapStateToProps, { fetchRegisterDetails, fetchRegisterDetailsFromIndexDB })(RegisterDetailModal);
