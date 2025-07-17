import apiConfig from "../../config/apiConfig";
import App from '../../App';
import db from '../../indexDb';
import { constants, paymentActionType, ServerActionType, suspendedSalesActionType, recentTransactionActionType, toastType } from "../../constants";
import moment from "moment";
import { object } from "prop-types";
import prepareSuspendedData from "../../shared/prepareSuspendedData";

export const finalizePayment = (finalize, cb) => async (dispatch) => {
    await apiConfig.post('finalize-payment', finalize)
        .then((response) => {
            if (response.data !== null) {
                if (response.data.receipt !== null) {
                    saveFinalizePaymentInIndexedDB(response.data.receipt.print, finalize);
                    dispatch({ type: paymentActionType.PAYMENT_PRINT, payload: response.data.receipt.print, display: true });
                    if (response.data.receipt.print.print_type === 'app') {
                        cb({ status: true, receipt: false, data: response.data.receipt });
                    } else {
                        cb({ status: true, receipt: true, data: response.data.receipt.print });
                    }
                    dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.msg, display: true } });
                } else {
                    cb({ status: false, receipt: false });
                    dispatch({
                        type: constants.ADD_TOAST, payload: { text: response.data.msg, type: toastType.ERROR, display: true }
                    });
                }
            }
        })
        .catch(({ response }) => {
            cb({ status: false, receipt: false });
            /*  dispatch({ type: constants.ADD_TOAST, payload: { text: ServerActionType.SERVER_NOT_WORKING, type: toastType.ERROR, display: true } }); */
            dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.msg, type: toastType.ERROR, display: true } });
        });
    /*  await apiConfig.get(`get-recent-transactions?status=${statusId}&transaction_id=${transaction_id}`)
         .then((response) => {
             dispatch({ type: recentTransactionActionType.FETCH_FINAL_TRANSACTION, payload: response.data.transactions });
         })
         .catch(({ response }) => {
             dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.message, type: toastType.ERROR, display: true } });
         }); */
};

export const fetchFinalTransactionafterPayment = (statusId, transaction_id) => async (dispatch) => {

    await apiConfig.get(`get-recent-transactions?status=${statusId}&transaction_id=${transaction_id}`)
        .then((response) => {
            dispatch({ type: recentTransactionActionType.FETCH_FINAL_TRANSACTION, payload: response.data.transactions });
        })
        .catch(({ response }) => {
            dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.message, type: toastType.ERROR, display: true } });

        });
};

