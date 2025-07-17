import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createNewCustomer, searchCustomer } from "../../store/action/customerAction";
import Select from 'react-select';
import '../scss/style.scss';
import { ESCAPE_KEYS, useEventListener } from "../../shared/UseEventListener";

const Customer = (props) => {
    const { createNewCustomer, searchCustomer, search, selectCustomer, customer } = props;
    const [isCustomerToggleModal, setIsCustomerToggleModal] = useState(false);
    const [customerInputs, setCustomerInputs] = useState({
        name: '',
        mobile: '',
        selectBox: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        mobile: '',
    });

    useEffect(() => {
        setCustomerInputs(inputs => ({ ...inputs, ['selectBox']: customer }));
    }, [customer])

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!customerInputs["name"]) {
            errorss["name"] = "Please enter your name";
        } else if (!customerInputs["mobile"]) {
            errorss["mobile"] = "Please enter your mobile";
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onCustomerClickToggleModal = () => {
        setIsCustomerToggleModal(!isCustomerToggleModal);
        selectCustomer(customerInputs.selectBox);
        setCustomerInputs(inputs => ({ ...inputs, ['name']: inputs["text"] }));
        setCustomerInputs(inputs => ({ ...inputs, ['mobile']: inputs["number"] }));
        setErrors('');
    };

    useEffect(() => {
        document.body.style.overflow = isCustomerToggleModal
            ? 'hidden'
            : 'unset';
    }, [isCustomerToggleModal]);

    const addCustomer = (formData) => {
        const valid = handleValidation();
        if (valid) {
            createNewCustomer(prepareFormData(formData));
            setIsCustomerToggleModal(false);
            const dataBlank = {
                name: '',
                mobile: ''
            }
            setCustomerInputs(dataBlank);
            selectCustomer(customerInputs.selectBox);
        }
    };

    const handleChange = (e) => {
        e.persist();
        setCustomerInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    };

    const prepareFormData = () => {
        const formData = new FormData();
        formData.append('name', customerInputs.name);
        formData.append('mobile', customerInputs.mobile);
        // formData.append('contact_id', customerInputs.selectBox.id);
        return formData;
    };

    const handleSearch = (event) => {
        searchCustomer(event);
    };

    const handleChangeSelect = (selectedOptions) => {
        setCustomerInputs(inputs => ({ ...inputs, ['selectBox']: selectedOptions }));
    }

    const searchList = [];
    search.forEach(function (element) {
        searchList.push({ id: element.id, label: element.text });
    });

    // User for Close the model on Escape
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            setIsCustomerToggleModal(false);
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    const displayLabel = () => {
        return (<button type="button"
            className="btn text-primary w-100 h-100 coustom-hover"
            data-bs-toggle="modal"
            data-bs-target="#customerModal"
            onClick={onCustomerClickToggleModal}
        >
            Customer
        </button>)
    }

    if (!isCustomerToggleModal) {
        return displayLabel();
    }

    return (
        <div>
            {displayLabel()}
            <div className='customer-modal pos-modal'>
                <div
                    className="modal-dialog modal-dialog-centered hide-show-dialog">
                    <div className="modal-content border-0 px-2 px-sm-4 py-2">
                        <button type="button" className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onCustomerClickToggleModal}
                            onKeyPress={onCustomerClickToggleModal}>X
                        </button>
                        <div className="modal-body">
                            <div className="row">
                                <div
                                    className="col-lg-11 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4">
                                    <div
                                        className="mb-5 pe-lg-2 me-lg-1 mt-0 mt-sm-5 mt-lg-0">
                                        <h5 className="modal-title payment-modal__top-title border-bottom border-4 mb-3 pend-sm-90 mb-sm-4 mb-md-3 mt-sm-0 mt-4"
                                            id="paymentModalLabel">
                                            Select Customer
                                        </h5>
                                        <form>
                                            <div
                                                className="customer-modal__select-customer bg-secondary p-3 pb-5">
                                                <div
                                                    className="row align-items-center">
                                                    <label htmlFor="searchCustomer"
                                                        className="col-sm-3 col-4 modal-subtitle col-form-label">
                                                        Search Customer:
                                                    </label>
                                                    <div className="col-sm-9 col-8 field-w-100">
                                                        <Select
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            options={searchList}
                                                            value={customerInputs.selectBox}
                                                            placeholder="Search..."
                                                            openMenuOnClick={false}
                                                            onInputChange={(e) => handleSearch(e)}
                                                            onChange={handleChangeSelect}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="customer-modal__new-customer bg-secondary px-3 mb-5 pt-5 pb-5">
                                                <h6 className="modal-inner-title mb-4 pt-3">
                                                    New customer
                                                </h6>
                                                <div
                                                    className="row align-items-center mb-3">
                                                    <label htmlFor="searchCustomer"
                                                        className="col-sm-3 col-4 modal-subtitle col-form-label">
                                                        Name*:
                                                    </label>
                                                    <div
                                                        className="col-sm-9 col-8 field-w-100">
                                                        <input type="text" required value={customerInputs.name}
                                                            id="customerName"
                                                            name="name"
                                                            className="form-control amount-input"
                                                            aria-describedby="search customer"
                                                            onChange={(e) => handleChange(e)}
                                                        />
                                                        <span className="required"
                                                            style={{ color: "red" }}>{errors["name"] ? errors["name"] : null}</span>
                                                    </div>
                                                </div>
                                                <div className="row align-items-center">
                                                    <label htmlFor="searchCustomer"
                                                        className="col-sm-3 col-4 modal-subtitle col-form-label">
                                                        Mobile*:
                                                    </label>
                                                    <div className="col-sm-9 col-8 field-w-100">
                                                        <input type="number" required value={customerInputs.mobile}
                                                            id="customerMobile"
                                                            name="mobile"
                                                            className="form-control amount-input"
                                                            aria-describedby="search customer"
                                                            onChange={(e) => handleChange(e)}
                                                        />
                                                        <span className="required"
                                                            style={{ color: "red" }}>{errors["mobile"] ? errors["mobile"] : null}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <button type="button"
                                        className="btn btn-primary modal-btn modal-footer-btn customer-modal__add-btn mt-3"
                                        onClick={() => addCustomer()}>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-overlay" onClick={onCustomerClickToggleModal}
                    role="button" tabIndex="0" aria-label="background overlay"
                    onKeyDown={onCustomerClickToggleModal}>{ }</div>
            </div>
        </div>
    )
};

Customer.propTypes = {
    createNewCustomer: PropTypes.func,
    searchCustomer: PropTypes.func,
};
const mapStateToProps = (state) => {
    const { customers, search } = state;
    return { customers, search };
};

export default connect(mapStateToProps, { createNewCustomer, searchCustomer })(Customer);
