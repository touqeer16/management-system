import React, { useState } from 'react';
import { ESCAPE_KEYS, useEventListener } from '../../shared/UseEventListener';
import { deleteTransaction, fetchFinalTransaction } from "../../store/action/recentTransactionAction";
import Select from 'react-select';
import PropTypes from "prop-types";
import { toast } from 'react-toastify';
import { connect } from "react-redux";
const CartDeleteModal = (props) => {

    const { onClickDeleteTransaction, deleteTransaction, deleteTransactions, setIsDeleteModal, fetchFinalTransaction, transactionID } = props;

    const [showcID, setshowcID] = useState(false);
    const [showOtherReason, setshowOtherReason] = useState(false);
    const [customerInputs, setCustomerInputs] = useState({
        return_reason: '',
        return_payment_method: '',
        card_transaction_id: '',
        return_reason_other: '',
    });
    const [errors, setErrors] = useState({
        return_reason: '',
        return_payment_method: '',
        card_transaction_id: '',
        return_reason_other: ''
    });

    // User for Close the model on Escape
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            onClickDeleteTransaction();
        }
    }

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!customerInputs["return_reason"]) {
            errorss["return_reason"] = "Please enter your return reason";
        } else if ((showOtherReason) && (!customerInputs["return_reason_other"])) {
            errorss["return_reason_other"] = "Please enter your return reason";
        } else if (!customerInputs["return_payment_method"]) {
            errorss["return_payment_method"] = "Please enter return payment";
        } else if ((showcID) && (!customerInputs["card_transaction_id"])) {
            errorss["card_transaction_id"] = "Please enter return card trsaction ID";
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };
    const handleChange = (e) => {
        e.persist();
        setCustomerInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    };
    const checkdeleteTransactions = (formData) => {
        const valid = handleValidation();

        if (valid) {
            formData = prepareFormData(formData);
            /* const dataBlank = {
                return_reason: '',
                return_payment_method: '',
                card_transaction_id: '',
                return_reason_other: ''
            }
            setCustomerInputs(dataBlank); */

            deleteTransaction(formData, (cb) => {

                if (cb.status) {
                    toast.success(cb.msg, { position: toast.POSITION.TOP_RIGHT });
                    setIsDeleteModal(false);
                    fetchFinalTransaction('final');
                } else {
                    toast.success("Sale not deleted", { position: toast.POSITION.TOP_RIGHT });
                }

            });
        }
    }

    const prepareFormData = () => {
        const formData = new FormData();
        formData.append('transactionID', transactionID);
        formData.append('return_reason', customerInputs.return_reason);
        formData.append('return_payment_method', customerInputs.return_payment_method);
        formData.append('card_transaction_id', customerInputs.card_transaction_id);
        formData.append('return_reason_other', customerInputs.return_reason_other);
        return formData;
    };


    const showotherReason = (e) => {
        e.persist();
        if (e.target.value == 'other') {
            setshowOtherReason(true);
        } else {
            setshowOtherReason(false);
        }
        //setCustomerInputs(inputs => ({ ...inputs, ['selectBox']: selectedOptions }));
        setCustomerInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    }

    const showCardInputID = (e) => {
        e.persist();
        if (e.target.value == 'card') {
            setshowcID(true);
        } else {
            setshowcID(false);
        }
        setCustomerInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    return (
        <div className="customer-modal delete-modal" dir="rtl">
            <div
                className="modal-dialog modal-dialog-centered hide-show-dialog delete-content">
                <div className="modal-content px-2 px-sm-4 py-2">
                    <button type="button" className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={onClickDeleteTransaction}
                        onKeyPress={onClickDeleteTransaction}>X
                    </button>
                    <div className="modal-body">
                        <div className="row">
                            <div
                                className="col-sm-12 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4">

                                <div className="mb-3 pe-lg-2 me-lg-1 mt-0 mt-lg-0">
                                    <h4 className="modal-title border-bottom border-4 mb-3 pend-sm-90 mb-sm-4 mb-md-3 mt-sm-0 mt-2"
                                        id="deleteModal">Return</h4>
                                </div>

                                <p className="heading-model text-center">
                                    هل انت متأكد أنك تريد استرجاع الطلب ؟
                                </p>
                                <form>
                                    <div className="bg-secondary p-3">
                                        <div className="row align-items-center">
                                            <label className="col-sm-5 col-5 modal-subtitle col-form-label">
                                                اختر سبب الاسترجاع :*
                                            </label>
                                            <div className="col-sm-7 col-7 field-w-100 form-group">
                                                <select name="return_reason" className="form-control" onChange={(e) => showotherReason(e)}>
                                                    <option value="">--select--</option>
                                                    <option value="العميل لا يريد الطلب"> العميل لا يريد الطلب</option>
                                                    <option value="تم اضافته عن طريق الخطأ">تم اضافته عن طريق الخطأ</option>
                                                    <option value="other">سبب اخر </option>
                                                </select>
                                                <span className="required"
                                                    style={{ color: "red" }}>{errors["return_reason"] ? errors["return_reason"] : null}</span>
                                            </div>
                                            {showOtherReason ?
                                                <div className="bg-secondary px-3 mt-2">
                                                    <div className="row align-items-center mb-3">
                                                        <label className="col-sm-5 col-5 modal-subtitle col-form-label">
                                                            سبب اخر:
                                                        </label>
                                                        <div className="col-sm-7 col-7 field-w-100">
                                                            <input type="text" required
                                                                id="customerName"
                                                                name="return_reason_other"
                                                                className="form-control"
                                                                onChange={(e) => handleChange(e)}
                                                            />
                                                            <span className="required"
                                                                style={{ color: "red" }}>{errors["return_reason_other"] ? errors["return_reason_other"] : null}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''
                                            }
                                        </div>
                                        <div className="row align-items-center">
                                            <label className="col-sm-5 col-5 modal-subtitle col-form-label">
                                                طريقة الدفع في الأسترجاع *:
                                            </label>
                                            <div className="col-sm-7 col-7 field-w-100 form-group ">
                                                <select name="return_payment_method" className="form-control" onChange={(e) => showCardInputID(e)} >
                                                    <option value="">--select--</option>
                                                    <option value="cash">كاش </option>
                                                    <option value="card">شبكه</option>
                                                </select>
                                                <span className="required"
                                                    style={{ color: "red" }}>{errors["return_payment_method"] ? errors["return_payment_method"] : null}</span>
                                            </div>

                                            {showcID ?
                                                <div className="bg-secondary px-3 mt-1">
                                                    <div className="row align-items-center mb-3">
                                                        <label className="col-sm-5 col-5 modal-subtitle col-form-label">
                                                            رقم عملية الإرجاع للبطاقه:
                                                        </label>
                                                        <div
                                                            className="col-sm-7 col-7 field-w-100">
                                                            <input type="text" required
                                                                id="customerName"
                                                                name="card_transaction_id"
                                                                className="form-control"
                                                                onChange={(e) => handleChange(e)}
                                                            />
                                                            <span className="required"
                                                                style={{ color: "red" }}>{errors["card_transaction_id"] ? errors["card_transaction_id"] : null}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''
                                            }
                                        </div>
                                    </div>

                                </form>

                            </div>
                            <div className="text-end">
                                <div
                                    className="d-flex justify-content-end mt-4 align-items-center">
                                    <button type="button" onClick={() => checkdeleteTransactions()}
                                        className="btn btn-primary modal-btn mt-3 mx-lg-3 modal-footer-btn">
                                        تأكيد الاسترجاع
                                    </button>

                                    <button
                                        className="btn btn-primary modal-Yes-btn d-none"
                                        aria-label="login"
                                        onClick={deleteTransactions}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="btn btn-danger model-No-btn "
                                        aria-label="Close"
                                        onClick={onClickDeleteTransaction}
                                        onKeyPress={onClickDeleteTransaction}>
                                        إلغاء
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

/* CartDeleteModal.propTypes = {
    deleteTransaction: PropTypes.func
}; */
/* const mapStateToProps = (state) => {
    const { user, recentTransactions, isLoading } = state;
    return { user, recentTransactions, isLoading };
}; */

export default connect(null, { deleteTransaction, fetchFinalTransaction })(CartDeleteModal);

//export default CartDeleteModal;
