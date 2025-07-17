import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { cashCloseRegister, fetchCloseRegister, fetchRegisterDetailsFromIndexDB } from "../../store/action/closeRegisterAction";
import moment from "moment";
import { ESCAPE_KEYS, useEventListener } from "../../shared/UseEventListener";

const CloseRegisterDetail = (props) => {
    const { onCloseRegisterModal, fetchCloseRegister, fetchRegisterDetailsFromIndexDB, closeRegisters, cashCloseRegister, user } = props;
    const [isWifiConnection, setIsWifiConnection] = useState(true);
    const [registerInputs, setRegisterInputs] = useState({
        closing_amount: 0,
        closing_note: '',
        total_expense: 0,
        remainder_cash_in_hand: 0,
    });
    const [errors, setErrors] = useState({
        closing_amount: '',
    });
    const [totalPayment, setTotalPayment] = useState(0);

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
        setRegisterInputs(inputs => ({ ...inputs, ['closing_amount']: totalPayment }));
    }, [totalPayment]);

    useEffect(() => {
        if (closeRegisters.length !== 0) {
            setTotalPayment(closeRegisters.register_details.net_payment_new ? (parseFloat(closeRegisters.register_details.net_payment_new)).toFixed(2) : 0.00);
        }
    }, [closeRegisters])

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!registerInputs["closing_amount"]) {
            errorss["closing_amount"] = "Please Enter Your Total Cash";
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const handleChange = (e) => {
        e.persist();
        setRegisterInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    };

    const prepareFormData = () => {
        const formData = new FormData();
        formData.append('closing_amount', registerInputs.closing_amount);
        formData.append('closing_note', registerInputs.closing_note);
        formData.append('total_expense', registerInputs.total_expense);
        formData.append('remainder_cash_in_hand', registerInputs.remainder_cash_in_hand);
        formData.append('user_id', user ? user.id : 0);
        return formData;
    };



    useEffect(() => {
        if (!isWifiConnection) {
            fetchRegisterDetailsFromIndexDB();
        } else {
            fetchCloseRegister();
        }


    }, []);

    const closeRegister = (formData) => {
        const valid = handleValidation();
        if (valid) {
            cashCloseRegister(prepareFormData(formData));
            onCloseRegisterModal();
        } else {
            cashCloseRegister(prepareFormData(formData));
            onCloseRegisterModal();
        }
    };

    // User for Close the model on Escape
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            onCloseRegisterModal();
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    if (closeRegisters.length === 0) {
        return ''
    }

    return (
        <div className="customer-modal pos-modal current-modal">
            <div
                className="modal-dialog modal-dialog-centered hide-show-dialog">
                <div
                    className="modal-content border-0 px-2 px-sm-4 py-2">
                    <button type="button" className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={onCloseRegisterModal}
                        onKeyPress={onCloseRegisterModal}>X
                    </button>
                    <div className="modal-body">
                        <div className="row">
                            <div
                                className="col-lg-11 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4">
                                <div
                                    className="pe-lg-2 me-lg-1 mt-0 mt-sm-5 mt-lg-0">
                                    <h5 className="modal-title payment-modal__top-title border-bottom border-4 mb-3 pend-sm-90 mb-sm-4 mb-md-3 mt-sm-0 mt-5"
                                        id="paymentModalLabel">
                                        Current Register
                                        ({moment(closeRegisters.register_details.open_time).format('Do MMM, YYYY h:mm A')} - {moment(closeRegisters.register_details.close_time).format('Do MMM, YYYY h:mm A')})
                                    </h5>
                                    <div
                                        className="current-modal__new-customer">
                                        <table
                                            className="table current-table">
                                            <tbody
                                                className="current-body">
                                                <tr className="">
                                                    <th>
                                                        Total payments - المبلغ الإجمالي:
                                                    </th>
                                                    <td>
                                                        <b>
                                                            <span className="display_currency" data-currency_symbol="true">
                                                                {closeRegisters.register_details.total_payment_new ? parseFloat(closeRegisters.register_details.total_payment_new).toFixed(2) : 0.00}﷼
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
                                                                {closeRegisters.register_details.all_card_new ? (parseFloat(closeRegisters.register_details.all_card_new)).toFixed(2) : 0.00}﷼
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
                                                            {closeRegisters.register_details.total_prepaid ? parseFloat(closeRegisters.register_details.total_prepaid).toFixed(2) : 0.00}﷼
                                                        </span></b>
                                                    </td>
                                                </tr>


                                                {/* None */}
                                                <tr className="d-none">
                                                    <td>
                                                        Cash Payment:
                                                    </td>
                                                    <td>
                                                        <span
                                                            className="display_currency" data-currency_symbol="true">
                                                            {closeRegisters.register_details.total_cash ? parseFloat(closeRegisters.register_details.total_cash).toFixed(2) : 0.00}﷼
                                                        </span>
                                                    </td>
                                                </tr>


                                                <tr className="d-none">
                                                    <td>
                                                        Total Sales:
                                                    </td>
                                                    <td>
                                                        <span
                                                            className="display_currency"
                                                            data-currency_symbol="true">{closeRegisters.register_details.total_sale ? parseFloat(closeRegisters.register_details.total_sale).toFixed(2) : 0.00} ﷼ </span>
                                                    </td>
                                                </tr>

                                                <tr className="success custom-success d-none">
                                                    <th>
                                                        Total Payment:
                                                    </th>
                                                    <td>
                                                        <b><span
                                                            className="display_currency" data-currency_symbol="true">
                                                            {totalPayment} ﷼
                                                        </span></b>
                                                    </td>
                                                </tr>
                                                <tr className="">
                                                    <th>
                                                        Total Cash - كاش الإجمالي:
                                                    </th>
                                                    <td style={{ "text-align": "right;" }}>
                                                        <b><span
                                                            className="display_currency" data-currency_symbol="true">
                                                            {closeRegisters.register_details.all_cash_new ? (parseFloat(closeRegisters.register_details.all_cash_new)).toFixed(2) : 0.00}﷼
                                                        </span></b>


                                                    </td>
                                                </tr>

                                                <tr className="success custom-success">
                                                    <th>
                                                        Total Return:
                                                    </th>
                                                    <td>
                                                        <b><span
                                                            className="display_currency" data-currency_symbol="true">
                                                            {closeRegisters.register_details.total_refund_cash_new ? (parseFloat(closeRegisters.register_details.total_refund_cash_new)).toFixed(2) : 0.00}﷼
                                                        </span></b>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <hr className="current_register" />

                                        <table
                                            className="table current-table">
                                            <tbody className="current-body" style={{ "text-align": "right;" }}>


                                                <tr className="success">
                                                    <th>
                                                        Custody in the drawer -    العهدة في الدرج:
                                                    </th>
                                                    <td style={{ "text-align": "right;" }}>
                                                        <b><span className="display_currency" data-currency_symbol="true">
                                                            {closeRegisters.register_details.cash_in_hand ? parseFloat(closeRegisters.register_details.cash_in_hand).toFixed(2) : 0.00} ﷼
                                                        </span></b>
                                                    </td>
                                                </tr>
                                                <tr className="success">
                                                    <th>
                                                        Total expense - إجمالي المصروف:
                                                    </th>
                                                    <td style={{ "text-align": "right;" }}>
                                                        <input
                                                            className="form-control input_number"
                                                            value={registerInputs.total_expense}
                                                            name="total_expense"
                                                            type="number"
                                                            id="total_expense"
                                                            onChange={(e) => handleChange(e)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="success">
                                                    <th>
                                                        Remainder of the Custody -  متبقى من العهدة:
                                                    </th>
                                                    <td style={{ "text-align": "right;" }}>
                                                        <input
                                                            className="form-control input_number"
                                                            value={registerInputs.remainder_cash_in_hand}
                                                            name="remainder_cash_in_hand"
                                                            type="number"
                                                            id="remainder_cash_in_hand"
                                                            onChange={(e) => handleChange(e)}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <hr className="current_register" />

                                        <div className="row">
                                            <div className="col-sm-4">
                                                <div
                                                    className="form-group custom-group d-none">
                                                    <label
                                                        htmlFor="closing_amount"
                                                        className="mb-2">Total
                                                        Cash:*</label>
                                                    <input
                                                        className="form-control input_number"
                                                        required
                                                        value={registerInputs.closing_amount}
                                                        name="closing_amount"
                                                        type="number"
                                                        id="closing_amount"
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                    <span className="required"
                                                        style={{ color: "red" }}>{errors["closing_amount"] ? errors["closing_amount"] : null}</span>
                                                </div>
                                            </div>


                                            <div className="col-sm-12">
                                                <div
                                                    className="form-group custom-group">
                                                    <label htmlFor="closing_note" className="mb-2">
                                                        Closing Note:
                                                    </label>
                                                    <textarea
                                                        className="form-control close-textarea"
                                                        placeholder="Closing Note"
                                                        rows="3"
                                                        value={registerInputs.closing_note}
                                                        name="closing_note"
                                                        cols="50"
                                                        id="closing_note"
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div
                                                className="col-xs-6 mb-3">
                                                <b>User : </b>
                                                {closeRegisters.register_details.user_name ? closeRegisters.register_details.user_name : 'N/A'}
                                                <br />
                                                <b>Email : </b>
                                                {closeRegisters.register_details.email ? closeRegisters.register_details.email : 'N/A'}
                                                <br />
                                                <b>Business Location : </b>
                                                {closeRegisters.register_details.location_name ? closeRegisters.register_details.location_name : 'N/A'}
                                                <br />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button"
                                    className="btn btn-default current-text current-footer-btn"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={onCloseRegisterModal}
                                    onKeyPress={onCloseRegisterModal}>Cancel
                                </button>
                                <button type="submit"
                                    className="btn btn-primary current-footer-btn"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => closeRegister()}
                                    onKeyPress={onCloseRegisterModal}>Close Register
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-overlay"
                onClick={onCloseRegisterModal}
                role="button" tabIndex="0"
                aria-label="background overlay"
                onKeyDown={onCloseRegisterModal}>{ }</div>
        </div >
    )
}

CloseRegisterDetail.propTypes = {
    fetchCloseRegister: PropTypes.func,
    fetchRegisterDetailsFromIndexDB: PropTypes.func,
    cashCloseRegister: PropTypes.func,
};

const mapStateToProps = (state) => {
    const { closeRegisters, cashRegister, user } = state;
    return { closeRegisters, cashRegister, user };
};

export default connect(mapStateToProps, { fetchCloseRegister, fetchRegisterDetailsFromIndexDB, cashCloseRegister })(CloseRegisterDetail);
