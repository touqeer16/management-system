export const toFixedTrunc = (x, n) => {
    const abc = typeof x === 'string' ? x : x.toString();
    const v = abc.split('.');
    if (n <= 0) return v[0];
    let f = v[1] || '';
    if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
    while (f.length < n) f += '0';
    return `${v[0]}.${f}`
}

export const calculatePrice = (cartItem) => {

    /*  console.log("cartItem>>>", cartItem); */
    const tax = calculateTax(cartItem);
    const countUnitPrice = parseFloat(cartItem.unit_price);
    const sell_price_inc_tax = parseFloat(cartItem.sell_price_inc_tax);
    const unit_price_inc_tax = parseFloat(cartItem.unit_price_inc_tax);

    // let discount = cartItem.discount && cartItem.discount.discount_amount;
    const discount = (cartItem.discount ? parseFloat(cartItem.discount.discount_amount) : 0);
    const discountType = cartItem.discount && cartItem.discount.discount_type;
    let subTotalAmount = 0;
    let subTotalAmountSellingPrice = 0;
    if ((sell_price_inc_tax == unit_price_inc_tax) && discount) {
        if (discountType == 'percentage') {
            let unit_price_inc_tax_percentage = (((unit_price_inc_tax / 100) * discount));
            subTotalAmount = ((unit_price_inc_tax) - unit_price_inc_tax_percentage);
            subTotalAmountSellingPrice = ((subTotalAmount) + unit_price_inc_tax_percentage);

        } else {
            subTotalAmount = ((unit_price_inc_tax) - discount);
            subTotalAmountSellingPrice = (parseFloat(subTotalAmount) + parseFloat(discount));
        }

    } else {
        subTotalAmount = (unit_price_inc_tax);
        subTotalAmountSellingPrice = (sell_price_inc_tax);
    }
    const tax_percent_amount = ((tax + 100) / 100);
    const tax_percent_amount_multiply = (tax / 100);

    const amountTax = ((subTotalAmount / tax_percent_amount) * tax_percent_amount_multiply);
    cartItem.unit_price_inc_tax = parseFloat(subTotalAmount);
    cartItem.unit_price_exc_tax = parseFloat(subTotalAmount - amountTax);
    cartItem.unit_price = parseFloat(subTotalAmount - amountTax);
    cartItem.sell_price_inc_tax = parseFloat(subTotalAmountSellingPrice);
    cartItem.item_tax = parseFloat(amountTax);

    // prepare a price for single item
    let price = cartItem.tax_type === 'exclusive' ? +countUnitPrice : +countUnitPrice + amountTax;
    // prepare modifiers
    // const modifierPrice = calculateModifierAmount(cartItem);
    const qty = cartItem.quantity ?? 0;
    //const subAmount = price;
    //const subTotalAmount = sell_price_inc_tax;
    //const subTotalAmount = countUnitPrice;
    //const subTotalAmount = unit_price_inc_tax;
    //const discount = cartItem.discount && cartItem.discount.discount_amount ? countDiscount(cartItem, subTotalAmount) : 0;
    // const tax = calculateTax(cartItem);
    //let totalAmount = subTotalAmount - discount;
    let totalAmount = parseFloat(subTotalAmount);
    let fixTotalAmount = totalAmount.toFixed(2);
    let modifiersTax = 0;
    let totalModifierPrice = 0;

    if (cartItem.modifiers && cartItem.modifiers.length > 0) {
        let totalTax = 0;
        let unitprice = 0;
        cartItem.modifiers.forEach(modifier => {
            // if (modifier.tax_dropdown) {
            const modifierTax = calculateModifierTax(modifier);
            const tax_percent = ((modifierTax + 100) / 100);
            const tax_percent_multiply = (modifierTax / 100);
            const modifierPrice = toFixedTrunc(modifier.sell_price_inc_tax, 4);
            totalModifierPrice = totalModifierPrice + +modifierPrice;
            if (modifierTax > 0) {
                unitprice = (modifierPrice / tax_percent);
                totalTax = (unitprice * tax_percent_multiply);
                modifiersTax = modifiersTax + totalTax;

            }

            // }
        })
        //cartItem.modifiers[0].item_tax = parseFloat(totalTax);

        const subtotalModifiers = totalModifierPrice;
        const subtotalModifierTax = +modifiersTax;

        fixTotalAmount = (+fixTotalAmount + subtotalModifiers).toFixed(2);
        //fixTotalAmount = (+fixTotalAmount).toFixed(2);
    }

    return (+fixTotalAmount * qty).toFixed(2);
}

// Calculate total price of cart
export const calculateCartTotalPrice = (carts) => {
    let totalAmount = 0;
    carts.forEach(cart => {
        totalAmount = totalAmount + parseFloat(calculatePrice(cart))
    })

    return totalAmount.toFixed(2);
};

const countDiscount = (cartItem, price) => {
    const qty = cartItem.quantity ?? 0;
    if (cartItem.discount.discount_type === "percentage") {
        return ((+price / 100) * +cartItem.discount.discount_amount);
    }

    return (+cartItem.discount.discount_amount * qty);
};