export const fetchFinalizePaymentFromIndexedDB = (formData, formValues, cb) => async (dispatch) => {
    /*  console.log('formData >>> ', formData); */
    const printObj = await db.printData.get(6);
    if (printObj) {
        /*  const formDataPost = [];
         for (let [key, value] of formData.entries()) {
             formDataPost[key] = value;
         }
         if (formDataPost !== "") {
             let CurrentUTCTimeStamp = moment(new Date()).format("MMDDYYYYhmms");
 
             let existingAlready = await db.printPostData.get(CurrentUTCTimeStamp);
             if (existingAlready) {
                 if (db.printPostData) db.printPostData.delete(CurrentUTCTimeStamp);
             }
             db.printPostData.add(formData, CurrentUTCTimeStamp);
             console.log('formValues >>> ', formValues[0]);
             APISending(formValues[0]); 
         } */
        const { cart, paymentCarts } = formValues[0];
        /*  console.log('cart >>>>', cart);
         console.log('paymentCarts >>>>', paymentCarts); */
        if (db.printData) {
            const printObj = await db.printData.get(6);

            // const printData = await db.printData.where('printDatakey').equals('printDatakey').toArray();
            if (printObj) {
                const advance_balance = formData.get("advance_balance");
                const total = formData.get('final_total');
                const change_return = formData.get('change_return');
                const tax_percent = printObj.appliedTax[0].tax_percent;
                let tax_amount = 0;
                let tax = 0;
                const lines = [];
                const modifiers = [];
                let allmodifiertax = 0;
                cart && cart.map((row, index) => {
                    console.log(row);
                    let catID = row.category_id;
                    let product_name = row.product.product_name;
                    let line_discount = row.discount.discount_amount;
                    let line_total_uf = row.unit_price_inc_tax;
                    let unit_price = row.unit_price;
                    let unit_price_inc_tax = row.unit_price_inc_tax;
                    let sell_price_inc_tax_item = row.sell_price_inc_tax;
                    let quantity_uf = row.quantity;
                    let quantity = row.quantity;
                    let single_product_tax = (sell_price_inc_tax_item - unit_price);
                    // console.log(unit_price);
                    let singleProductTax = unit_price * tax_percent / 100;
                    // console.log(singleProductTax);
                    // console.log(quantity);
                    tax_amount = tax_amount + (quantity * singleProductTax);
                    // console.log(tax_amount);
                    let sub_total_final = unit_price + singleProductTax;
                    row.modifiers && row.modifiers.map((modifier) => {
                        if (modifier.tax_type == 'exclusive') {
                            let modifiertax = quantity * (modifier.default_sell_price * 15 / 100);
                            allmodifiertax = allmodifiertax + modifiertax;
                            // console.log(modifiertax);
                            let default_purchase_price = modifier.default_purchase_price;
                            let line_total = default_purchase_price * quantity;
                            let default_sell_price = modifier.default_sell_price;
                            let dpp_inc_tax = modifier.dpp_inc_tax;
                            let modifier_tax = 0;
                            if (modifiertax != 0) {
                                modifier_tax = modifier_tax + (modifiertax + (quantity * default_purchase_price));
                            }

                            modifiers.push({
                                ['if']: 'if',
                                ['line_total']: line_total,
                                ['modifier_tax']: modifier_tax,
                                ['name']: product_name,
                                ['price_exc_tax']: (default_purchase_price * quantity),
                                ['quantity']: quantity,
                                ['sell_price_inc_tax']: default_sell_price,
                                ['single_modifier_tax']: modifiertax,
                                ['sub_total_final']: default_sell_price,
                                ['tax_amount']: tax_amount,
                                ['tax_id']: modifier.tax_id,
                                ['tax_type']: modifier.tax_type,
                                ['unit_price_exc_tax']: default_purchase_price,
                                ['unit_price_inc_tax']: dpp_inc_tax,
                                ['units']: "Pc(s)",
                                ['variation']: modifier.name
                            });

                        } else {
                            modifiers.push({
                                ['else']: 'else',
                                ['line_total']: 0.00,
                                ['modifier_tax']: 0,
                                ['name']: product_name,
                                ['price_exc_tax']: 0.00,
                                ['quantity']: quantity,
                                ['sell_price_inc_tax']: 0,
                                ['single_modifier_tax']: 0,
                                ['sub_total_final']: 0.00,
                                ['tax_amount']: 0,
                                ['tax_id']: null,
                                ['tax_type']: null,
                                ['unit_price_exc_tax']: 0,
                                ['unit_price_inc_tax']: 0,
                                ['units']: "Pc(s)",
                                ['variation']: modifier.name
                            });
                        }
                    });
                    // console.log("row.modifiers.lenght", row.modifiers.length);

                    lines.push({
                        ['modifiers']: modifiers,
                        ['catID']: catID,
                        ['line_discount']: line_discount,
                        ['line_total_uf']: line_total_uf,
                        ['name']: product_name,
                        ['quantity']: quantity,
                        ['quantity_uf']: quantity_uf,
                        ['unit_price_inc_tax']: unit_price_inc_tax,
                        ['single_product_tax']: single_product_tax,
                        ['sell_price_inc_tax']: sell_price_inc_tax_item,
                        ['sub_total_final']: sub_total_final,
                        ['tax']: tax,
                        ['tax_amount']: tax_amount,
                        ['tax_id']: row.tax_id,
                        ['tax_name']: 1,
                        ['tax_percent']: tax_percent,
                        ['unit_price']: unit_price,
                        ['units']: "Pc(s)",
                    });

                });
                // console.log(lines);
                // return;
                // const valuesArray = JSON.parse(lines);
                printObj.lines = lines;
                printObj.modifier_tax = allmodifiertax;
                const totaltax = allmodifiertax + tax_amount;
                const payments = [];
                // console.log(change_return);
                paymentCarts && paymentCarts.map((payment, index) => {
                    let payment_method = payment.payment_type;
                    if (payment.payment_type == 'cash') {
                        payment_method = 'Cash - الدفع ';
                    }
                    if (payment.payment_type == 'card') {
                        payment_method = 'Card - بطاقة';
                    }
                    if (payment.payment_type == 'prepaid') {
                        payment_method = 'Prepaid -  الدفع';
                    }
                    if (payment.payment_type == 'card') {
                        payment_method = 'Card - بطاقة';
                    }
                    payments.push({
                        ['amount']: payment.amount + " ﷼",
                        ['date']: moment(new Date()).format("MM/DD/YYYY"),
                        ['method']: payment_method
                    });
                    if (change_return != 0) {

                        payments.push({
                            ['amount']: (change_return) + " ﷼",
                            ['date']: moment(new Date()).format("MM/DD/YYYY"),
                            ['method']: payment_method + "(Change Return)(-)"
                        });
                    }
                });
                printObj.payments = payments;
                printObj.appliedTax[0].tax_amount = tax_amount;
                printObj.tax = tax_amount ? tax_amount + " ﷼" : printObj.tax;
                printObj.call_no = printObj.call_no + 1;
                printObj.invoice_no = (printObj.invoice_no + 1);
                printObj.invoice_date = moment(new Date()).format("MM/DD/YYYY HH:mm:ss");
                printObj.total = total ? total + " ﷼" : printObj.total;
                printObj.tax = totaltax ? totaltax + " ﷼" : printObj.tax;
                printObj.final_total = total ? total : printObj.final_total;
                printObj.total_paid = total ? total + " ﷼" : printObj.total_paid;
                printObj.total_due = advance_balance ? advance_balance + " ﷼" : printObj.total_due;
                db.printData.put(printObj, 6);

                const printData = await db.printData.get(6);
                dispatch({ type: paymentActionType.PAYMENT_PRINT, payload: printData });
                cb({ status: true, receipt: true, data: printObj });
                console.log('printObj>>>>', printObj);
                console.log('printData>>>>', printData);
            }
        }
        await apiConfig.post('finalize-payment', formData)
            .then((response) => {
                if (response.data !== null) {
                    if (response.data.receipt !== null) {
                        saveFinalizePaymentInIndexedDB(response.data.receipt.print, formData);
                    }
                }
            })
            .catch(({ response }) => {
                dispatch({ type: constants.ADD_TOAST, payload: { text: ServerActionType.SERVER_NOT_WORKING, display: true } });
            });
        return;

    } else {
        await apiConfig.post('finalize-payment', formData)
            .then((response) => {
                if (response.data !== null) {
                    if (response.data.receipt !== null) {
                        saveFinalizePaymentInIndexedDB(response.data.receipt.print, formData);
                        dispatch({ type: paymentActionType.PAYMENT_PRINT, payload: response.data.receipt.print, display: true });
                        if (response.data.receipt.print.receipt_printer_type === 'app') {
                            cb({ status: true, receipt: false, data: response.data.receipt });
                        } else {
                            cb({ status: true, receipt: true, data: response.data.receipt.print });
                        }
                        dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.msg, display: true } });
                    } else {
                        cb({ status: false, receipt: false });
                        dispatch({
                            type: constants.ADD_TOAST, payload: { text: response.data.msg, display: true }
                        });
                    }
                }
            })
            .catch(({ response }) => {
                dispatch({ type: constants.ADD_TOAST, payload: { text: ServerActionType.SERVER_NOT_WORKING, display: true } });
            });
        return;
    }


}


