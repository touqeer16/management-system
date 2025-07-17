import React, { useEffect, useState, useRef } from "react";
import "bluebird";
import 'cputil';
import '../scss/layout.scss';
import '../scss/style.scss';
import { calculateCartTotalPrice, calculateCartTotalDiscount, calculateCartTotalDiscountType, calculateCartTotalTax } from "../../shared/CalculateProductPrice";
import { useEventListener, ESCAPE_KEYS } from "../../shared/UseEventListener";
import { connect } from "react-redux";
import { notify } from "../../store/action/notificationAction";
import NumberKeyboard from "./NumberKeyboard";
import { finalizePayment, sendPrintApi, updateFinalizePayment, fetchFinalizePaymentFromIndexedDB, SavePendingFinalizePayment } from "../../store/action/finalizePaymentAction";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import prepareSuspendedData from "../../shared/prepareSuspendedData";
import { toFixedTrunc } from "../../shared/CalculateProductPrice";
import { QRCodeCanvas } from 'qrcode.react';
import { Buffer } from 'buffer';
import QR from 'qrcode-base64';
import { random } from "lodash";
import { constants } from "../../constants";
import { toast } from 'react-toastify';
import apiConfig from "../../config/apiConfig";
import { array } from "prop-types";
import db from '../../indexDb';
import { environment } from '../../environment';
import swal from 'sweetalert';
import { fetchTableData } from "../../store/action/tableAction";

const SweetAlert = require('react-bootstrap-sweetalert');
const CASH = 'cash'
const CARD = 'card';
const CLIENT = 'custom_pay_1';
const RESET = 'reset';
const PREPAID = 'prepaid';
const IPAddress = "192.168.1.7";
const wampServer = environment.URL;






export class PrintDataDynamicData extends React.PureComponent {
    render() {

        const print = this.props.paymentPrint;
        const user = this.props.user;
        const locations = this.props.locations;
        const sendPrintApi = this.props.sendPrintApi;
        /*  console.log("user>>>> ", user); */
        console.log("user>>>> ", user);
        console.log("print>>>> ", print);
        console.log("locations>>>> ", locations);
        generateDynamicHTML(print, user, locations, sendPrintApi);
        /*  multipleKitchenOneReceipt(print, locations); */
        return true;

    }
}


export class PrintData extends React.PureComponent {

    render() {
        const paymentPrint = this.props.paymentPrint;
        const user = this.props.user;
        console.log("user>>>> ", user);
        console.log("print>>>> ", paymentPrint);


        let modifierText = [];
        if (!paymentPrint || paymentPrint.length === 0) {
            return (<div />);
        }
        const countTotalTax = (tax) => {
            let totalAmount = 0;
            tax && tax.appliedTax && tax.appliedTax.forEach(cartItem => {
                totalAmount = totalAmount + cartItem.tax_amount;
            });
            return +totalAmount.toFixed(4);
        }
        const totalProductTax = countTotalTax(paymentPrint);
        const totalModifierTax = paymentPrint.modifier_tax;
        const taxAmount = totalProductTax + totalModifierTax;
        const subTotalRounded = (paymentPrint.final_total -
            parseFloat(taxAmount).toFixed(2));
        let allModifierTax = 0;

        const loadFreeModifiers = (modifiers, borderTopFreeModifers,borderBottomFreeModifers) => {
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
                <tr style={{ "border-top": borderTopFreeModifers, "border-bottom": borderBottomFreeModifers, "font-size": "14px" }} >
                    <td style={{ "font-size": "14px" }}></td>
                    <td style={{ "font-size": "14px" }}>{modifierText.join(', ')}</td>
                    <td style={{ "font-size": "14px" }}></td>
                    <td style={{ "font-size": "14px" }}></td>
                </tr>
            )
        }

        const loadDiscount = (paymentPrint) => {
            if (paymentPrint.discount !== 0) {
                return (
                    <tr>
                        <th style={{ "text-align": "right", "font-size": "16px", "width": "50%" }}>{paymentPrint.line_discount_label}</th>
                        <td style={{ "text-align": "end", "font-size": "13px", "width": "50%" }}><b>{paymentPrint.discount}</b></td>
                    </tr>
                )
            }
        }

        const loadDiscountAfterpayment = (paymentPrint) => {
            if (paymentPrint.discount !== 0) {
                return (
                    <tr>
                        <th style={{ "text-align": "right", "width": "50%" }}>
                            {paymentPrint.total_paid_label} <br />إجمالي بعد الخصم
                        </th>
                        <td style={{ "text-align": "end", "padding": "0px", "font-size": "16px", "width": "50%" }}><b> {(paymentPrint.final_total) + '﷼ '}  </b></td>
                    </tr>
                )
            } else {
                return (
                    <tr>
                        <th style={{ "text-align": "right", "width": "50%" }}>
                            {paymentPrint.total_label} <br />إجمالي
                        </th>
                        <td style={{ "text-align": "end", "padding": "0px", "font-size": "16px", "width": "50%" }}><b> {(paymentPrint.final_total) + '﷼ '}  </b></td>
                    </tr>
                )
            }
        }
        const returnedPaymentStatus = (paymentPrint) => {
            if (paymentPrint.payment_status == 'returned') {
                return (
                    <tr>
                        <th style={{ "text-align": "right", "font-size": "16px", "width": "50%" }}>{paymentPrint.payment_status_label}
                        </th>
                        <td style={{ "text-align": "end", "font-size": "16px", "width": "50%" }}>{paymentPrint.payment_status}</td>
                    </tr>
                )
            }
        }

