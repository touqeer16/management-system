import React, { useEffect, useState, useRef } from "react";
import '../scss/layout.scss';
import '../scss/style.scss';
import { calculateCartTotalPrice } from "../../shared/CalculateProductPrice";
import { useEventListener, ESCAPE_KEYS } from "../../shared/UseEventListener";
import { connect } from "react-redux";
import { notify } from "../../store/action/notificationAction";
import NumberKeyboard from "./NumberKeyboard";
import { finalizePayment, updateFinalizePayment } from "../../store/action/finalizePaymentAction";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import prepareSuspendedData from "../../shared/prepareSuspendedData";
import { toFixedTrunc } from "../../shared/CalculateProductPrice";

const CASH = 'cash'
const CARD = 'card';

class PrintData extends React.PureComponent {
    render() {
        const paymentPrint = this.props.paymentPrint;
        let modifierText = [];

        if (!paymentPrint || paymentPrint.length === 0) {
            return (<div />);
        }

        const countTotalTax = (tax) => {
            let totalAmount = 0;

            tax && tax.appliedTax.forEach(cartItem => {
                totalAmount = totalAmount + (Math.ceil(cartItem.tax_amount * 100) / 100)
            });

            return +totalAmount.toFixed(2);
        }

        const totalProductTax = countTotalTax(paymentPrint);
        const totalModifierTax = paymentPrint.modifier_tax;
        const taxAmount = totalProductTax + totalModifierTax;
        const subTotalRounded = (paymentPrint.final_total -
            parseFloat(taxAmount).toFixed(2));

        const loadFreeModifiers = (modifiers) => {
            let modifierText = [];
            modifiers.forEach((modifier) => {
                if (+modifier.sell_price_inc_tax === 0) {
                    modifierText.push(modifier.variation);
                }
            });

            if (modifierText.length === 0) {
                return '';
            }

            return (
                <tr>
                    <td />
                    <td style={{ 'fontSize': '14px' }}>{modifierText.join(',')}</td>
                    <td style={{ "textAlign": "end", "padding": "0" }} />
                    <td style={{ 'textAlign': 'end', 'padding': '0', }} />
                    <td style={{ 'textAlign': 'end', 'padding': '0', }} />
                </tr>
            )
        }
        return (
            <div style={{ "fontFamily": "'Playfair Display', serif" }}>
                <div style={{ "width": "100%", "padding": "25px" }}>
                    <table style={{ "width": "100%" }}>
                        <tbody>
                            <tr>
                                <th style={{ "fontWeight": "unset", "width": "50%", "fontSize": '15px' }}>
                                    {moment(new Date()).format("DD/MM/YYYY")}
                                </th>
                                <th style={{ "fontWeight": "unset", "width": "50%", "fontSize": '13px' }}>POS- الك شاورما
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <table style={{ "width": "100%" }}>
                        <div style={{ "fontWeight": "unset" }}
                            dangerouslySetInnerHTML={{ __html: paymentPrint.header_text }} />
                    </table>
                    <table style={{ "width": "100%" }}>
                        <tbody style={{ "width": "100%" }}>
                            <tr style={{ "width": "100%" }}>
                                <td style={{ 'textAlign': 'start', "width": "100%" }}>
                                    <p style={{ 'margin': '0' }}>
                                        <b style={{
                                            "fontSize": "18px",
                                            "textTransform": "uppercase"
                                        }}>{paymentPrint.location_name}</b>
                                        <br />
                                        {paymentPrint.address}
                                        <br />
                                        <b style={{ "fontSize": '14px' }}>VAT:</b> 123456789vat
                                        <br />
                                        <b style={{ "fontSize": "15px" }}>{paymentPrint.invoice_heading}</b>
                                    </p>
                                    <hr style={{ "border": "1px solid #000000", "marginBottom": "0", "marginTop": "15px" }} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ "width": "100%", "marginBottom": "5px" }}>
                        <tbody style={{ "width": "100%" }}>
                            <tr>
                                <th style={{
                                    "textAlign": "start", "fontWeight": "unset", "width": "100%", "padding": "0",
                                    "fontSize": '15px'
                                }}>
                                    <b>{paymentPrint.invoice_no_prefix}</b>
                                </th>
                                <th></th>
                                <th style={{ "textAlign": "end", "fontWeight": "unset", "padding": "0", "fontSize": '15px' }}>
                                    {paymentPrint.invoice_no}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ "width": "100%", "marginBottom": "10px" }}>
                        <tbody style={{ "width": "100%" }}>
                            <tr>
                                <th style={{
                                    "textAlign": "start",
                                    "fontWeight": "unset",
                                    "padding": "0",
                                    "fontSize": '15px'
                                }}>
                                    <b>{paymentPrint.date_label}</b></th>
                                <td style={{
                                    "textAlign": "end",
                                    "fontWeight": "unset",
                                    "padding": "0",
                                    "whiteSpace": "nowrap",
                                    "fontSize": '15px'
                                }}>
                                    {paymentPrint.invoice_date}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ "width": "100%", "marginBottom": "5px" }}>
                        <tbody style={{ "width": "100%" }}>
                            <tr>
                                <th style={{ "borderBottom": " 2.5px dashed #b3b2b2", "paddingLeft": "5px" }}>#</th>
                                <th style={{
                                    "width": "45%",
                                    "padding": "5px",
                                    "borderBottom": "2.5px dashed #b3b2b2",
                                    "fontSize": '15px'
                                }}>{paymentPrint.table_product_label}
                                </th>
                                <th style={{
                                    "textAlign": "right",
                                    "padding": "0",
                                    "borderBottom": "2.5px dashed #b3b2b2",
                                    "fontSize": '15px'
                                }}>{paymentPrint.table_qty_label}
                                </th>
                                <th style={{
                                    "textAlign": "right",
                                    "padding": "0",
                                    "borderBottom": "2.5px dashed #b3b2b2",
                                    "fontSize": '15px'
                                }}>{paymentPrint.table_unit_price_label}
                                </th>
                                <th style={{
                                    "textAlign": "right",
                                    "padding": "0",
                                    "borderBottom": "2.5px dashed #b3b2b2",
                                    "fontSize": '15px'
                                }}>{paymentPrint.table_subtotal_label}
                                </th>
                            </tr>
                            {
                                paymentPrint && paymentPrint.lines.map((line, index) => {
                                    const unitPriceRounded = toFixedTrunc(line.unit_price, 2);
                                    const roundedValue = +unitPriceRounded + Math.ceil(line.single_product_tax * 100) / 100;
                                    const subTotalFinal = +roundedValue * line.quantity;
                                    return (
                                        <>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{line.name}</td>
                                                <td style={{
                                                    "textAlign": "end",
                                                    "padding": "0"
                                                }}>{line.quantity} {line.units}</td>
                                                <td style={{ "textAlign": "end", "padding": "0" }}>
                                                    {+roundedValue}
                                                </td>
                                                <td style={{ "textAlign": "end", "padding": "0" }}>
                                                    {subTotalFinal.toFixed(2)}
                                                </td>
                                            </tr>
                                            {
                                                line.modifiers && line.modifiers.length !== 0 ?
                                                    line.modifiers.map((modifier, index) => {
                                                        if (+modifier.sell_price_inc_tax === 0) {
                                                            modifierText.push(modifier.variation);
                                                        }
                                                        const roundedValue = parseFloat(modifier.unit_price_inc_tax) + modifier.single_modifier_tax;
                                                        if (+modifier.sell_price_inc_tax > 0) {
                                                            return (
                                                                <tr key={index}>
                                                                    <td />
                                                                    <td style={{ 'fontSize': '14px' }}>{modifier.variation}</td>
                                                                    <td style={{
                                                                        "textAlign": "end",
                                                                        "padding": "0",
                                                                        'fontSize': '14px'
                                                                    }}>
                                                                        {modifier.quantity} {modifier.units}
                                                                    </td>
                                                                    <td style={{
                                                                        'textAlign': 'end',
                                                                        'padding': '0',
                                                                        'fontSize': '14px'
                                                                    }}>
                                                                        {roundedValue.toFixed(2)}
                                                                    </td>
                                                                    <td style={{
                                                                        'textAlign': 'end',
                                                                        'padding': '0',
                                                                        'fontSize': '14px'
                                                                    }}>
                                                                        {modifier.sub_total_final.toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    }) : null
                                            }
                                            {line.modifiers && line.modifiers.length !== 0 && loadFreeModifiers(line.modifiers)}
                                        </>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <hr style={{ "border": "1px solid black", "marginTop": "15px" }} />

                    <table style={{ "width": "100%" }}>
                        <tbody style={{ "width": "100%" }}>
                            <tr>
                                <th style={{ 'textAlign': 'right', 'width': '65%', 'fontSize': '15px', 'padding': '0' }}>
                                    {paymentPrint.subtotal_label}
                                </th>
                                <th style={{ 'textAlign': 'end', 'fontSize': '15px', 'padding': '0', }}>
                                    {(subTotalRounded.toFixed(2)) + '﷼ '}
                                </th>
                            </tr>
                            <tr>
                                <td style={{ "textAlign": "right", "width": '65%', "fontSize": '15px' }}>Tax</td>
                                <td style={{ "textAlign": 'end' }}>(+) ﷼ {parseFloat(taxAmount).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style={{ "textAlign": "right", "width": '65%' }}><b
                                    style={{ "fontSize": '15px' }}>{paymentPrint.total_label}</b></td>
                                <td style={{ "textAlign": 'end' }}><b>{paymentPrint.total}</b></td>
                            </tr>
                            {
                                paymentPrint.payments && paymentPrint.payments.length !== 0 ? paymentPrint.payments.map((payment, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{
                                                "textAlign": "right",
                                                "width": '65%',
                                                "fontSize": '13px'
                                            }}>{payment.method}({payment.date})
                                            </td>
                                            <td style={{ "textAlign": 'end', "fontSize": '13px' }}>{payment.amount}</td>
                                        </tr>
                                    )
                                }) : null
                            }
                            <tr>
                                <td style={{
                                    "textAlign": "right",
                                    "width": '65%',
                                    "fontSize": '13px'
                                }}>{paymentPrint.total_paid_label}</td>
                                <td style={{ "textAlign": 'end', "fontSize": '13px' }}>{paymentPrint.total_paid}</td>
                            </tr>
                            <tr>
                                <td style={{
                                    "textAlign": "right",
                                    "width": '65%',
                                    "fontSize": '13px'
                                }}>{paymentPrint.total_due_label}</td>
                                <td style={{ "textAlign": 'end', "fontSize": '13px' }}>{paymentPrint.total_due} </td>
                            </tr>
                        </tbody>
                    </table>

                    {/*<hr style={{"border": "1px solid black", "marginTop": " 15px"}}/>*/}
                    {/*{*/}
                    {/*    paymentPrint && paymentPrint.appliedTax.length !== 0 ?*/}
                    {/*        <div>*/}
                    {/*        <table style={{"width": "100%"}}>*/}
                    {/*            <tbody style={{"width": "100%"}}>*/}
                    {/*            <tr>*/}
                    {/*                <td>*/}
                    {/*                    {*/}
                    {/*                       paymentPrint.appliedTax.map((line, index) => {*/}
                    {/*                            return (*/}
                    {/*                                <div>*/}
                    {/*                                    <p style={{"position": 'absolute', 'margin': '0'}}*/}
                    {/*                                       key={index}>{line.tax_name}</p>*/}
                    {/*                                    <p style={{*/}
                    {/*                                        "textAlign": "center",*/}
                    {/*                                        'margin': '0'*/}
                    {/*                                    }}>{line.tax_amount.toFixed(2)}  ﷼ </p>*/}
                    {/*                                </div>*/}
                    {/*                            )*/}
                    {/*                        })*/}
                    {/*                    }*/}
                    {/*                </td>*/}
                    {/*            </tr>*/}
                    {/*            </tbody>*/}
                    {/*        </table>*/}
                    {/*            </div>*/}
                    {/*        : ''*/}
                    {/*}*/}
                    {/*<table style={{"width": "100%"}}>*/}
                    {/*    <tbody style={{"width": "100%"}}>*/}
                    {/*    <tr>*/}
                    {/*        <td>*/}
                    {/*            <b>*/}
                    {/*                <p style={{"position": 'absolute', 'margin': '0'}}>Total Tax</p>*/}
                    {/*                <p style={{"textAlign": "center", 'margin': '0'}}>*/}
                    {/*                    {taxAmount ? parseFloat(taxAmount).toFixed(2) : 0} ﷼*/}
                    {/*                </p>*/}
                    {/*            </b>*/}
                    {/*        </td>*/}
                    {/*    </tr>*/}
                    {/*    </tbody>*/}
                    {/*</table>*/}
                    <hr style={{ 'border': '1px solid #000000' }} />
                    <table style={{ "width": "100%" }}>
                        <div style={{
                            "fontWeight": "unset"
                        }} dangerouslySetInnerHTML={{ __html: paymentPrint.footer_text }} />
                    </table>
                    <table style={{ "width": "100%" }}>
                        <tbody style={{ "width": "100%" }}>
                            <tr>
                                <td>
                                    <p style={{
                                        'textAlign': "center",
                                        'margin': "0"
                                    }}>{paymentPrint.additional_notes}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

const printCustomReceipt = (print) => {
    const dynHtml = `print://escpos.org/escpos/net/print/?srcTp=uri&srcObj=html&numCopies=1&src=${print.print_url}`;
    window.location.href = dynHtml;
}

const Payment = (props) => {
    const {
        carts,
        notify,
        finalizePayment,
        updateCart,
        customer,
        transactionId,
        updateFinalizePayment,
        selectedLocationId,
        serviceId,
        tableId,
    } = props;
    const [isPaymentOpenModal, setIsPaymentOpenModal] = useState(false);
    const [finalAmount, setFinalAmount] = useState(0);
    const [selectedInputIndex, setSelectedInputIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [backColor, setBackColor] = useState(false);
    const [printShow, setPrintShow] = useState(false);
    const [paymentPrints, setPaymentPrints] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([
        {
            amount: +finalAmount,
            payment_type: CASH
        }
    ]);
    const [errorMsg, setErrorMsg] = useState('');
    const componentRef = useRef();

    // User for Close the model on Escape
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            closePaymentModel();
            setPrintShow(false);
        }
    }

    // listen a event of keydown for ESCAPE and close a model
    useEventListener('keydown', handler);

    useEffect(() => {
        const finalAmount = calculateCartTotalPrice(carts);
        setFinalAmount(+finalAmount);
        updateAmount(finalAmount, 0);
        setPaymentMethods([
            {
                amount: +finalAmount,
                payment_type: CASH
            }
        ]);
    }, [carts, isPaymentOpenModal, updateCart]);

    useEffect(() => {
        document.body.style.overflow = isPaymentOpenModal ? 'hidden' : 'unset';
    }, [isPaymentOpenModal]);

    // Close a Payment Model
    const closePaymentModel = () => {
        setIsPaymentOpenModal(false);
        setErrorMsg('');
    };

    //Finalize API
    const finalizeData = () => {
        const formData = [];
        formData.push({
            cart: carts,
            paymentCarts: paymentMethods,
            changeReturn: calculateReturnExchange(),
            balance: calculateReturnBalance(),
            finalTotal: finalAmount,
            suspended: 0,
            customerId: customer ? customer.id : 'no_customer_select',
            transactionId: transactionId ? transactionId : null,
            serviceId,
            tableId
        });
        if (transactionId) {
            updateFinalizePayment(prepareSuspendedData(formData, selectedLocationId), transactionId, (cb) => {
                if (cb.status) {
                    setPaymentPrints(cb.data)
                    if (cb.receipt) {
                        setPrintShow(true);
                        printPaymentReceiptPdf();
                        setIsPaymentOpenModal(false);
                        updateCart([]);
                    } else {
                        printCustomReceipt(cb.data);
                        setIsPaymentOpenModal(false);
                    }
                }
            });
        } else {
            finalizePayment(prepareSuspendedData(formData, selectedLocationId), (cb) => {
                if (cb.status) {
                    setPaymentPrints(cb.data)
                    updateCart([]);
                    if (cb.receipt) {
                        setPrintShow(true);
                        printPaymentReceiptPdf();
                        setIsPaymentOpenModal(false);
                        updateCart([]);
                    } else {
                        printCustomReceipt(cb.data);
                        setIsPaymentOpenModal(false);
                    }
                }
            });
        }
        removePaymentMethod();
    };

    const printPaymentReceiptPdf = () => {
        document.getElementById('printReceipt').click();
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // Open a Payment Model
    const openPaymentModel = () => {
        if (finalAmount > 0) {
            setIsPaymentOpenModal(true);
        } else {
            // Display Validation message if cart is empty.
            notify('Please add at least one product into cart.');
        }
    };

    // Payment method selection
    const selectMethod = (type, index) => {
        const methods = paymentMethods.slice();
        methods[index].payment_type = type;
        setPaymentMethods(methods);
    }

    // Remove payment method
    const removePaymentMethod = (index) => {
        const methods = paymentMethods.slice();
        methods.splice(index, 1);
        setPaymentMethods(methods);
    }

    // Add new Payment Method
    const addNewPaymentMethod = () => {
        setPaymentMethods([
            ...paymentMethods, {
                amount: 0,
                payment_type: CASH
            }
        ]);
    }

    //update amount
    const onChangeAmount = (value, index) => {
        setBackColor(true);
        updateAmount(value, index);
    };

    // Update Active input
    const onFocusSelectInput = (e, index) => {
        setCursorPosition(e.target.selectionStart);
        setSelectedInputIndex(index);
    };

    // Update by Input change
    const updateAmount = (value, index) => {
        const re = /^[0-9.\b]+$/;
        if (value === '' || re.test(value) && paymentMethods.length !== 0) {
            const methods = paymentMethods.slice();
            methods[index].amount = value;
            setPaymentMethods(methods);
        }
    }

    // Update by keyboard
    const updateAmountByKeyboard = (value) => {
        const methods = paymentMethods.slice();
        const amount = methods[selectedInputIndex].amount.toString();
        if (amount.includes(".") && value === '.') {
        } else {
            let finalAmt = 0;
            if (cursorPosition > 0) {
                const firstAmt = amount.substring(0, cursorPosition)
                const lastAmt = amount.substring(cursorPosition);
                finalAmt = firstAmt + value + lastAmt;
            } else {
                finalAmt = amount + value;
            }
            methods[selectedInputIndex].amount = finalAmt;
            setPaymentMethods(methods);
            setBackColor(true);
        }
    }

    // Clear by keyboard
    const clearAmountByKeyboard = () => {
        const methods = paymentMethods.slice();
        const amount = methods[selectedInputIndex].amount.toString();
        let finalAmt = 0;
        if (cursorPosition > 0) {
            let firstAmt = amount.substring(0, cursorPosition)
            const lastAmt = amount.substring(cursorPosition);
            if (firstAmt.length > 0) {
                firstAmt = firstAmt.slice(0, -1)
            }
            finalAmt = firstAmt + lastAmt;
        } else {
            finalAmt = amount.slice(0, -1);
        }
        methods[selectedInputIndex].amount = +finalAmt;
        setPaymentMethods(methods);
        setBackColor(true);
    }

    // Update by keyboard
    const updateBulkCurrentMethodAmount = (value) => {
        setBackColor(true);
        const methods = paymentMethods.slice();
        methods[selectedInputIndex].amount = +methods[selectedInputIndex].amount + (+value);
        setPaymentMethods(methods);
    }

    const calculatePayingAmount = () => {
        let payableAmt = 0;
        paymentMethods.forEach(paymentMethod => {
            payableAmt = payableAmt + (+paymentMethod.amount);
        })

        return +payableAmt.toFixed(2);
    }

    const calculateReturnExchange = () => {
        const payableAmt = calculatePayingAmount();

        if (finalAmount > payableAmt) {
            return '0.00';
        }

        return +(payableAmt - finalAmount).toFixed(2);
    }

    const calculateReturnBalance = () => {
        const payableAmt = calculatePayingAmount();

        if (finalAmount < payableAmt) {
            return '0.00';
        }

        return +(finalAmount - payableAmt).toFixed(2);
    }

    //Payment Cart Array
    const loadPaymentMethods = (paymentMethod, index) => {
        const finalPayment = paymentMethod.amount ? +paymentMethod.amount : '';
        return (
            <div
                className={`${index === 0 ? '' : 'custom-card-space'} pos-modal payment-modal__payment-method bg-secondary p-3`}
                key={index}>
                {paymentMethods.length > 1 ?
                    <div className="callout text-end">
                        <button type="button" className="cross-btn" onClick={() => removePaymentMethod(index)}>X
                        </button>
                    </div>
                    : ''}
                <h6 className="modal-subtitle mb-2"
                    id="paymentModalLabel">
                    Payment Method:
                </h6>
                <div className="modal-btn-grp">
                    <button type="button" onClick={() => selectMethod(CASH, index)}
                        className={`btn modal-btn ${paymentMethod.payment_type === CASH ? 'btn-primary me-2' : 'btn-secondary me-2'}`}>
                        Cash
                    </button>
                    <button type="button" onClick={() => selectMethod(CARD, index)}
                        className={`btn modal-btn ${paymentMethod.payment_type === CARD ? 'btn-primary me-2' : 'btn-secondary me-2'}`}>
                        Card
                    </button>
                </div>
                <div
                    className="row mt-4 align-items-center">
                    <label htmlFor="amount"
                        className="col-sm-2 col-4 modal-subtitle col-form-label">
                        Amount:
                    </label>
                    <div
                        className="col-sm-10 col-8 field-w-100">
                        <input
                            name="amount"
                            type="number"
                            readOnly={true}
                            className="form-control amount-input read-only-background"
                            onKeyDown={(e) => onFocusSelectInput(e, index)}
                            onClick={(e) => onFocusSelectInput(e, index)}
                            onFocus={(e) => onFocusSelectInput(e, index)}
                            onChange={(e) => onChangeAmount(e.target.value, index)}
                            value={+finalPayment}
                        />
                        <span
                            className="required d-flex justify-content-start text-danger">{errorMsg ? errorMsg : null}</span>
                    </div>
                </div>
            </div>
        )
    };

    const finalPriceStatus = () => {
        return (
            <div>
                <div className="payment-modal__widgets ps-lg-2 mt-2 pt-1 d-flex flex-wrap">
                    <div className="w-100">
                        <div
                            className="payment-modal__widgets-block bg-secondary text-center d-flex flex-wrap align-items-center justify-content-center">
                            <div>
                                <span className="payment-modal__items d-block mb-1">
                                    Total Items
                                </span>
                                <strong className="payment-modal__total-items d-block">
                                    {carts.length}
                                </strong>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${backColor && finalAmount === calculatePayingAmount() ? 'bg-div-green' : 'bg-secondary'} payment-modal__widgets-block text-center d-flex flex-wrap align-items-center justify-content-center`}>
                        <div>
                            <span className="payment-modal__items d-block mb-1">
                                Total Payable
                            </span>
                            <strong
                                className="payment-modal__total-items d-block">
                                ﷼
                                {finalAmount}
                            </strong>
                        </div>
                    </div>
                    <div
                        className="payment-modal__widgets-block bg-secondary text-center d-flex flex-wrap align-items-center justify-content-center">
                        <div>
                            <span className="payment-modal__items d-block mb-1">
                                Total Paying
                            </span>
                            <strong
                                className="payment-modal__total-items d-block">
                                ﷼
                                {calculatePayingAmount()}
                            </strong>
                        </div>
                    </div>
                    <div
                        className={`${backColor && calculateReturnExchange() > 0 ? 'bg-orange' : 'bg-secondary'} payment-modal__widgets-block text-center d-flex flex-wrap align-items-center justify-content-center`}>
                        <div>
                            <span className="payment-modal__items d-block mb-1">
                                Change Return
                            </span>
                            <strong
                                className="payment-modal__total-items d-block">
                                ﷼{calculateReturnExchange()}
                            </strong>
                        </div>
                    </div>
                    <div
                        className={`${backColor && calculateReturnBalance() > 0 ? 'bg-danger' : 'bg-secondary'} payment-modal__widgets-block bg-secondary text-center d-flex flex-wrap align-items-center justify-content-center`}>
                        <div>
                            <span className="payment-modal__items d-block mb-1">
                                Balance
                            </span>
                            <strong
                                className="payment-modal__total-items d-block">
                                ﷼{calculateReturnBalance()}
                            </strong>
                        </div>
                    </div>
                </div>
                <div className="calculator payment-modal__payment-calculator ms-lg-3 my-4">
                    <div className="row gx-0">
                        <div className="col-12">
                            <NumberKeyboard
                                updateAmount={updateAmountByKeyboard}
                                addAmount={updateBulkCurrentMethodAmount}
                                clearAmount={clearAmountByKeyboard} />
                        </div>
                    </div>
                </div>
                <div className="text-end">
                    <button type="button" onClick={() => finalizeData()}
                        disabled={calculatePayingAmount() === 0}
                        className="btn btn-primary modal-btn/ mt-3 mx-lg-3 modal-footer-btn payment-modal__finalize-btn">
                        Finalize
                    </button>
                </div>
            </div>
        )
    };

    const displayLabel = () => {
        return (<button type="button"
            className="btn text-primary w-100 h-100 coustom-hover"
            data-bs-toggle="modal"
            data-bs-target="#paymentModal"
            onClick={openPaymentModel}>
            Payment
        </button>)
    }

    if (!isPaymentOpenModal) {
        return displayLabel();
    }

    const loadPrintBlock = () => {
        return (
            <div>
                <div className={'d-none'}>
                    {printShow ? <PrintData ref={componentRef} paymentPrint={paymentPrints} /> : ''}
                    <button id="printReceipt" onClick={handlePrint}>Print this out!</button>
                </div>
            </div>
        );
    }
    return (
        <div className="w-100 h-100">
            {displayLabel()}
            <div className="payment-modal pos-modal">
                <div
                    className="modal-dialog modal-dialog-centered hide-show-dialog">
                    <div className="modal-content border-0 px-2 px-sm-4 py-2">
                        <button type="button" className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={closePaymentModel}
                            onKeyPress={closePaymentModel}>X
                        </button>
                        <div className="modal-body">
                            <div className="row">
                                <div
                                    className="col-lg-7 col-12 border-4 border-end border-right-0">
                                    <div
                                        className="pe-lg-2 me-lg-1 mt-4 mt-sm-5 mt-lg-0">
                                        <h5 className="modal-title payment-modal__top-title border-bottom border-4 mb-3 text-start"
                                            id="paymentModalLabel">
                                            Payment
                                        </h5>
                                        <div className="custom-scrollbar">
                                            {paymentMethods.map((paymentMethod, index) => {
                                                return loadPaymentMethods(paymentMethod, index)
                                            })}
                                        </div>
                                    </div>
                                    <button type="button"
                                        className="btn btn-primary modal-btn w-100 mt-3"
                                        onClick={() => addNewPaymentMethod()}>
                                        Add Payment Now
                                    </button>
                                </div>
                                <div className="col-lg-5 col-12">
                                    {finalPriceStatus()}
                                    {loadPrintBlock()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-overlay" onClick={closePaymentModel}
                    role="button" tabIndex="0" aria-label="background overlay"
                    onKeyDown={closePaymentModel}>{ }</div>
            </div>
        </div>
    )
}

export default connect(null, { notify, finalizePayment, updateFinalizePayment })(Payment);
