import React, { useState } from "react";
import { pluck } from "../../helpers";
import { ESCAPE_KEYS, useEventListener } from "../../shared/UseEventListener";

const AddOrderTypes = (props) => {
    const { product, carts, closeOrderTypes, addProductInToCart, locations, addOrderTypeInToCart, orderType } = props;


    const closeModel = () => {
        closeOrderTypes();
    }

    // User for Close the model on Escape
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            closeOrderTypes();
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);


    const addProductToCart = (type) => {
        addOrderTypeInToCart(type);
    }

    const loadOrderTypesName = (type, key) => {
        return (
            <div
                className={`${(orderType.id && orderType.id == type.id) ? 'add-orderType-modal__active-block' : ''} add-orderType-modal__source-block`}
                key={key}
                onClick={() => addProductToCart(type)}>
                <div className="text-center">
                    <p className="add-orderType-modal__type-items w-100 mb-0">{type.order_name}</p>
                    <input name="ordertype" className="add-orderType-modal__type-items w-100 mb-0" onChange={e => { }}  value={type.id} type="radio" checked={(orderType.id && orderType.id == type.id) ? 'checked' : ''} />
                </div>
            </div>
        )
    }

    const loadOrderTypes = (location, index) => {
        return (
            <div className="add-orderType-modal__main-box bg-secondary" key={index}>
                <div
                    className="add-orderType-modal__source-btn-grp py-1 px-2 d-flex flex-wrap mb-1">
                    {location.order_types.length !== 0 && location.order_types.map((orderType, key) => {
                        return loadOrderTypesName(orderType, key);
                    })}

                </div>
            </div>
        )
    }

    return (
        <div className="add-orderType-modal pos-modal">
            <div className="modal-dialog modal-dialog-centered hide-show-dialog">
                <div className="modal-content border-0 px-2 px-sm-4 py-0 custom_modifier_model" >
                    <button type="button" className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={closeModel}
                        onKeyPress={closeModel}>X
                    </button>
                    <div className="modal-body">
                        <div className="row">
                            <div
                                className="col-12 border-4 border-lg-end pend-sm-90 mb-sm-4 mb-lg-2 mb-md-3 mt-sm-0 mt-5">
                                <div
                                    className="border-bottom border-4 d-flex align-items-center justify-content-between mb-0">
                                    <h5 className="modal-title"
                                        id="addProductModalLabel">
                                        Order Types
                                    </h5>
                                    {/* <button type="button"
                                        className="btn btn-primary modal-btn-modifier modal-footer-btn table-modal__add-btn mt-0 custom_add_modifier_btn d-none"
                                        onClick={addProductToCart}>
                                        Add
                                    </button> */}
                                </div>
                            </div>
                            <div className="custom-scrollbar">
                                <div className="col-12 product-height">
                                    {locations.business_locations.length !== 0 ? locations.business_locations.map((location, index) => {
                                        return loadOrderTypes(location, index);
                                    }) : <h3 className="text-center active py-3">
                                        No Order Types Available
                                    </h3>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-overlay" onClick={closeModel}
                role="button" tabIndex="0" aria-label="background overlay"
                onKeyDown={closeModel}>{ }</div>
        </div>
    )
}
export default AddOrderTypes;
