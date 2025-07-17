import React, { useState } from "react";
import { pluck } from "../../helpers";
import { ESCAPE_KEYS, useEventListener } from "../../shared/UseEventListener";

const AddProductModifier = (props) => {
    const { product, closeModifierModel, addProductInToCart } = props;
    /* console.log(product); */
    const [modifiers, setModifiers] = useState(product.modifiers ?? []);
    const ids = product.modifiers ? pluck(product.modifiers, 'id') : [];
    const [modifierIds, setModifierIds] = useState(new Set(ids));

    const closeModel = () => {
        closeModifierModel();
    }

    // User for Close the model on Escape
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            closeModifierModel();
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    const addModifierToCart = (variation) => {
        if (!isModifierExist(variation.id)) {
            // Update the modifier
            setModifiers([...modifiers, variation]);
            setModifierIds(new Set([...modifierIds, variation.id]));
        } else {
            // remove the modifier
            setModifiers(modifiers.filter((e) => e.id !== variation.id));
            modifierIds.delete(variation.id)
            setModifierIds(modifierIds);
        }
    }

    const isModifierExist = (variationId) => {
        return modifierIds.has(variationId);
    }

    const addProductToCart = () => {
        let cartProduct = product;
        cartProduct.modifiers = modifiers;
        addProductInToCart(cartProduct);
    }

    const loadVariants = (variation, key) => {
        return (
            <div
                className={`${isModifierExist(variation.id) ? 'add-product-modal__active-block' : ''} add-product-modal__source-block`}
                key={key}
                onClick={() => addModifierToCart(variation)}>
                <div className="text-center">
                    <p className="add-product-modal__type-items w-100 mb-0">{variation.name}</p>
                    <p className="add-product-modal__price-label w-100 mb-0">{parseFloat(variation.sell_price_inc_tax).toFixed(2)} SR</p>
                </div>
            </div>
        )
    }

    const loadModifier = (modifier, index) => {
        return (
            <div className="add-product-modal__main-box bg-secondary" key={index}>
                <h6 className="top-title py-1 px-4  mb-0">
                    {modifier.name}
                </h6>
                <div
                    className="add-product-modal__source-btn-grp py-1 px-2 d-flex flex-wrap mb-1">
                    {modifier.variations.map((variation, key) => {
                        return loadVariants(variation, key);
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="add-product-modal pos-modal">
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
                                        Modifiers
                                    </h5>
                                    {product.modifier_products.length === 0 ? '' :
                                        <button type="button"
                                            className="btn btn-primary modal-btn-modifier modal-footer-btn table-modal__add-btn mt-0 custom_add_modifier_btn"
                                            onClick={addProductToCart}>
                                            Add
                                        </button>
                                    }
                                    <h5 className="modal-title"
                                        id="addProductModalLabel">
                                        {product.product_name}
                                    </h5>
                                </div>
                            </div>
                            <div className="custom-scrollbar">
                                <div className="col-12 product-height">
                                    {product.modifier_products.length !== 0 ? product.modifier_products.map((modifier, index) => {
                                        return loadModifier(modifier, index);
                                    }) : <h3 className="text-center active py-3">
                                        No Modifier Available
                                    </h3>}
                                </div>
                            </div>
                            <div className="text-end d-none">

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
export default AddProductModifier;