export const sendPrintApi = (printUrl, cb) => async (dispatch) => {
    window.location.href = printUrl;
    await apiConfig.post(printUrl)
        .then((response) => {
            cb({ status: true, data: response });
            console.log("response>>> ", response);

        }).catch(({ }) => {
            cb({ status: false, error: "Error Printing" });

            console.log("Error Printing");
        });
};



export async function saveFinalizePaymentInIndexedDB(data, finalize) {
    if (data) {
        let CurrentUTCTimeStamp = moment(new Date()).format("MMDDYYYYhmms");
        if (db.printData) db.printData.delete(6);
        // if (db.printData) db.printData.clear();
        // db.printData.add({ printDatakey: 'printDatakey', data }).then(() => { });
        db.printData.add(data, 6);

    }
    // console.log(finalize.get('location_id'));
    // console.log(finalize.get('payment[0][amount]'));
    // for (let [key, value] of finalize.entries()) {
    //      console.log(key, value);
    // }

}


export async function APISending(obj) {
    /* await apiConfig.post('finalize-payment', obj)
        .then(() => {
            console.log('success', "Pending Data Saved.");
        }).catch(({ }) => {
            console.log('error', "Pending data not saved.");
        }); */
    const all = await db.printPostData.toArray();
    // console.log(all);
    const formData = new FormData();
    if (all.length != 0) {
        all && all.map((obj, key) => {
            //console.log(key);
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    formData.append(key, obj[key]);
                }
            }
            /*  console.log('formData >>> ', formData); */
            //APISending(formData);
        });
        /*  if (db.printPostData) db.printPostData.clear(); */
    }
    console.log('formData', formData);
    await apiConfig.post('finalize-payment', formData)
        .then((response) => {
            if (response.data !== null) {
                if (response.data.receipt !== null) {
                    saveFinalizePaymentInIndexedDB(response.data.receipt.print, formData);
                    console.log('success', "Pending Data Saved.");
                } else {
                    console.log('error', "Pending data not saved.");
                }
            }
        })
        .catch(({ response }) => {
            console.log('Error', "Pending data not saved.");
        });

}

