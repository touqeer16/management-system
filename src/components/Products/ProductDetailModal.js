import React, { useEffect, useState } from "react";
import { ESCAPE_KEYS, useEventListener } from "../../shared/UseEventListener";
import { ModalFooter } from "react-bootstrap";

export const toFixedTrunc = (x, n) => {
    const abc = typeof x === 'string' ? x : x.toString();
    const v = abc.split('.');
    if (n <= 0) return v[0];
    let f = v[1] || '';
    if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
    while (f.length < n) f += '0';
    return `${v[0]}.${f}`
}
const ProductDetailModal = (props) => {
    const { clickProductDetailModal, cartProduct, onProductUpdateInCart } = props;
    const [product, setProduct] = useState(cartProduct);
    const [unitPrice, setUnitPrice] = useState('');
    const [unitPriceInctax, setUnitPriceInctax] = useState('');
    const [sellingPriceInctax, setSellingPriceInctax] = useState('');
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState('');
    const [selectWarranty, setSelectWarranty] = useState('');
    const [selectTax, setSelectedTax] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        setProduct(cartProduct);
        setUnitPrice(parseFloat(cartProduct.unit_price).toFixed(2));
        setUnitPriceInctax(parseFloat(cartProduct.unit_price_inc_tax).toFixed(2));
        setSellingPriceInctax(parseFloat(cartProduct.sell_price_inc_tax).toFixed(2));
        setDiscount(product.discount.discount_amount ? parseFloat(product.discount.discount_amount).toFixed(2) : 0);
        setDiscountType(product.discount.discount_type);
        setSelectWarranty(cartProduct.warranty_id);
        setSelectedTax(cartProduct.tax_id ? cartProduct.tax_id : cartProduct.tax_dropdown && cartProduct.tax_dropdown.id);
        setDescription(cartProduct.sell_line_note);
    }, [cartProduct]);

    // User for Close the model on Escape
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            onCloseDetailModal();
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    if (!cartProduct) {
        return ''
    }

    const onChangeUnitPrice = (e) => {
        setUnitPrice(e.target.value);
    };

    const onChangeUnitPriceIncTax = (e) => {
        setUnitPriceInctax(e.target.value);
        setSellingPriceInctax(e.target.value);
    };

    const onChangeDiscount = (e) => {
        const value = e.target.value ? e.target.value : " ";
        setDiscount(value);
    };

    const onCloseDetailModal = () => {
        clickProductDetailModal();
    };

    const onSaveDetailModal = () => {

        const newProduct = product;
        const modifiers = newProduct.modifiers;
        let modifierPrice = 0;

        const new_tax_dropdown = product.tax_dropdown;
        const tax_percent_amount = new_tax_dropdown.amount;
        const tax_percentAdd = ((tax_percent_amount + 100) / 100);
        const tax_percent = (tax_percent_amount / 100);

        let unit_price_inc_tax = 0;
        let sell_price_inc_tax = 0;
        let unit_price = 0;
        let modifierPrice_inc_tax_percentage = 0;
        let modifierPrice_inc_tax = 0;
        let unit_price_inc_tax_new = newProduct.unit_price_inc_tax;
        modifiers.forEach(modifier => {
            modifierPrice = modifier.sell_price_inc_tax;
            //toFixedTrunc(modifier.sell_price_inc_tax, 2);
            if (discountType == 'percentage') {
                modifierPrice_inc_tax_percentage = (((modifierPrice / 100) * discount));
                // modifierPrice_inc_tax = (modifierPrice - modifierPrice_inc_tax_percentage);
            } else {
                // modifierPrice_inc_tax = (modifierPrice - discount);
            }
        });

        if (discountType == 'percentage') {
            let unit_price_inc_tax_percentage = (((unitPriceInctax / 100) * discount));
            unit_price_inc_tax = ((unitPriceInctax) - unit_price_inc_tax_percentage);
            unit_price_inc_tax = (unit_price_inc_tax);
            //unit_price_inc_tax = (unit_price_inc_tax + parseFloat(modifierPrice));
            /* let sell_price_inc_tax_percentage = (((sellingPriceInctax / 100) * discount));
            sell_price_inc_tax = ((sellingPriceInctax) - sell_price_inc_tax_percentage); */
            /*  newProduct.discount.discount_amount = unit_price_inc_tax_percentage; */
            sell_price_inc_tax = (unitPriceInctax);
        } else {
            //unit_price_inc_tax = ((unitPriceInctax));
            unit_price_inc_tax = ((unitPriceInctax) - discount);
            unit_price_inc_tax = (unit_price_inc_tax);
            /*  sell_price_inc_tax = ((sellingPriceInctax) - discount); */
            sell_price_inc_tax = (unitPriceInctax);
            /*  newProduct.discount.discount_amount = discount; */
        }
        unit_price = (unit_price_inc_tax / tax_percentAdd);
        const newTax_amount = ((unit_price * tax_percent));
        /*  newTax_amount = newTax_amount.toString(); */
        unit_price_inc_tax = (unit_price + newTax_amount);
        unit_price = (unit_price + parseFloat(modifierPrice_inc_tax));
        unit_price_inc_tax = (unit_price_inc_tax + parseFloat(modifierPrice_inc_tax));
        setUnitPrice(unit_price);
        setUnitPriceInctax(unit_price_inc_tax);
        setSellingPriceInctax(sell_price_inc_tax);
        newProduct.unit_price = unit_price;
        newProduct.unit_price_inc_tax = unit_price_inc_tax;
        newProduct.sell_price_inc_tax = sell_price_inc_tax;
        newProduct.discount.discount_amount = discount;


        /* newProduct.discount.discount_amount = discount;
        newProduct.unit_price = unitPrice;
        newProduct.unit_price_inc_tax = unitPriceInctax; */
        newProduct.discount.discount_type = discountType;
        newProduct.warranty_id = selectWarranty;
        newProduct.tax_id = selectTax;
        newProduct.sell_line_note = description;
        onProductUpdateInCart(newProduct);
        clickProductDetailModal();
    };

    const onChangeSelectBox = (e) => {
        setDiscountType(e.target.value)
    };

    const onSelectTax = (event) => {
        setSelectedTax(event.target.value);
    };

    const onSelectWarranty = (event) => {
        setSelectWarranty(event.target.value);
    };

    const onChangeDescription = (event) => {
        setDescription(event.target.value);
    }

    return (
        <div className="customer-modal pos-modal">
            <div className="modal-dialog modal-dialog-centered hide-show-dialog">
                <div className="modal-content border-0 px-2 px-sm-4 py-2">
                    <button type="button" className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => onCloseDetailModal()}
                        onKeyPress={() => onCloseDetailModal()}>X
                    </button>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-lg-11 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4">
                                <div className="mb-5 pe-lg-2 me-lg-1 mt-0 mt-sm-5 mt-lg-0">
                                    <h5 className="modal-title payment-modal__top-title border-bottom border-4 mb-3 pend-sm-90 mb-sm-4 mb-md-3 mt-sm-0 mt-4"
                                        id="paymentModalLabel">
                                        {product.product_name} - {product.product_id}
                                    </h5>
                                    <div className="customer-modal__select-customer bg-secondary p-3 pb-5">
                                        <div className="row align-items-center">
                                            <div className="d-none">
                                                <label htmlFor="searchCustomer"
                                                    className="col-12 modal-subtitle col-form-label ">
                                                    Unit Price:
                                                </label>
                                                <div className="col-12 field-w-100">
                                                    <input disabled={!product.edit_price}
                                                        name="amount"
                                                        type="number"
                                                        className="form-control amount-input"
                                                        onChange={onChangeUnitPrice}
                                                        value={unitPrice}
                                                    />
                                                </div>
                                            </div>

                                            <div className="">
                                                <label htmlFor="searchCustomer"
                                                    className="col-12 modal-subtitle col-form-label ">
                                                    Selling Price (Inc Tax):
                                                </label>
                                                <div className="col-12 field-w-100">
                                                    <input disabled={!product.edit_price}
                                                        name="amount"
                                                        type="number"
                                                        className="form-control amount-input"
                                                        onChange={onChangeUnitPriceIncTax}
                                                        value={unitPriceInctax}
                                                    />
                                                </div>
                                            </div>


                                            <div className="col-6 col-xs-12 col-sm-6 field-w-100">
                                                <label htmlFor="searchCustomer"
                                                    className="col-6 col-xs-12 col-sm-6 modal-subtitle col-form-label">
                                                    Discount Type:
                                                </label>
                                                <select className="form-control select2 input-border"
                                                    id="searchCustomer"
                                                    disabled={!product.edit_discount}
                                                    onChange={(e) => onChangeSelectBox(e)}
                                                    value={discountType}
                                                >
                                                    <option value="fixed">Fixed</option>
                                                    <option value="percentage">Percentage</option>
                                                </select>
                                                {product.discount.formated_ends_at ?
                                                    <div>
                                                        Discount: Dics applied (Ends
                                                        at: {product.discount.formated_ends_at})
                                                    </div>
                                                    : ''}
                                            </div>

                                            <div className="col-6 col-xs-12 col-sm-6 field-w-100">
                                                <label htmlFor="searchCustomer"
                                                    className="col-6 col-xs-12 col-sm-6 modal-subtitle col-form-label">
                                                    Discount Amount:
                                                </label>
                                                <input id="courseDurationInput" type="number" min="0" pattern="[0-9]*"
                                                    onChange={(e) => onChangeDiscount(e)}
                                                    className="form-control amount-input"
                                                    aria-describedby="search customer"
                                                    value={discount}
                                                    disabled={!product.edit_discount}
                                                />
                                            </div>

                                            {product.enabled_tax &&
                                                <div className="col-6 col-xs-12 col-sm-6">
                                                    <label htmlFor="searchCustomer"
                                                        className="col-6 col-xs-12 col-sm-6 modal-subtitle col-form-label">
                                                        Tax:
                                                    </label>
                                                    <select className="form-control select2 input-border"
                                                        id="searchCustomer"
                                                        onChange={(e) => onSelectTax(e)}
                                                        value={selectTax}>
                                                        <option value=' '>Please select</option>
                                                        {product.all_tax_dropdown.length !== 0 && product.all_tax_dropdown.map((tax, index) => {
                                                            return (
                                                                <option value={tax.id} className="option-drop new"
                                                                    key={index}>{tax.name}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            }

                                            {product.enabled_warranties &&
                                                <div className="col-6 col-xs-12 col-sm-6">
                                                    <label htmlFor="warranty"
                                                        className="col-6 col-xs-12 col-sm-6 modal-subtitle col-form-label">
                                                        Warranty:
                                                    </label>

                                                    <select className="form-control select2 input-border" id="warranty"
                                                        onChange={onSelectWarranty} value={selectWarranty}>
                                                        <option value="Please select">Please select</option>
                                                        {product.warranties.map((warranty, index) => {
                                                            return (
                                                                <option value={warranty.id}
                                                                    className="option-drop new"
                                                                    key={index}>{warranty.name}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            }

                                            <label htmlFor="searchCustomer"
                                                className="col-12 modal-subtitle col-form-label d-none">
                                                Description:
                                            </label>
                                            <div className="col-12 field-w-100">
                                                <div className="overflow-hidden textarea-box d-none">
                                                    <textarea id="searchCustomer" value={description}
                                                        onChange={(e) => onChangeDescription(e)}
                                                        className="form-control amount-input description-input"
                                                        aria-describedby="search customer" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="d-none">Add product IMEI, Serial number or other informations here.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-end">
                                <button type="button"
                                    onClick={() => onSaveDetailModal()}
                                    onKeyPress={() => onSaveDetailModal()}
                                    className="btn btn-primary modal-btn modal-footer-btn customer-modal__add-btn mt-3">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-overlay"
                onClick={onCloseDetailModal}
                role="button" tabIndex="0"
                aria-label="background overlay"
                onKeyDown={onCloseDetailModal}>{ }</div>
        </div>
    )
};

export default ProductDetailModal;