        const loadClientPayment = (paymentPrint) => {
            if (paymentPrint.clientCompany != '') {
                return (
                    <tr>
                        <th style={{ "text-align": "right", "font-size": "16px", "width": "50%" }}>{paymentPrint.clientCompanyLabel}
                        </th>
                        <td style={{ "text-align": "end", "font-size": "16px", "width": "50%" }}>{paymentPrint.clientCompany}</td>
                    </tr>
                )
            }
        }
        const loadTableName = (paymentPrint) => {
            if (paymentPrint.table != '') {
                return (
                    <tr>
                        <th>
                            <p style={{ "text-align": "center", "font-size": "20px", "font-weight": "bold" }}> {paymentPrint.table}</p>
                        </th>
                    </tr>
                )
            }
        }
        return (
            <div id="printPDF">
                <div>
                    <div style={{ "width": "100%", "padding": "10px" }}>
                        <table id="header_text_popUP" style={{ "margin": "auto" }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <p style={{ "text-align": "center", "margin-top": "5px", " margin-bottom": " 5px" }}>
                                            <img style={{ " display": "block", "margin-left": "auto", "margin-right": " auto" }} src={paymentPrint.logo} alt="logo" width="180" height="122" />
                                        </p>
                                        <div style={{ "font-weight": "unset", "font-size": "14px" }} className="post__content" dangerouslySetInnerHTML={{ __html: paymentPrint.header_text }} ></div>
                                        <p style={{ 'textAlign': 'center', 'margin': '0px' }}>  {paymentPrint.sub_heading_line1} </p>
                                        <p style={{ 'textAlign': 'center', 'margin': '0px' }}>  {paymentPrint.sub_heading_line2} </p>
                                        <p style={{ 'textAlign': 'center', 'margin': '0px' }}> {paymentPrint.sub_heading_line3} </p>
                                        <p style={{ 'textAlign': 'center', 'margin': '0px' }}>  {paymentPrint.sub_heading_line4} </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style={{ 'text-align': 'center', 'margin': '-5px' }}>
                                            {paymentPrint.address} /  {paymentPrint.display_name}
                                        </p>
                                        <p style={{ 'textAlign': 'center' }}> {paymentPrint.sub_heading_line5} </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table id="header_call_no_popUP" style={{ "margin": "auto" }}>
                            <tbody>
                                <tr>
                                    <th>
                                        <p style={{ "text-align": "center", "border": "1px solid", "border-color": "black", "padding": "2px", "font-size": "40px", "font-weight": "lighter" }}>Order# {paymentPrint.call_no}</p>
                                    </th>
                                </tr>
                                {loadTableName(paymentPrint)}
                            </tbody>
                        </table>
                        <hr style={{ "border": "1px solid #000000", "marginBottom": "0", "marginTop": "5px" }} />
                        <table id="invoice_no_popUP" style={{ "width": "100%", "marginBottom": "0px" }}>
                            <tbody>
                                <tr>
                                    <th style={{ 'width': '50%', "text-align": "start", "font-size": "15px", "padding": "0px" }}>
                                        <b>{paymentPrint.order_type_name_label}</b>
                                    </th>
                                    <th style={{ 'width': '50%', "text-align": "end", "padding": "0px", "font-size": "15px" }}>
                                        {paymentPrint.order_type_name}
                                    </th>
                                </tr>
                                <tr>
                                    <th style={{ 'width': '50%', "text-align": "start", "font-size": "15px", "padding": "0px" }}>
                                        <b>{paymentPrint.invoice_no_prefix}</b>
                                    </th>
                                    <th style={{ 'width': '50%', "text-align": "end", "padding": "0px", "font-size": "15px" }}>
                                        {paymentPrint.invoice_no}
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                        <table id="date_popUP" style={{ "width": "100%", "margin-bottom": "10px" }}>
                            <tbody>
                                <tr>
                                    <th style={{ "text-align": "start", "font-weight": "bold", "padding": "0", "font-size": "16px" }}>
                                        <b>{paymentPrint.date_label}</b>
                                    </th>
                                    <td style={{ "text-align": "end", "font-weight": "bold", "padding": "0", "font-size": "16px", "white-space": "nowrap" }}>
                                        {paymentPrint.invoice_date}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table id="line_item_popUP" style={{ "width": "100%", "margin-bottom": "5px", "text-align": "center" }}>
                            <tbody>
                                <tr>
                                    <th style={{ "padding": "0px", "border-bottom": "2.5px dashed darkgrey", "font-size": "15px" }}>
                                        {paymentPrint.table_qty_label}
                                    </th>
                                    <th style={{ "padding": "5px", "border-bottom": "2.5px dashed darkgrey", "font-size": "15px" }}>
                                        {paymentPrint.table_product_label}
                                    </th>

                                   {/*  <th style={{ "padding": "0px", "border-bottom": "2.5px dashed darkgrey", "font-size": "15px" }}>
                                        {paymentPrint.table_subtotal_label}
                                    </th> */}
                                    <th style={{ "padding": "5px", "border-bottom": "2.5px dashed darkgrey", "font-size": "15px" }}>
                                        {paymentPrint.discount_label}
                                    </th>
                                    <th style={{ "padding": "0px", "border-bottom": "2.5px dashed darkgrey", "font-size": "15px" }}>
                                        {paymentPrint.total_paid_label}
                                    </th>
                                </tr>
                                {
                                    paymentPrint && paymentPrint.lines.map((line, index, lastindexOfArray) => {
                                        let lineBelow = "none";
                                        let notLineatEnd = "none";
                                        let borderTopFreeModifers = "2px dashed";
                                        let borderBottomFreeModifers = "1px solid";
                                        let lastItem = '';
                                        let line_discount = line.line_discount;
                                        const arrayLength = lastindexOfArray.length - 1;
                                        if (line.modifiers && line.modifiers.length !== 0) {
                                            lineBelow = "none";
                                            if (index === arrayLength) {
                                                notLineatEnd = "none";
                                                lastItem = true;
                                            } else {
                                                notLineatEnd = "1px solid";
                                            }
                                        } else {
                                            if (index === 0) {
                                                lineBelow = "1px solid";
                                            } else if (index === arrayLength) {
                                                lineBelow = "none";
                                                notLineatEnd = "none";
                                            } else {
                                                lineBelow = "1px solid";
                                            }
                                        }

                                        index = index + 1;
                                        const unitPriceRounded = toFixedTrunc(line.unit_price, 4);
                                        const roundedValue = +unitPriceRounded + line.single_product_tax;
                                        const subTotalFinal = +roundedValue.toFixed(2) * line.quantity;
                                        const line_total = line.line_total;
                                        return (
                                            <>
                                                <tr style={{ "font-size": "16px", "border-bottom": lineBelow }} key={index}>
                                                    <td style={{ "text-align": "center", "padding": "0px", "font-size": "18px" }}>
                                                        <b>{line.quantity}</b>
                                                    </td>
                                                    <td style={{ "text-align": "center" }}>{line.name}</td>
                                                   {/*  <td style={{ "text-align": "center", "padding": "0px" }}>{line.sell_price_inc_tax}</td> */}
                                                    <td style={{ "text-align": "center", "padding": "0px" }}>{line.line_discount}</td>
                                                    <td style={{ "text-align": "center", "padding": "0px" }}> {line.line_total} </td>
                                                </tr>
                                                {
                                                    line.modifiers && line.modifiers.length !== 0 ?
                                                        line.modifiers.map((modifier, indexLine) => {
                                                            let lineBelowModifier = "none";
                                                            const arrayLengthModifier = line.modifiers.length - 1;
                                                            if ((indexLine === arrayLengthModifier)) {
                                                                lineBelowModifier = "2px dashed";
                                                            } else {
                                                                lineBelowModifier = "none";
                                                            }
                                                            const modifierPrice = toFixedTrunc(modifier.unit_price_inc_tax, 4);
                                                            const unit_price_exc_tax = toFixedTrunc(modifier.unit_price_exc_tax, 4);
                                                            let calTax = 0;
                                                            if (modifier.tax_id && modifier.tax_id > 0) {
                                                                calTax = unit_price_exc_tax * modifier.tax_amount / 100;
                                                                allModifierTax = allModifierTax + (calTax.toFixed(2) * line.quantity);
                                                            }
                                                            const roundedValue = (+modifierPrice).toFixed(2);
                                                            if (+modifier.sell_price_inc_tax > 0) {
                                                                return (
                                                                    <tr style={{ "border-bottom": lineBelowModifier, "font-size": "14px" }} key={indexLine}>
                                                                        <td style={{ "text-align": "center", "padding": "0px", "font-size": "14px" }}>
                                                                        </td>
                                                                        {/* <td style={{ "text-align": "center", "padding": "0px", "font-size": "14px" }}>
                                                                            <b>{modifier.quantity}</b>
                                                                        </td> */}
                                                                        <td style={{ "text-align": "center" }}>{modifier.variation}</td>
                                                                        <td style={{ "text-align": "center" }}></td>
                                                                        <td style={{ "text-align": "center", "padding": "0px" }}>
                                                                            {(roundedValue * modifier.quantity).toFixed(2)}
                                                                        </td>
                                                                       
                                                                        {/* <td style={{ "text-align": "center" }}></td> */}

                                                                    </tr>
                                                                )
                                                            }
                                                        }) : null
                                                }
                                                {line.modifiers && line.modifiers.length !== 0 && loadFreeModifiers(line.modifiers, borderTopFreeModifers,borderBottomFreeModifers)}

                                            </>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <hr style={{ "border": "1px solid black" }} />
                        <table id="subtotal_popUP" style={{ "width": "100%" }}>
                            <tbody>
                                <tr>
                                    <th style={{ "text-align": "right", "padding": "0px", "font-size": "16px", "width": "50%" }}>
                                        {paymentPrint.subtotal_label} <br />المجموع الفرعي
                                    </th>
                                    <th style={{ "text-align": "end", "padding": "0px", "font-size": "16px", "width": "50%" }}>
                                        <b>{((paymentPrint.final_total) - (allModifierTax + totalProductTax)).toFixed(2) + '﷼ '}</b>
                                    </th>
                                </tr>
                                <tr>
                                    <th style={{ "text-align": "right", "font-size": "16px", "width": "50%" }}>{paymentPrint.tax_label}:</th>
                                    <td style={{ "text-align": "end", "font-size": "16px", "width": "50%" }}>(+) ﷼ {(allModifierTax + totalProductTax).toFixed(2)}</td>


                                </tr>
                                {loadDiscount(paymentPrint)}
                                {loadDiscountAfterpayment(paymentPrint)}
                                {
                                    paymentPrint.payments && paymentPrint.payments.length !== 0 ? paymentPrint.payments.map((payment, index) => {
                                        return (
                                            <>
                                                <tr key={index}>
                                                    <th style={{ "text-align": "right", "font-size": "16px", "width": "50%" }}>{payment.method}
                                                    </th>
                                                    <td style={{ "text-align": "end", "font-size": "16px", "width": "50%" }}>{payment.amount}</td>
                                                </tr>
                                            </>
                                        )
                                    }) : null

                                }
                                {loadClientPayment(paymentPrint)}
                                {returnedPaymentStatus(paymentPrint)}
                            </tbody>
                        </table>
                        <hr style={{ "border": "1px solid black", "margin-bottom": "0" }} />
                        <p style={{ "textAlign": 'center', "margin": '0' }} >Products Count  {paymentPrint.lines.length} </p>
                        <hr style={{ "border": "1px solid black", "margin-top": "5px", "margin-bottom": "3px" }} />

                        <table id="footer_popUP" style={{ "width": "100%", "margin-top": "0px" }}>
                            <tbody style={{ "width": "100%" }}>
                                <tr>
                                    <td>
                                        <div style={{ "font-weight": "unset", "font-size": "14px" }} className="post__content" dangerouslySetInnerHTML={{ __html: paymentPrint.footer_text }} ></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table id="additional_notes_popUP" style={{ "width": "100%", "display": "none" }}>
                            <tbody style={{ "width": "100%" }}>
                                <tr>
                                    <td>
                                        <p style={{ "text-align": "center", "margin": "0" }}>{paymentPrint.additional_notes}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {loadQrCode(paymentPrint, allModifierTax, totalProductTax, user)}
                    </div>
                </div>
            </div >
        )
    }
}
const getTLVForvalue = (tagNum, tagValue) => {
    try {
        let tagBuf = Buffer.from([tagNum], 'UTF-8');
        let tagValuelenBuf = Buffer.from([tagValue.length], 'UTF-8');
        let tagValueBuf = Buffer.from(tagValue, 'UTF-8');
        let bufsArray = [tagBuf, tagValuelenBuf, tagValueBuf]
        return Buffer.concat(bufsArray);
    } catch (e) {
        toast.error('Error in QRCode !', { position: toast.POSITION.TOP_RIGHT });
    }

}


const loadQrCode = (paymentPrint, allModifierTax, totalProductTax, user) => {
    console.log(" loadQrCode>>> ", user);
    //let VATNumber = "310099050100003";
    let VATNumber = user.tax_number_1;

    //let businessName = "Shawerma Elak";
    let businessName = user.business_name;

    let nameArabic = "شاورما الك";
    //console.log("01" + convertToHex(businessName));
    // let sellerNameBufAR = toUTF8Array(nameArabic);
    //let sellerNameBufAR = getTLVForvalue("0", nameArabic);
    // console.log(sellerNameBufAR);
    var uint8array = new TextEncoder("utf-8").encode(nameArabic);
    var string = new TextDecoder().decode(uint8array);
    // console.log(uint8array);
    // console.log(string);
    let TotalAmountWithoutCurrency = paymentPrint.total.replace('﷼', '');
    //TotalAmountWithoutCurrency = parseFloat(TotalAmountWithoutCurrency.replaceAll(',', ''));
    //let TotalAmountWithoutCurrency = paymentPrint.totalAmountWithoutCurrency;
    //let moditax = paymentPrint.totalTaxAmountWithoutCurrency;
    let invoice_date = paymentPrint.invoice_date;
    let CurrentUTCTimeStamp = moment.utc(new Date()).format();
    //let CurrentUTCTimeStamp = moment.utc(invoice_date).format();
    let moditax = (allModifierTax + totalProductTax).toFixed(2);
    if (businessName && VATNumber && CurrentUTCTimeStamp && moditax && TotalAmountWithoutCurrency) {
        let sellerNameBuf = getTLVForvalue("01", businessName);
        let vatRegistrationNameBuf = getTLVForvalue("02", VATNumber);
        let timeStampBuf = getTLVForvalue("03", CurrentUTCTimeStamp);
        let taxTotalNameBuf = getTLVForvalue("04", TotalAmountWithoutCurrency);
        let vatTotalBuf = getTLVForvalue("05", moditax);
        let tagsBuffsArray = [sellerNameBuf, vatRegistrationNameBuf, timeStampBuf, taxTotalNameBuf, vatTotalBuf];
        // let tagsBuffsArray = [sellerNameBufAR];
        let qrCodeBuf = Buffer.concat(tagsBuffsArray);
        let qrCodeB64 = qrCodeBuf.toString('base64');
        let generatedBase64String = paymentPrint.generatedBase64String + qrCodeB64;
        //console.log(generatedBase64String);
        //let qrCodeB64 = "AQpTaGF3ZXJtYSBFbGFrAjMxMDA5OTA1MDEwMDAwMwMyMDIyLTA5LTE0VDEyOjUwOjAwWgQgMy4wMAUwLjM5";
        // let qrCodeqrCodeHex = sellerNameBuf + " " + vatRegistrationNameBuf + " " + timeStampBuf + " " + taxTotalNameBuf + " " + vatTotalBuf;
        // let qrCodeB64 = hexToBase64(qrCodeqrCodeHex);
        if (paymentPrint.qrcode) {
            return (
                <table id="qr_code" style={{ "width": "100%", "text-align": "center", "margin-top": "10px" }}>
                    <tbody style={{ "width": "100%" }}>
                        <tr>
                            <td>
                                <div style={{ "font-weight": "unset" }}>
                                    <img style={{ "height": "160px", "width": "160px" }} src={paymentPrint.qrcode} alt="" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )
        } else {
            return (
                <table id="qr_code" style={{ "width": "100%", "text-align": "center", "margin-top": "10px" }}>
                    <tbody style={{ "width": "100%" }}>
                        <tr>
                            <td>
                                <div style={{ "font-weight": "unset" }}> </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )
        }
    }

}

const Payment = (props) => {
    const { carts, notify, finalizePayment, sendPrintApi, updateCart, setTableId, setServiceId, customer, updateFinalizePayment, fetchFinalizePaymentFromIndexedDB, fetchTableData, transactionId, orderType, addOrderType, selectedLocationId, serviceId, tableId, user, locations } = props;
    const [isPaymentOpenModal, setIsPaymentOpenModal] = useState(false);
    const [finalAmount, setFinalAmount] = useState(0);
    const [selectedInputIndex, setSelectedInputIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [backColor, setBackColor] = useState(false);
    const [printShow, setPrintShow] = useState(false);
    const [saleStaffInputs, setsaleStaffInputs] = useState({
        sale_note: '',
        staff_note: '',
    });
    const [clientShow, setClientShow] = useState(false);
    const [resetShow, setresetShow] = useState(true);

    const [paymentPrints, setPaymentPrints] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([
        {
            amount: +finalAmount,
            payment_type: ''
        }
    ]);
    const [clientCompany, setClientCompany] = useState(['']);

    const [errorMsg, setErrorMsg] = useState('');
    const componentRef = useRef();
    const [isWifiConnection, setIsWifiConnection] = useState(true);



    useEffect(() => {
        //every second check internet connection
        const interval = setInterval(() => {
            if (navigator.onLine) {
                setIsWifiConnection(true);
                // SavePendingFinalizePayment();
            } else {
                setIsWifiConnection(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);




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
        // if (isWifiConnection) {
        //     SavePendingFinalizePayment();
        // }
        setresetShow(true);
        const finalAmount = calculateCartTotalPrice(carts);
        /* connectPrinter(); */
        setFinalAmount(+finalAmount);
        updateAmount(finalAmount, 0);
        setPaymentMethods([
            {
                amount: +finalAmount,
                payment_type: ''
            }
        ]);
    }, [carts, isPaymentOpenModal, updateCart, transactionId]);

    useEffect(() => {
        document.body.style.overflow = isPaymentOpenModal ? 'hidden' : 'unset';
    }, [isPaymentOpenModal]);

    // Close a Payment Model
    const closePaymentModel = () => {
        setIsPaymentOpenModal(false);
        setErrorMsg('');
    };



    const handleChange = (e) => {
        e.persist();
        setsaleStaffInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    };

    const SweatAlertReturn = () => {
        swal({
            title: "Paymnet Error",
            text: "Please select the payment method.",
            icon: "warning",
            dangerMode: true,
        })
    }

    const SweatAlertReturnClientCompany = () => {
        swal({
            title: "Client Company",
            text: "Please select the company  name.",
            icon: "warning",
            dangerMode: true,
        })
    }

    //Finalize API
    const finalizeData = () => {

        let payment_type = paymentMethods[0].payment_type ?? "";

        console.log("payment_type>>>> ", payment_type);
        console.log("clientCompany: >>> ", clientCompany);
        console.log("payment_type>>>> ", paymentMethods);

        let custom_pay_1 = paymentMethods[0].custom_pay_1 ?? "";
        if ((custom_pay_1 != "") && ((clientCompany == ''))) {
            SweatAlertReturnClientCompany();
            return;
        }
        if (payment_type == '') {
            SweatAlertReturn();
            return;
        }


        document.getElementById("modal__finalize_btn").disabled = true;

        // draw(); return;

        const formData = [];
        formData.push({
            cart: carts,
            paymentCarts: paymentMethods,
            clientCompany: clientCompany,
            orderType: orderType ? orderType : null,
            changeReturn: calculateReturnExchange(),
            balance: calculateReturnBalance(),
            tax_calculation_amount: calculateCartTotalTax(carts),
            discount_amount: calculateCartTotalDiscount(carts),
            discount_type: calculateCartTotalDiscountType(carts),
            finalTotal: finalAmount,
            finalTotalWithoutCurrency: finalAmount,
            suspended: 0,
            customerId: customer ? customer.id : 'no_customer_select',
            transactionId: transactionId ? transactionId : null,
            serviceId,
            tableId,
            saleNote: saleStaffInputs.sale_note,
            staffNote: saleStaffInputs.staff_note
        });
        if (transactionId) {
            updateFinalizePayment(prepareSuspendedData(formData, selectedLocationId), transactionId, (cb) => {
                if (cb.status) {
                    setPaymentPrints(cb.data);
                    fetchTableData(user.location_id);
                    if (cb.receipt) {
                        setPrintShow(true);
                        loadPrintDynamicBlock(cb.data, user, locations, sendPrintApi);
                        printPaymentReceiptPdf();
                        setIsPaymentOpenModal(false);
                        updateCart([]);
                        setTableId('');
                        setServiceId('');
                        addOrderType('');
                        saleStaffInputs.sale_note = '';
                        saleStaffInputs.staff_note = '';
                    } else {
                        printPaymentReceiptPdf();
                        printCustomReceipt(cb.data);
                        setIsPaymentOpenModal(false);
                    }
                }
            });
        } else {
            if (!isWifiConnection) {
                fetchFinalizePaymentFromIndexedDB(prepareSuspendedData(formData, selectedLocationId), formData, (cb) => {
                    if (cb.status) {
                        setPaymentPrints(cb.data);
                        fetchTableData(user.location_id);
                        if (cb.receipt) {
                            setPrintShow(true);
                            loadPrintDynamicBlock(cb.data, user, locations, sendPrintApi);
                            printPaymentReceiptPdf();
                            setIsPaymentOpenModal(false);
                            updateCart([]);
                            setTableId('');
                            setServiceId('');
                            addOrderType('');
                            saleStaffInputs.sale_note = '';
                            saleStaffInputs.staff_note = '';
                        } else {
                            printPaymentReceiptPdf();
                            printCustomReceipt(cb.data);
                            setIsPaymentOpenModal(false);
                        }
                    }
                });
            } else {
                finalizePayment(prepareSuspendedData(formData, selectedLocationId), (cb) => {
                    if (cb.status) {
                        setPaymentPrints(cb.data);
                        fetchTableData(user.location_id);
                        if (cb.receipt) {
                            setPrintShow(true);
                            loadPrintDynamicBlock(cb.data, user, locations, sendPrintApi);
                            printPaymentReceiptPdf();
                            setIsPaymentOpenModal(false);
                            updateCart([]);
                            setTableId('');
                            setServiceId('');
                            addOrderType('');
                            saleStaffInputs.sale_note = '';
                            saleStaffInputs.staff_note = '';
                        } else {
                            printPaymentReceiptPdf();
                            printCustomReceipt(cb.data);
                            setIsPaymentOpenModal(false);
                        }
                    } else {
                        setIsPaymentOpenModal(false);
                    }
                });
            }
        }
        setClientCompany('');
        removePaymentMethod();
    };
    const handleAfterPrint = () => {
        console.log("`onAfterPrint` called");
    };

    const handleBeforePrint = () => {
        console.log("`onBeforePrint` called");
    };
    const handleOnBeforeGetContent = () => {
        console.log("`onBeforeGetContent` called");
    };

    const printPaymentReceiptPdf = () => {
        /*  let dynHtml = "print://escpos.org/escpos/net/print?srcTp=uri&srcObj=html&numCopies=2&src='data:text/html,";
         dynHtml += encodeURIComponent(document.getElementById("printPDF").innerHTML)
         dynHtml += "'";
         window.location.href = dynHtml; */
        document.getElementById('printReceipt').click();
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    // onBeforeGetContent: () => handleOnBeforeGetContent(),
    // onBeforePrint: () => handleBeforePrint(),
    // onAfterPrint: () => handleAfterPrint(),


    // Open a Payment Model
    const openPaymentModel = () => {
        if (carts.length > 0) {
            setIsPaymentOpenModal(true);
        } else {
            notify('Please add at least one product into cart.');
        }
        /* if (finalAmount > 0) {
            setIsPaymentOpenModal(true);
        } else {
            // Display Validation message if cart is empty.
            notify('Please add at least one product into cart.');
        } */
    };

    // Payment method selection
    /* const selectMethod = (type, index) => {
        console.log(type);
        const methods = paymentMethods.slice();
        methods[index].payment_type = type;
        setPaymentMethods(methods);
        if (type === "custom_pay_1") {
            setClientShow(true);
        } else {
            setClientShow(false);
        }
    
    } */

    const selectMethod = (type, index, clientShow) => {
        console.log(type);
        const methods = paymentMethods.slice();
        if (type === "custom_pay_1") {
            setClientCompany('');
            methods[index].payment_type = '';
            methods[index].custom_pay_1 = 'custom_pay_1';
            setPaymentMethods(methods);
            setClientShow(!clientShow);
            setresetShow(false);
        } else if (type === "reset") {
            setClientCompany('');
            methods[index].custom_pay_1 = '';
            setClientShow(!clientShow);
            methods[index].payment_type = '';
            setPaymentMethods(methods);
            setresetShow(true);
        }
        else {
            // setClientCompany(null);
            // methods[index].custom_pay_1 = '';
            methods[index].payment_type = type;
            setPaymentMethods(methods);
            //setClientShow(false);
            //setresetShow(true);
        }
        console.log("methods>>>> ", methods);

    }

    const selectClientCompany = (type, appname) => {
        console.log(type);
        console.log(appname);
        setClientCompany(type);
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
                payment_type: ''
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

    const checkIfitemInCart = () => {
        let payableAmt = 0;
        if (carts.length > 0) {
            payableAmt = 1;
        } else {
            payableAmt = 0;
        }


        /* if (finalAmount > 0) {
            setIsPaymentOpenModal(true);
        } else {
            // Display Validation message if cart is empty.
            notify('Please add at least one product into cart.');
        } */
        return +payableAmt.toFixed(2);
    };

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
        let custom_contact = '';
        if (locations && locations.business_locations && locations.business_locations.length !== 0) {
            locations.business_locations.map((location) => {
                custom_contact = location.custom_contact;
            });
        } else {
            custom_contact = '';
        }
        let hidecustom_contact = '';
        if ((custom_contact == null) || (custom_contact == '')) {
            hidecustom_contact = 'd-none';
        }

        return (
            <div
                className={`${index === 0 ? '' : 'custom-card-space'} pos-modal payment-modal__payment-method bg-secondary p-3`}
                key={index}>
                {clientShow ? <div className={`modal-btn-grp ${hidecustom_contact}`} >

                    <h6 className="modal-subtitle mb-2"
                        id="paymentModalLabel">
                        Select Client Company Name:
                    </h6>
                    {
                        custom_contact && custom_contact.map((clientApp) => {
                            return (
                                <>
                                    <button type="button" onClick={() => selectClientCompany(clientApp.id, clientApp.app_name)}
                                        className={`btn modal-btn ${clientCompany === clientApp.id ? 'btn-primary me-2' : 'btn-secondary me-2'}`}>
                                        {clientApp.app_name}
                                    </button>
                                </>
                            )
                        })

                    }
                    <hr style={{ "border": "2px solid #5fc6b0", "marginBottom": "10px", "marginTop": "15px" }} />
                </div>
                    : null
                }
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
                        className={`btn modal-btn ${(paymentMethod.payment_type === CASH) ? 'btn-primary me-2' : 'btn-secondary me-2'}`}>
                        Cash
                    </button>
                    <button type="button" onClick={() => selectMethod(CARD, index)}
                        className={`btn modal-btn ${(paymentMethod.payment_type === CARD) ? 'btn-primary me-2' : 'btn-secondary me-2'}`}>
                        Card
                    </button>

                    <button type="button" onClick={() => selectMethod(PREPAID, index)}
                        className={`btn modal-btn ${clientShow ? 'd-inline' : 'd-none'} ${(paymentMethod.payment_type === PREPAID) ? 'btn-primary me-2' : 'btn-secondary me-2'}`}>
                        PrePaid
                    </button>

                    {/* <button type="button" onClick={() => selectMethod(CLIENT, index)}
                        className={`btn modal-btn ${paymentMethod.payment_type === CLIENT ? 'btn-primary me-2' : 'btn-secondary me-2'} ${hidecustom_contact}`}>
                        Client
                    </button> */}
                    {clientShow ?
                        <button type="button" onClick={() => selectMethod(RESET, index, clientShow)}
                            className={`btn modal-btn ${clientShow ? 'btn-info me-2' : 'btn-secondary me-2'} ${hidecustom_contact}`}>
                            Reset
                        </button>
                        :
                        null
                    }

                    {resetShow ?
                        <button type="button" onClick={() => selectMethod(CLIENT, index, clientShow)}
                            className={`btn modal-btn ${clientShow ? 'btn-info me-2' : 'btn-secondary me-2'} ${hidecustom_contact}`}>
                            Client
                        </button>
                        :
                        null
                    }
                </div>
                {/* {clientShow ? <div className={`modal-btn-grp ${hidecustom_contact}`} >

                    <hr style={{ "border": "2px solid #5fc6b0", "marginBottom": "10px", "marginTop": "15px" }} />
                    <h6 className="modal-subtitle mb-2"
                        id="paymentModalLabel">
                        Select Client Company Name:
                    </h6>
                    <hr style={{ "border": "2px dashed #", "marginBottom": "5px", "marginTop": "5px" }} />
                    <button type="button" onClick={() => selectClientCompany(custom_contact.custom_field_1, index)}
                        className={`btn modal-btn ${clientCompany === custom_contact.custom_field_1 ? 'btn-primary me-2' : 'btn-secondary me-2'} ${custom_field_1}`}>
                        {custom_contact.custom_field_1}
                    </button>
                    <button type="button" onClick={() => selectClientCompany(custom_contact.custom_field_2, index)}
                        className={`btn modal-btn ${clientCompany === custom_contact.custom_field_2 ? 'btn-primary me-2' : 'btn-secondary me-2'} ${custom_field_2}`}>
                        {custom_contact.custom_field_2}
                    </button>
                    <button type="button" onClick={() => selectClientCompany(custom_contact.custom_field_3, index)}
                        className={`btn modal-btn ${clientCompany === custom_contact.custom_field_3 ? 'btn-primary me-2' : 'btn-secondary me-2'} ${custom_field_3}`}>
                        {custom_contact.custom_field_3}
                    </button>
                    <button type="button" onClick={() => selectClientCompany(custom_contact.custom_field_4, index)}
                        className={`btn modal-btn ${clientCompany === custom_contact.custom_field_4 ? 'btn-primary me-2' : 'btn-secondary me-2'} ${custom_field_4}`}>
                        {custom_contact.custom_field_4}
                    </button>
                    <button type="button" onClick={() => selectClientCompany(custom_contact.custom_field_5, index)}
                        className={`btn modal-btn ${clientCompany === custom_contact.custom_field_5 ? 'btn-primary me-2' : 'btn-secondary me-2'} ${custom_field_5}`}>
                        {custom_contact.custom_field_5}
                    </button>

                    <hr style={{ "border": "2px solid #5fc6b0", "marginBottom": "10px", "marginTop": "15px" }} />
                </div>
                    : ''}
                */}


                <div class="col-sm-12">
                    <div className="form-group custom-group">
                        <textarea className="form-control close-textarea" placeholder="Sale Note"
                            rows="2" name="sale_note" cols="50" id="sale_note" onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="form-group custom-group">
                        <textarea className="form-control close-textarea" placeholder="Staff Note"
                            rows="2" name="staff_note" cols="50" id="staff_note" onChange={(e) => handleChange(e)}
                        />
                    </div>
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
            </div >
        )
    };

    const finalPriceStatus = (paymentPrints) => {
        let displayMultiPrint = '';
        if (wampServer == 'https://fastich.tech') {
            displayMultiPrint = 'd-none';
        } else {
            displayMultiPrint = 'd-none';
        }
        return (
            <div>
                <div className="payment-modal__widgets ps-lg-2 mt-2 pt-1 d-flex flex-wrap">
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
                        {/* <div>
                            <span className="payment-modal__items d-block mb-1">
                                Total Paying
                            </span>
                            <strong
                                className="payment-modal__total-items d-block">
                                ﷼
                                {calculatePayingAmount()}
                            </strong>
                        </div> */}
                    </div>
                    <div className={`${backColor && finalAmount === calculatePayingAmount() ? 'bg-div-green' : 'bg-secondary'} payment-modal__widgets-block text-center d-flex flex-wrap align-items-center justify-content-center`}>
                        <div>
                            <span className="payment-modal__items d-block mb-1">
                                Total Payable
                            </span>
                            <strong className="payment-modal__total-items d-block"> ﷼ {finalAmount} </strong>
                            <input type="hidden" id="finalTotalWithoutCurrency" value={`${finalAmount}`} />
                        </div>
                    </div>
                    <div
                        className={`${backColor && calculateReturnExchange() > 0 ? 'bg-orange' : 'bg-secondary'} payment-modal__widgets-block text-center d-flex flex-wrap align-items-center justify-content-center`}>
                        <div>
                            <span className="payment-modal__items d-block mb-1">
                                Cash Return
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
                                Total Paying
                            </span>
                            <strong
                                className="payment-modal__total-items d-block">
                                ﷼
                                {calculatePayingAmount()}
                            </strong>
                        </div>
                    </div>
                    {/*  <div
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
                    </div> */}
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
                <div className="text-center">
                    {/* <p className="product-checkout__discount mb-0 text-center custom-text">
                        Discount: {calculateCartTotalDiscount(carts)} SR
                    </p>

                    <p className="product-checkout__discount mb-0 text-center custom-text">
                        Discount Type: {calculateCartTotalDiscountType(carts)}
                    </p> */}

                    <button type="button" onClick={() => generateDynamicHTMLDemo()}
                        disabled={calculatePayingAmount() === 0}
                        className={` ${displayMultiPrint} btn btn-primary modal-btn mt-3 mx-lg-3 modal-footer-btn`}>
                        Print Dynamic Html
                    </button>
                    {/* <canvas id="c"></canvas> */}

                    <div id="qrcode"></div>
                    <button type="button" id="modal__finalize_btn" onClick={() => finalizeData()}
                        disabled={checkIfitemInCart() === 0}
                        className="btn btn-primary modal-btn mt-3 mx-lg-3 modal-footer-btn payment-modal__finalize-btn">
                        Finalize
                    </button>
                </div>
            </div>
        )
    };

    const loadPrintDynamicBlock = (print, user, locations, sendPrintApi) => {
        if (print && print.length !== 0) {
            generateDynamicHTML(print, user, locations, sendPrintApi);
            setClientShow(false);
            setClientCompany('');
            /*  multipleKitchenOneReceipt(print, locations); */
        }
    }

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
        console.log("loadPrintBlock>>>>");
        return (
            <div>
                <div className={'d-none'}>
                    {printShow ? <PrintData ref={componentRef} paymentPrint={paymentPrints} user={user} /> : ''}
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
                                    className="col-lg-6 col-12 border-4 border-end border-right-0">
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
                                <div className="col-lg-6 col-12">
                                    {finalPriceStatus(paymentPrints)}
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

const printCustomReceipt = (print) => {



    const domElement = document.querySelector('#printPDF');
    /*  console.log("domElement>>>> ", domElement); */
    let dynHtml = "print://escpos.org/escpos/net/print?srcTp=uri&srcObj=html&src='data:text/html,";
    /* dynHtml += encodeURIComponent(`"${print.print_url}"`); */

    dynHtml += encodeURIComponent(`"${domElement}"`);
    /* dynHtml += domElement; */
    dynHtml += "'";
    console.log("dynHtml>>>> ", dynHtml);
    window.location.href = dynHtml;
}

const generateDynamicHTML = (print, user, locations, sendPrintApi) => {
    /*  console.log("locations>>>> ", locations); */
    /* print loop  */
    /*  var element = document.getElementById("savePrintPDF");
      */

    let number_of_thermal_print_copy = 2;
    if (locations && locations.business_locations && locations.business_locations.length !== 0) {
        locations.business_locations.map((location) => {
            number_of_thermal_print_copy = location.number_of_thermal_print_copy;
        });
    } else {
        number_of_thermal_print_copy = 2;
    }
    if (print && print.length !== 0) {
        const countTotalTax = (tax) => {
            let totalAmount = 0;
            tax && tax.appliedTax && tax.appliedTax.forEach(cartItem => {
                totalAmount = totalAmount + cartItem.tax_amount;
            });
            return +totalAmount.toFixed(4);
        }
        const totalProductTax = countTotalTax(print);
        let allModifierTax = 0;
        const totalModifierTax = print.modifier_tax;
        const taxAmount = totalProductTax + totalModifierTax;
        const subTotalRounded = (print.final_total - parseFloat(taxAmount).toFixed(2));
        let modifierText = [];
        let dynHtml = "";
        /* Main savePrintPDF div */
        dynHtml += "<div id='savePrintPDF'>";
        /* Main div */
        dynHtml += "<div style=''>";
        /* Second mian div */
        dynHtml += "<div style='width: 100%;padding: 10px;'>";
        /* Header table */
        dynHtml += "<table id='header_text' style='margin: auto;'>";
        dynHtml += "<tbody>";
        dynHtml += "<tr><td>";
        dynHtml += "<p style='text-align:center;margin-top:5px;margin-bottom:5px;'><img width='180' height='122' style='display:block;margin-left:auto;margin-right:auto;' src='" + print.logo + "' /></p>";
        dynHtml += "<div style='font-weight: lighter;font-size: 14px;'>" + print.header_text + "</div>";
        dynHtml += "<p style='text-align:center;margin: 0px;'> " + print.sub_heading_line1 + "</p>";
        dynHtml += "<p style='text-align:center;margin: 0px;'> " + print.sub_heading_line2 + "</p>";
        dynHtml += "<p style='text-align:center;margin: 0px;'> " + print.sub_heading_line3 + "</p>";
        dynHtml += "<p style='text-align:center;margin: 0px;'> " + print.sub_heading_line4 + "</p>";
        dynHtml += "</td></tr>";
        dynHtml += "<tr>";
        dynHtml += "<td>";
        dynHtml += "<p style='text-align:center;margin: -5px;'>" + print.address + " / " + print.display_name + "</p>";
        dynHtml += "<p style='text-align:center;margin: 0px;font-size: 14px;'> " + print.sub_heading_line5 + "</p>";
        dynHtml += "</td>";
        dynHtml += "</tr>";
        dynHtml += "</tbody>";
        dynHtml += "</table>";
        /* header table end */


        /* order number table */
        dynHtml += "<table id='header_call_no' style='margin: auto;'>";
        dynHtml += "<tbody>";
        dynHtml += "<tr>";
        dynHtml += "<th><p style='text-align:center;border: 1px solid;border-color: black;padding: 2px;font-size: 40px;font-weight: lighter; '>Order";
        dynHtml += "<img style = 'width:20px;' src = 'https://panel.fastich.tech/img/hashtag.png' /> " + print.call_no + "</p > </th > ";
        dynHtml += " </tr>";
        if (print.table !== '') {
            dynHtml += "<tr>";
            dynHtml += "<th><p style='text-align:center;font-size: 20px;font-weight: bold; '>" + print.table + "</p></th>";
            dynHtml += "</tr>";
        }
        dynHtml += " </tbody>";
        dynHtml += "</table>";

        /*Horizental  Line */
        dynHtml += "<hr style='border: 1px solid black;margin-bottom: 0;margin-top: 5px;' />";
        /* invoice No table */
        dynHtml += "<table id='invoice_no' style='width: 100%;margin-bottom: 0px;'>";
        dynHtml += "<tbody>";
        dynHtml += "<tr>";
        dynHtml += "<th style='width: 50%;text-align: start;padding: 0px;font-size: 15px;'>";
        dynHtml += "<b>" + print.order_type_name_label + "</b>";
        dynHtml += "</th>";
        dynHtml += "<td style='width: 50%;font-weight: lighter;text-align: end;padding: 0px;font-size: 15px;'> " + print.order_type_name + "</td>";
        dynHtml += "</tr>";
        dynHtml += "<tr>";
        dynHtml += "<th style='width: 50%;text-align: start;padding: 0px;font-size: 15px;'>";
        dynHtml += "<b>" + print.invoice_no_prefix + "</b>";
        dynHtml += "</th>";
        dynHtml += "<td style='width: 50%;font-weight: lighter;text-align: end;padding: 0px;font-size: 15px;'> " + print.invoice_no + "</td>";
        dynHtml += "</tr>";
        dynHtml += " </tbody>";
        dynHtml += "</table>";
        /* Invoice No table  end*/


        /* Date table */
        dynHtml += "<table id='date' style='width: 100%;margin-bottom: 10px;'>";
        dynHtml += "<tbody>";
        dynHtml += "<tr>";
        dynHtml += "<th style='text-align: start;padding: 0px;font-size: 15px;font-weight: lighter;'>";
        dynHtml += "<b>" + print.date_label + "</b>";
        dynHtml += "</th>";
        dynHtml += "<td style='font-weight: lighter;text-align: end;padding: 0px;font-size: 15px;white-space: nowrap;'>" + print.invoice_date + "</td>";
        dynHtml += "</tr>";
        dynHtml += "</tbody>";
        dynHtml += "</table>";
        /* Date table  end*/


        /* Line Item loop */
        dynHtml += "<table id='line_item' style='width: 100%;margin-bottom: 5px;text-align: center;'>";
        dynHtml += "<tbody>";
        dynHtml += "<tr>";
        dynHtml += "<th style='border-bottom: 2.5px dashed darkgrey;padding: 0px;font-size: 15px;'>" + print.table_qty_label + "</th>";
        dynHtml += "<th style='border-bottom: 2.5px dashed darkgrey;padding: 5px;font-size: 15px;'>" + print.table_product_label + "</th>";
       /*  dynHtml += "<th style='border-bottom: 2.5px dashed darkgrey;padding: 0px;font-size: 15px;'>" + print.table_subtotal_label + "</th>"; */
        dynHtml += "<th style='border-bottom: 2.5px dashed darkgrey;padding: 0px;font-size: 15px;'>" + print.discount_label + "</th>";
        dynHtml += "<th style='border-bottom: 2.5px dashed darkgrey;padding: 0px;font-size: 15px;'>" + print.total_paid_label + "</th>";
        dynHtml += "</tr>";
        /* print lines */
        if (print.lines && print.lines.length !== 0) {
            print && print.lines.map((line, index, lastindexOfArray) => {
                let lineBelow = "none";
                let notLineatEnd = "none";
                let borderTopFreeModifers = "2px dashed";
                let borderBottomFreeModifers = "1px solid";
                let lastItem = '';
                let line_discount = line.line_discount;
                const arrayLength = lastindexOfArray.length - 1;
                if (line.modifiers && line.modifiers.length !== 0) {
                    lineBelow = "none";
                    if (index === arrayLength) {
                        notLineatEnd = "none";
                        lastItem = true;
                    } else {
                        notLineatEnd = "1px solid";
                    }
                } else {
                    if (index === 0) {
                        lineBelow = "1px solid";
                    } else if (index === arrayLength) {
                        lineBelow = "none";
                        notLineatEnd = "none";
                    } else {
                        lineBelow = "1px solid";
                    }
                }
                index = index + 1;
                const unitPriceRounded = toFixedTrunc(line.sell_price_inc_tax, 4);
                const roundedValue = +unitPriceRounded + line.single_product_tax;
                //const subTotalFinal = +roundedValue.toFixed(2) * line.quantity;
                const subTotalFinal = (line.line_total_uf);
                dynHtml += "<tr style='font-size: 16px;border-bottom: " + lineBelow + ";' key= '" + index + "'>";
                /*  dynHtml += "<td style='border-bottom: " + lineBelow + ";'>" + index + "</td>"; */
                dynHtml += "<td style='text-align: center;font-size: 18px;padding: 0px;border-bottom: " + lineBelow + ";'><b>" + line.quantity + "</b></td>";
                dynHtml += "<td style='text-align: center;border-bottom: " + lineBelow + ";'>" + line.name + "</td>";
                /*  dynHtml += "<td style='text-align: center;padding: 0px;border-bottom: " + lineBelow + ";'>" + roundedValue.toFixed(2) + "</td>"; */
                /* dynHtml += "<td style='text-align: center;padding: 0px;border-bottom: " + lineBelow + ";'>" + line.sell_price_inc_tax + "</td>"; */
                dynHtml += "<td style='text-align: center;padding: 0px;border-bottom: " + lineBelow + ";'>" + line.line_discount + "</td>";
                dynHtml += "<td style='text-align: center;padding: 0px;border-bottom: " + lineBelow + ";'>" + line.line_total + "</td>";
                dynHtml += "</tr>";

                /* line modifiers */
                if (line.modifiers && line.modifiers.length !== 0) {
                    line.modifiers.map((modifier, indexLine) => {
                        let lineBelowModifier = "none";
                        const arrayLengthModifier = line.modifiers.length - 1;
                        if ((indexLine === arrayLengthModifier)) {
                            lineBelowModifier = "none";
                        } else {
                            lineBelowModifier = "none";
                        }
                        const modifierPrice = toFixedTrunc(modifier.unit_price_inc_tax, 4);
                        const unit_price_inc_tax = toFixedTrunc(modifier.unit_price_inc_tax, 4);
                        const unit_price_exc_tax = toFixedTrunc(modifier.unit_price_exc_tax, 4);
                        let calTax = 0;
                        if (modifier.tax_id && modifier.tax_id > 0) {
                            calTax = unit_price_exc_tax * modifier.tax_amount / 100;
                            allModifierTax = allModifierTax + (calTax.toFixed(2) * line.quantity);
                        }
                        const roundedValue = (+modifierPrice).toFixed(2);
                        if (+modifier.sell_price_inc_tax > 0) {
                            dynHtml += "<tr style='font-size: 14px;border-bottom: " + lineBelowModifier + ";' key= '" + indexLine + "'>";
                            dynHtml += "<td style='border-bottom: " + lineBelowModifier + ";'></td>";
                            /*   dynHtml += "<td style='text-align: center;font-size: 18px;padding: 0px;border-bottom: " + lineBelowModifier + ";'><b>" + modifier.quantity + "</b></td>"; */
                            dynHtml += "<td style='border-bottom: " + lineBelowModifier + ";'>" + modifier.variation + "</td>";
                            /*   dynHtml += "<td style='text-align: center;padding: 0px;border-bottom: " + lineBelowModifier + ";'>" + roundedValue + "</td>"; */
                            dynHtml += "<td style='text-align: end;padding: 0px;border-bottom: " + lineBelowModifier + ";'>" + (roundedValue * modifier.quantity).toFixed(2) + "</td>";
                           /*  dynHtml += "<td style='border-bottom: " + lineBelowModifier + ";'></td>"; */
                            dynHtml += "<td style='border-bottom: " + lineBelowModifier + ";'></td>";
                            dynHtml += "</tr>";
                        }
                    });


                    let modifierText = [];
                    line.modifiers.forEach((modifier) => {
                        if (+modifier.sell_price_inc_tax === 0) {
                            modifierText.push(modifier.variation);
                        }
                    });
                    if (modifierText.length !== 0) {
                        dynHtml += "<tr style='font-size: 14px;border-top: " + borderTopFreeModifers + "border-bottom:"+  borderBottomFreeModifers +";'>";
                        /*  dynHtml += "<td style='border-bottom: " + notLineatEnd + ";'></td>"; */
                        dynHtml += "<td style='border-bottom: " + notLineatEnd + ";'></td>";
                        dynHtml += "<td style='border-bottom: " + notLineatEnd + ";'>" + modifierText.join(', ') + "</td>";
                        /*   dynHtml += "<td style='border-bottom: " + notLineatEnd + ";'></td>"; */
                       /*  dynHtml += "<td style='border-bottom: " + notLineatEnd + ";'></td>"; */
                        dynHtml += "<td style='border-bottom: " + notLineatEnd + ";'></td>";
                        dynHtml += "<td style='border-bottom: " + notLineatEnd + ";'></td>";
                        dynHtml += "</tr>";
                    }

                }
                /* line modifiers end */

            })
        }
        /* print lines end */

        dynHtml += " </tbody>";
        dynHtml += "</table>";
        /* Line Item loop end */


        /* After item line */
        dynHtml += "<hr style='border: 1px solid black;' />";
        /* SubTotal table */
        dynHtml += "<table id='subtotal' style='width: 100%;'>";
        dynHtml += "<tbody>";
        dynHtml += "<tr>";
        dynHtml += "<th style='text-align: right;width: 50%;font-size: 16px;padding: 0px;'>" + print.subtotal_label + "</br>المجموع الفرعي</th>";

        dynHtml += "<td style='text-align: end;font-size: 16px;padding: 0px;width: 50%;'><b>" + (print.final_total - (allModifierTax + totalProductTax)).toFixed(2) + "﷼  </b></td>";
        dynHtml += "</tr>";
        dynHtml += "<tr>";
        dynHtml += "<th style='text-align: right;width: 50%;font-size: 16px;'>" + print.tax_label + "</th>";
        dynHtml += "<td style='text-align: end;width: 50%;font-size: 16px;'> (+) ﷼ " + (allModifierTax + totalProductTax).toFixed(2) + "</td>";
        dynHtml += "</tr>";



        /* payment Discount */
        if (print.discount && print.discount.lenght !== 0) {
            dynHtml += "<tr>";
            dynHtml += "<th style='text-align: right;width: 50%;font-size: 16px;'>" + print.line_discount_label + "</th>";
            dynHtml += "<td style='text-align: end;font-size: 13px;width: 50%;'><b>" + print.discount + "</b></td>";
            dynHtml += "</tr>";
        }
        /* payment Discount end */

        /* payment after Discount */
        if (print.discount && print.discount.lenght !== 0) {
            dynHtml += "<tr>";
            dynHtml += "<th style='text-align: right;width: 50%;font-size: 16px;'>" + print.total_paid_label + "</br>إجمالي بعد الخصم </th>";
            dynHtml += "<td style='text-align: end;font-size: 13px;width: 50%;'><b>" + print.final_total + " ﷼ </b></td>";
            dynHtml += "</tr>";
        } else {
            dynHtml += "<tr>";
            dynHtml += "<th style='text-align: right;width: 50%;'>" + print.total_label + "</br> إجمالي</th>";
            dynHtml += "<td style='text-align: end;padding: 0px;font-size: 16px;width: 50%;'><b>" + print.total + " ﷼ </b></td>";
            dynHtml += "</tr>";
        }
        /* paymentafter  Discount end */

        /* payment prints */
        if (print.payments && print.payments.length !== 0) {
            print.payments.map((payment, index) => {
                let payment_method = payment.method;

                dynHtml += "<tr key= '" + index + "'>";
                dynHtml += "<th style='text-align: right;font-size: 16px;width: 50%;'>" + payment_method + ":</th>";
                dynHtml += "<td style='text-align: end;font-size: 16px;width: 50%;'>" + payment.amount + "</td>";
                dynHtml += "</tr>";
            })
            if (print.clientCompany != '') {
                dynHtml += "<tr>";
                dynHtml += "<th style='text-align: right;font-size: 16px;width: 50%;'>" + print.clientCompanyLabel + ":</th>";
                dynHtml += "<td style='text-align: end;font-size: 16px;width: 50%;'>" + print.clientCompany + "</td>";
                dynHtml += "</tr>";
            }
            if (print.payment_status == 'returned') {
                dynHtml += "<tr>";
                dynHtml += "<th style='text-align: right;font-size: 16px;width: 50%;'>" + print.payment_status_label + ":</th>";
                dynHtml += "<td style='text-align: end;font-size: 16px;width: 50%;'>" + print.payment_status + "</td>";
                dynHtml += "</tr>";
            }

        }


        /* payment prints Ends */

        /* Total Paid */
        /* dynHtml += "<tr>";
        dynHtml += "<th style='text-align: right;width: 50%;font-size: 16px;'>" + print.total_paid_label + "</th>";
        dynHtml += "<td style='text-align: end;font-size: 16px;width: 50%;'>" + print.total_paid + "</td>";
        dynHtml += "</tr>"; */

        /* Toyal Due */
        /*  dynHtml += "<tr>";
         dynHtml += "<th style='text-align: right;width: 50%;font-size: 13px;'>" + print.total_due_label + "</th>";
         dynHtml += "<td style='text-align: end;font-size: 16px;width: 50%;'>" + print.total_due + "</td>";
         dynHtml += "</tr>"; */

        dynHtml += "</tbody>";
        dynHtml += "</table>";
        /* SubTotal end  end*/
        /*Horizental  Line */
        dynHtml += "<hr style='border: 1px solid black;margin-bottom: 0;' />";
        dynHtml += "<p style='text-align: center;margin:0;'>Products Count " + print.lines.length + "</p>";
        dynHtml += "<hr style='border: 1px solid black;margin-bottom: 3px;margin-top: 5px;' />";


        /* Footer table */
        dynHtml += "<table id='footer' style='width: 100%;margin-top: 0px;'>";
        dynHtml += "<tbody style='width: 100%;'>";
        dynHtml += "<tr>";
        dynHtml += "<td>" + print.footer_text + "</td>";
        dynHtml += "</tr>";
        dynHtml += "</tbody>";
        dynHtml += "</table>";
        /* Footer table  end*/

        /* Addtional Notes table */
        dynHtml += "<table id='additional_notes' style='width: 100%;display:none;'>";
        dynHtml += "<tbody style='width: 100%;'>";
        dynHtml += "<tr>";
        dynHtml += "<td>";
        dynHtml += "<p style='text-align: center;margin:0;'>" + print.additional_notes + "</p>";
        dynHtml += "</td>";
        dynHtml += "</tr>";
        dynHtml += "</tbody>";
        dynHtml += "</table>";
        /* Addtional Notes  end*/

        /*  var imgData = QR.drawImg(qrCodeB64, {
           typeNumber: 4,
           errorCorrectLevel: 'M',
           size: 200
       }); */


        /* QR Code Function */
        let VATNumber = user.tax_number_1; //"310099050100003";
        let businessName = user.business_name; //"Shawerma Elak";
        let TotalAmountWithoutCurrency = print.total.replace('﷼', '');
        let CurrentUTCTimeStamp = moment.utc(new Date()).format();
        let moditax = (allModifierTax + totalProductTax).toFixed(2);

        if (businessName && VATNumber && CurrentUTCTimeStamp && moditax && TotalAmountWithoutCurrency) {
            let sellerNameBuf = getTLVForvalue("01", businessName);
            let vatRegistrationNameBuf = getTLVForvalue("02", VATNumber);
            let timeStampBuf = getTLVForvalue("03", CurrentUTCTimeStamp);
            let taxTotalNameBuf = getTLVForvalue("04", TotalAmountWithoutCurrency);
            let vatTotalBuf = getTLVForvalue("05", moditax);
            let tagsBuffsArray = [sellerNameBuf, vatRegistrationNameBuf, timeStampBuf, taxTotalNameBuf, vatTotalBuf];
            let qrCodeBuf = Buffer.concat(tagsBuffsArray);
            let qrCodeB64 = qrCodeBuf.toString('base64');
            /*    console.log("qrCodeB64>>>", qrCodeB64); */
            var imgData = QR.drawImg(qrCodeB64, {
                typeNumber: 1,
                size: 200
            });
            /* console.log("imgData>>>", imgData); */

            /* QR Code table */
            if (print.qrcode) {
                dynHtml += "<table id='qr_code' style='width: 100%;text-align:center;margin-top:10px;'>";
                dynHtml += "<tbody style='width: 100%;'>";
                dynHtml += "<tr>";
                dynHtml += "<td>";
                dynHtml += "<img style='width:150px' src='" + print.qrcode + "' />";
                dynHtml += "</td>";
                dynHtml += "</tr>";
                dynHtml += "</tbody>";
                dynHtml += "</table>";
            }

        } else {
            dynHtml += "<table id='qr_code' style='width: 100%;text-align:center;margin-top:10px;'>";
            dynHtml += "<tbody style='width: 100%;'>";
            dynHtml += "<tr>";
            dynHtml += "<td>";
            dynHtml += "";
            dynHtml += "</td>";
            dynHtml += "</tr>";
            dynHtml += "</tbody>";
            dynHtml += "</table>";
        }



        /* QR Code table  end*/

        /* second div end */
        dynHtml += "</div>";
        /* main div end */
        dynHtml += "</div>";
        dynHtml += "</div>";

        let printUrl = "print://escpos.org/escpos/net/print?srcTp=uri&srcObj=html&numCopies=" + number_of_thermal_print_copy + "&src='data:text/html,";
        //let printUrl = "print://escpos.org/escpos/mnps/print/?srcTp=uri&srcObj=html&numCopies=1=&destPrinter=PRNTR0&src='data:text/html,";
        printUrl += encodeURIComponent(dynHtml);
        printUrl += "'";
        console.log("dynHtml>>>> ", dynHtml);
        // printPopUp();

        try {
            //toast.success('Printing Done!', { position: toast.POSITION.TOP_RIGHT });
            window.location.href = printUrl;
        } catch (e) {
            toast.error('Error in Printing !', { position: toast.POSITION.TOP_RIGHT });
            console.log('Error Printing....');
        }
    }

    return;
}
const printPopUp = () => {
    window.print();
}

function generateDynamicHTMLDemo() {
    //let printUrl = "print://escpos.org/escpos/net/print?srcTp=uri&srcObj=html&numCopies=2&src='data:text/html,";
    let printUrl = "print://escpos.org/escpos/mnps/print/?srcTp=uri&srcObj=html&numCopies=2&destPrinter=PRNTR0&src='data:text/html,";
    let dynHtml = "<h1 style='text-align:center'>FastichMultiPrint</h1>";
    printUrl += encodeURIComponent(dynHtml);
    printUrl += "'";

    console.log("dynHtml>>>> ", dynHtml);
    try {
        toast.success('Multi Printing Done!', { position: toast.POSITION.TOP_RIGHT });
        window.location.href = printUrl;
    } catch (e) {
        toast.error('Error in Multi Printing !', { position: toast.POSITION.TOP_RIGHT });
    }
}



export default connect(null, {
    notify,
    finalizePayment,
    sendPrintApi,
    fetchTableData,
    updateFinalizePayment,
    fetchFinalizePaymentFromIndexedDB,
    SavePendingFinalizePayment
})(Payment);