export async function PrepareAPISending() {
    const all = await db.printPostData.toArray();
    /*  console.log(all); */

    const formData = new FormData();
    if (all.length !== 0) {
        all && all.map((obj) => {
            // console.log(obj);
            let Arraykeys = Object.keys(obj);
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    formData.append(key, obj[key] ? obj[key] : null);
                }
            }
            APISending(formData);

        });
        // console.log(formData);
    }
}

export const SavePendingFinalizePayment = () => async (dispatch) => {
    const all = await db.printPostData.toArray();
    // console.log(all);
    const formData = new FormData();
    if (all.length != 0) {
        all && all.map((obj, key) => {
            //console.log(key);
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    formData.append(key, obj[key]);
                }
            }
            /*  console.log('formData >>> ', formData); */
            //APISending(formData);
        });
        /*  if (db.printPostData) db.printPostData.clear(); */
    }

};


export const updateFinalizePayment = (finalize, transactionId, cb) => async (dispatch) => {
    await apiConfig.post(`update-finalize-payment?transaction_id=${transactionId}`, finalize)
        .then((response) => {
            dispatch({ type: paymentActionType.PAYMENT_PRINT, payload: response.data.receipt.print });
            if (response.data.receipt !== null) {
                dispatch({ type: paymentActionType.PAYMENT_PRINT, payload: response.data.receipt.print });
                cb({ status: true, receipt: true, data: response.data.receipt.print });
                const editSuspendedSale = [];
                dispatch({ type: suspendedSalesActionType.EDIT_SUSPENDED_SALES, payload: editSuspendedSale });

            } else {
                cb({ status: false, receipt: false });
            }
            // App.this.setState(Object.assign({}, { transactionId: '0' }));

        })
        .catch(({ response }) => {
            dispatch({ type: constants.ADD_TOAST, payload: { text: "Failed!", display: true } });
        });
};