const calculateTax = (cartItem) => {
    let tax = 0;
    const tax_dropdown = cartItem.tax_dropdown;
    if (cartItem.tax_id != null) {
        //const selectedTax = cartItem.all_tax_dropdown.filter((t) => t.id === +cartItem.tax_id);
        if (tax_dropdown) {
            tax = tax_dropdown.amount;
        }
    } else {
        if (cartItem.tax_dropdown) {
            tax = cartItem.tax_dropdown.amount;
        } else {
            tax = +cartItem.tax_id;
        }
    }

    return +tax;
};

const calculateModifierTax = (cartItem) => {
    let tax = cartItem.tax_dropdown ? cartItem.tax_dropdown.amount : 0;
    return +tax;
};

// Calculate total Tax of cart
export const calculateCartTotalTax = (carts) => {
    let totalAmount = 0;
    carts.forEach(cartItem => {
        let modifiersTax = 0;
        let modifierPrice = 0;
        let modifierUnitPrice = 0;
        let totalTax = 0;
        const qty = cartItem.quantity ?? 0;

        cartItem.modifiers && cartItem.modifiers.forEach(modifier => {
            if (modifier.tax_dropdown) {
                const tax = calculateModifierTax(modifier);
                const tax_percent = ((tax + 100) / 100);
                modifierPrice = toFixedTrunc(modifier.sell_price_inc_tax, 4);
                if (tax > 0) {
                    const tax_percent_multiply = (tax / 100);
                    modifierUnitPrice = (modifierPrice / tax_percent);
                    totalTax = (modifierUnitPrice * tax_percent_multiply);
                    modifiersTax = (modifiersTax + totalTax.toFixed(2) * qty);
                }
            }
        })
        if (cartItem.tax_dropdown) {
            let countPrice = toFixedTrunc(cartItem.unit_price_inc_tax, 4);
            //let countPrice = toFixedTrunc(cartItem.unit_price, 4);
            let price = +countPrice;
            // const discount = cartItem.discount && cartItem.discount.discount_amount ? countDiscount(cartItem, price) : 0;
            const modifiers = cartItem.modifiers ?? [];
            let modifierPrice = 0;
            const tax = calculateTax(cartItem);
            console.log('tax', tax);
            modifiers.forEach(modifier => {
                modifierPrice = modifierPrice + parseFloat(modifier.sell_price_inc_tax);
            });

            if (tax > 0) {
                // const totalPrice = (price) * qty;
                /*  const taxAmount = totalPrice * tax / 100; */
                //const taxAmount = ((totalPrice / 100) * tax);
                //const taxQTY = taxAmount.toFixed(2);
                //totalAmount = (+totalAmount + +taxQTY + +modifiersTax);
            }
            if (cartItem.item_tax > 0) {
                const taxAmount = (cartItem.item_tax);
                totalAmount = (+totalAmount + +taxAmount + +modifiersTax);
            } else {
                totalAmount = (+totalAmount + +modifiersTax);
            }

        } else {
            totalAmount = totalAmount + modifiersTax
        }
    });
    return totalAmount.toFixed(2);
};

export const calculateCartTotalModifierTax = (carts) => {
    let totalAmount = 0;
    carts.forEach(cartItem => {
        let totalTax = 0;
        let modifierPrice = 0;
        let modifierUnitPrice = 0;
        const qty = cartItem.quantity ?? 0;

        cartItem.modifiers && cartItem.modifiers.forEach(modifier => {
            if (modifier.tax_dropdown) {
                const tax = calculateModifierTax(modifier);
                modifierPrice = toFixedTrunc(modifier.sell_price_inc_tax, 4);
                if (tax > 0) {
                    const tax_percent = ((tax + 100) / 100);
                    const tax_percent_multiply = (tax / 100);
                    modifierUnitPrice = (modifierPrice / tax_percent);
                    totalTax = (modifierUnitPrice * tax_percent_multiply);
                    totalAmount = (totalAmount + totalTax.toFixed(2) * qty);
                }
            }
        })
    });
    return totalAmount.toFixed(2);
};

// Calculate total Discount of cart
export const calculateCartTotalDiscount = (carts) => {
    let totalAmount = 0;

    carts.forEach(cartItem => {
        totalAmount = totalAmount + calculateProductDiscount(cartItem);
    });

    return parseFloat(totalAmount).toFixed(2);
}

// Calculate total Discount of cart
export const calculateCartTotalDiscountType = (carts) => {
    let discountType = 'null';


    carts.forEach(cartItem => {
        if (!cartItem.discount || !cartItem.discount.discount_amount || !cartItem.discount.discount_type) {
            return discountType;
        }
        discountType = cartItem.discount && cartItem.discount.discount_type ? cartItem.discount.discount_type : "null";
    });

    return discountType;
}

const calculateModifierAmount = (cartItem) => {
    const modifiers = cartItem.modifiers ?? [];
    let modifierPrice = 0;
    modifiers.forEach(modifier => {
        modifierPrice = modifierPrice + +toFixedTrunc(modifier.sell_price_inc_tax, 2);
    });

    return +modifierPrice.toFixed(2);
}

// Calculate Discount of one Product
export const calculateProductDiscount = (cartItem) => {

    if (!cartItem.discount || !cartItem.discount.discount_amount) {
        return 0;
    }

    // prepare a price for single item
    const price = +cartItem.sell_price_inc_tax;
    // prepare modifiers
    const modifierPrice = calculateModifierAmount(cartItem);
    const qty = cartItem.quantity ?? 0;
    //const subAmount = price + modifierPrice * qty;
    const subAmount = price * qty;
    return countDiscount(cartItem, subAmount);
}
