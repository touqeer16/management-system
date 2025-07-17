import { calculatePrice } from './CalculateProductPrice';

export default (formValues, locationId) => {
    const formData = new FormData();
    const { sub_type, clientCompany, orderType, search_product, pay_term_number, pay_term_type, price_group, tax_calculation_amount, lot_no_line_id, discount_type, discount_amount, cart, paymentCarts, changeReturn, finalTotal, suspended, customerId, transactionId, serviceId, tableId, saleNote, staffNote } = formValues[0];

    formData.append('location_id', locationId ? locationId : 0);
    formData.append('sub_type', sub_type ? sub_type : '');
    formData.append('contact_id', customerId ? customerId : 'no_customer_select');
    formData.append('search_product', search_product ? search_product : '');
    formData.append('pay_term_number', pay_term_number ? pay_term_number : '');
    formData.append('pay_term_type', pay_term_type ? pay_term_type : '');
    formData.append('price_group', price_group ? price_group : 0);
    formData.append('res_table_id', tableId ? tableId : '');
    formData.append('res_waiter_id', serviceId ? serviceId : '');
    formData.append('transaction_date', '');
    formData.append('transactionId', transactionId ? transactionId : null);
    formData.append('clientCompany', clientCompany ? clientCompany : '');
    formData.append('order_type_Id', orderType.id ? orderType.id : null);
    formData.append('order_type_name', orderType.order_name ? orderType.order_name : null);
    cart && cart.map((row, index) => {
        if (row.discount && row.discount.discount_amount) {
            if (row.discount.discount_type === "percentage") {
                row.discount.discount_type = "percentage";
            } else {
                row.discount.discount_type = "fixed";
            }
        }
        formData.append(`products[${index}][product_type]`, 'includes');
        formData.append(`products[${index}][unit_price]`, row.unit_price ? row.unit_price : '0.00');
        formData.append(`products[${index}][line_discount_type]`, row.discount ? row.discount.discount_type : 'fixed');
        formData.append(`products[${index}][line_discount_amount]`, row.discount ? row.discount.discount_amount : '0.00');
        formData.append(`products[${index}][item_tax]`, row.item_tax ? row.item_tax : '0.00');
        formData.append(`products[${index}][tax_id]`, row.tax_id && row.tax_type === 'inclusive' ? row.tax_id :
            row.tax_type === 'inclusive' ? row.tax_dropdown ? row.tax_dropdown.id : '' : '');
        formData.append(`products[${index}][sell_line_note]`, row.sell_line_note ? row.sell_line_note : '');
        formData.append(`products[${index}][lot_no_line_id]`, lot_no_line_id ? lot_no_line_id : '');
        formData.append(`products[${index}][product_id]`, row.product_id);
        formData.append(`products[${index}][variation_id]`, row.variation_id);
        formData.append(`products[${index}][enable_stock]`, row.enable_stock);
        formData.append(`products[${index}][quantity]`, row.quantity);
        formData.append(`products[${index}][product_unit_id]`, row.unit_id);
        formData.append(`products[${index}][base_unit_multiplier]`, '1');
        formData.append(`products[${index}][unit_price_exc_tax]`, row.unit_price ? row.unit_price : '0.00');
        formData.append(`products[${index}][unit_price_inc_tax]`, row.unit_price_inc_tax ? row.unit_price_inc_tax : '0.00');
        formData.append(`products[${index}][sell_price_inc_tax]`, row.sell_price_inc_tax ? row.sell_price_inc_tax : '0.00');

        row.modifiers && row.modifiers.map((modifier) => {
            formData.append(`products[${index}][modifier][]`, modifier.id);
            formData.append(`products[${index}][modifier_price][]`, modifier.default_sell_price);
            formData.append(`products[${index}][modifier_price_inc_tax][]`, modifier.sell_price_inc_tax);
            formData.append(`products[${index}][modifier_item_tax][]`, modifier.item_tax ? modifier.item_tax : '0.00');
            formData.append(`products[${index}][modifier_tax_id][]`, modifier.tax_id ? modifier.tax_id : '1');
            formData.append(`products[${index}][modifier_quantity][]`, row.quantity);
            formData.append(`products[${index}][modifier_set_id][]`, modifier.product_variation_id);
        })
    });

    formData.append('discount_type', discount_type ? discount_type : 'percentage');
    formData.append('discount_amount', discount_amount ? discount_amount : '0.00');
    formData.append('rp_redeemed', '0');
    formData.append('rp_redeemed_amount', '0');
    formData.append('tax_rate_id', '1');
    formData.append('tax_calculation_amount', tax_calculation_amount ? tax_calculation_amount : '0.00');
    formData.append('advance_balance', '0.00');

    paymentCarts && paymentCarts.map((payment, index) => {
        formData.append(`payment[${index}][amount]`, payment.amount);
        formData.append(`payment[${index}][method]`, payment.payment_type);
        formData.append(`payment[${index}][account_id]`, '');
        formData.append(`payment[${index}][card_number]`, '');
        formData.append(`payment[${index}][card_holder_name]`, '');
        formData.append(`payment[${index}][card_transaction_number]`, '');
        formData.append(`payment[${index}][card_type]`, 'credit');
        formData.append(`payment[${index}][card_month]`, '');
        formData.append(`payment[${index}][card_year]`, '');
        formData.append(`payment[${index}][card_security]`, '');
        formData.append(`payment[${index}][cheque_number]`, '');
        formData.append(`payment[${index}][bank_account_number]`, '');
        formData.append(`payment[${index}][transaction_no_1]`, '');
        formData.append(`payment[${index}][transaction_no_2]`, '');
        formData.append(`payment[${index}][transaction_no_3]`, '');
        formData.append(`payment[${index}][note]`, '');
    });

    formData.append('sale_note', saleNote ? saleNote : '');
    formData.append('staff_note', staffNote ? staffNote : '');
    formData.append('change_return', changeReturn ? changeReturn : '0');
    formData.append('additional_notes', '');
    formData.append('is_suspend', suspended ? suspended : 0);
    formData.append('recur_interval', '');
    formData.append('recur_interval_type', 'days');
    formData.append('recur_repetitions', '');
    formData.append('subscription_repeat_on', '');
    formData.append('is_enabled_stock', '');
    formData.append('final_total', finalTotal ? finalTotal : 0);
    formData.append('discount_type_modal', discount_type ? discount_type : 'percentage');
    formData.append('discount_amount_modal', discount_amount ? discount_amount : '0.00');
    formData.append('order_tax_modal', tax_calculation_amount ? tax_calculation_amount : '0.00');
    formData.append('shipping_details_modal', '');
    formData.append('shipping_address_modal', '');
    formData.append('shipping_charges_modal', '');
    formData.append('shipping_status_modal', '');
    formData.append('delivered_to_modal', '');
    formData.append('status', 'final');
    return formData;
}
