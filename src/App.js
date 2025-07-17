import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import './components/scss/style.scss';
import './components/scss/layout.scss';
import { connect } from 'react-redux';
import "bluebird";
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import Products from "./components/Products/Products";
import { difference, pluck } from "../src/helpers";
import { useReactToPrint } from "react-to-print";
import Category from "./components/category/category";
import DropDown from "./shared/Components/DropDown";
import { fetchLoginUser, fetchLoginUserFromIndexDB } from "./store/action/loginUserAction";
import Payment from "./components/Payment/Payment";
import Customer from "./components/Customer/Customer";
import { PrintDataDynamicData, PrintData } from "./components/Payment/Payment";
import Table from "./components/Table/Table";
import Serviceman from "./components/Serviceman/Serviceman";
import Calculator from "./components/Calculator/Calculator";
import { FullScreen } from "@chiragrupani/fullscreen-react";
import CartDeleteModal from "./shared/Components/CartDeleteModal";
import AllButton from "./components/AllButton/AllButton";
import { fetchLocation, fetchLocationFromIndexDB } from './store/action/dropdownAction';
import prepareSuspendedData from "./shared/prepareSuspendedData";
import { calculatePrice, calculateCartTotalPrice, calculateCartTotalTax, calculateCartTotalDiscount, calculateCartTotalModifierTax } from "./shared/CalculateProductPrice";
import { suspendedProduct, editSuspendedProduct } from "./store/action/suspendedProductAction";
import ProductDetailModal from "./components/Products/ProductDetailModal";
import SuspendItemAddModal from "./shared/Components/suspendItemAddmodal";
import { fetchFinalTransactionIndexPage, fetchFinalTransaction } from "./store/action/recentTransactionAction";
import AddProductModifier from "./components/Products/AddProductModifier";
import AddOrderTypes from "./components/Products/AddOrderTypes";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchTableData } from "../src/store/action/tableAction";



const App = (props) => {
    const { fetchLoginUser, fetchLoginUserFromIndexDB, user, fetchLocation, fetchLocationFromIndexDB, fetchFinalTransaction, fetchFinalTransactionIndexPage, locations, suspendedProduct, toastMessage, editSuspendedSale, editSuspendedProduct, fetchTableData, customers } = props;
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [activeRow, setActiveRow] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);
    const [buttonClickValue, setButtonClickValue] = useState('');
    const [isDeleteToggleModal, setIsDeleteToggleModal] = useState(false);
    const [isOpenCartItemUpdateModel, setIsOpenCartItemUpdateModel] = useState(false);
    const [isOpenDiscountItemUpdateModel, setIsOpenDiscountItemUpdateModel] = useState(false);
    const [isSuspendItemModal, setIsSuspendItemModal] = useState(false);
    const [shownToast, setShownToast] = useState({});
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [printShow, setPrintShow] = useState(false);
    const [product, setProduct] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [tableId, setTableId] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [transactionId, setTransactionId] = useState(0);
    const [carts, setCarts] = useState([]);
    const [orderType, setOrderType] = useState([]);
    const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);
    const [isWifiConnection, setIsWifiConnection] = useState(true);
    const [isModifierModelOpen, setIsModifierModelOpen] = useState(false);
    const [isOrderTypesOpen, setIsOrderTypesOpen] = useState(false);
    const [cartProductIds, setCartProductIds] = useState([]);
    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,

    });

    /* const handlePrint = useReactToPrint({
        documentTitle: "Print This Document",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    }); */

    /*  const handlePrint = useReactToPrint({
        
         print: async (printIframe: HTMLIframeElement) => {
             // Do whatever you want here, including asynchronous work
             await generateAndSavePDF(printIframe);
         },
     }); */

    useEffect(() => {

        /*   setFullScreen(!fullScreen);
             onClickFullScreen();  */
        //every second check internet connection
        const interval = setInterval(() => {
            if (navigator.onLine) {
                setIsWifiConnection(true);

            } else {
                setIsWifiConnection(false);
            }

        }, 1000);

        return () => clearInterval(interval);
    }, []);




    useEffect(() => {
        /*  console.log("button clicked"); */
        document.body.style.overflow = isDeleteToggleModal ? 'hidden' : 'unset';
    });
    useEffect(() => {
        if (customers.data) {
            const newCustomer = {
                id: customers.data.id,
                label: customers.data.name
            };
            setCustomer(newCustomer);
        }

    }, [customers])

    useEffect(() => {
        //console.log("transactionId", transactionId);
        //console.log("editSuspendedSale", editSuspendedSale);
        if (editSuspendedSale.length !== 0) {
            //console.log("if");
            const newCustomer = {
                id: editSuspendedSale.products[0].contact_id,
                label: editSuspendedSale.products[0].customer_name
            };
            //console.log("products", editSuspendedSale.products);
            //setCarts(editSuspendedSale.products[0].product_row.product); 
            setCarts(editSuspendedSale.products);
            setTransactionId(editSuspendedSale.transaction_id);
            setOrderType(editSuspendedSale.order_type);
            setCustomer(newCustomer);
        } else {
            // console.log("else");
            setTransactionId(0);
            setOrderType('');
        }


    }, [editSuspendedSale]);

    useEffect(() => {
        if (!isWifiConnection) {
            fetchLoginUserFromIndexDB();
            fetchLocationFromIndexDB();
        } else {
            fetchLoginUser();
            fetchLocation();
            /* fetchFinalTransactionIndexPage('final'); */
            fetchFinalTransaction('final');
        }
    }, []);


    useEffect(() => {
        setShownToast(toastMessage);
        setTimeout(() => {
            setShownToast(false);
        }, 3000);
    }, [toastMessage]);

    useEffect(() => {
        if (locations.business_locations && locations.business_locations.length !== 0) {
            locations.business_locations.map((location) => {
                if (location.selected_business_location === 'selected') {
                    setSelectedLocationId(location.id);
                } else {
                    setSelectedLocationId(locations.business_locations[0].id);
                }
            });
        }
    }, [locations]);

    if (!selectedLocationId) {
        return ''
    }


    const closeToast = () => {
        setShownToast(false);
    }
    const isOrderTypeExist = (orderTypeId) => {

    }

    const addOrderTypeToCart = (type) => {
        if (!isOrderTypeExist(type.id)) {
            setOrderType(type);
        }
        let cartProduct = '';
        if (carts) {
            cartProduct = carts;
            carts && carts.map((cart) => {
                cartProduct = cart;
            })
        } else {
            cartProduct = product;
        }
        addProductToCart(cartProduct);
        closeOrderTypes();
    }


    const closeProductDetailModal = () => {
        setIsOpenCartItemUpdateModel(false);
        setIsOpenDiscountItemUpdateModel(false);
    };

    const onClickUpdateItemInCart = (item) => {
        if (item.modifier_products.length) {
            setIsModifierModelOpen(true);
        } else {
            setIsModifierModelOpen(false);
        }
        setProduct(item);
        setIsOpenCartItemUpdateModel(true);
    }

    const onClickUpdateOrderTypes = (item) => {
        setIsOrderTypesOpen(true);
    }



    const onClickUpdateItemInDiscount = (item) => {
        setProduct(item);
        setIsOpenDiscountItemUpdateModel(true);
    }
    const addProductToCart = (cartProduct) => {
        const variationId = cartProduct.variation_id;
        let isNew = false;
        const existingCarts = carts.filter((e) => {
            if (e.variation_id !== variationId || cartProduct.modifiers.length !== e.modifiers.length) {
                return e;
            } else {

                const cartModifierIds = pluck(cartProduct.modifiers, 'id')
                const eModifierIds = pluck(e.modifiers, 'id')
                const diff = difference(cartModifierIds, new Set(eModifierIds))
                /* if (diff.size === 0) {
                    e.quantity = parseInt(e.quantity) + 1;
                    isNew = false;
                } */
                return e;
            }
        })
        setCarts(existingCarts)
        updateCart(existingCarts);
        closeModifierModel();
        closeOrderTypes();
    }


    const onClickDeleteModal = () => {
        setIsDeleteToggleModal(!isDeleteToggleModal);
    }

    const onClickSuspendItemModal = () => {
        setIsSuspendItemModal(!isSuspendItemModal);
    }

    const updateCart = (cartProducts) => {
        setCarts(cartProducts);

    }

    const onDelete = (productId) => {
        const existingCart = carts.filter((e, index) => index !== productId)
        updateCart(existingCart);
        setSelectedItemForDelete(productId);
    }

    const onClearCart = () => {
        setTransactionId(0);
        setOrderType('');
        updateCart([]);
        setIsDeleteToggleModal(false);
        fetchTableData(user.location_id);
    }

    const setSelectBoxId = (id) => {
        setSelectedLocationId(parseInt(id));
    };

    const onClickToItem = (index) => {
        setButtonClickValue('');
        setActiveRow(index);
    };
    const closeModifierModel = () => {
        setIsModifierModelOpen(false);
    };
    const closeOrderTypes = () => {
        setIsOrderTypesOpen(false);
    };

    const onChangeTextBox = (newQTY, index) => {
        const localCart = carts.slice();
        localCart[index].quantity = newQTY;
        updateCart(localCart);
    };

    //update detail modal
    const detailUpdated = (discount, discountType, price) => {
        carts[activeRow].discount.discount_amount = discount;
        carts[activeRow].discount.discount_type = discountType;
        carts[activeRow].product.default_sell_price = price;
    }
    // update detail modal
    const onProductUpdateInCart = (item) => {
        const localCart = carts.slice();
        localCart[activeRow] = item;
        updateCart(localCart);
    };

    const handleClickButton = (textBoxValue) => {
        setButtonClickValue(textBoxValue);
        onChangeTextBox(textBoxValue, activeRow);
    };

    const onNext = () => {
        let activeIndex = activeRow - 1;
        if (activeIndex < 0) {
            activeIndex = carts.length - 1;
        }

        setActiveRow(activeIndex);
        setButtonClickValue('');
    };

    const onPrev = () => {
        let activeIndex = activeRow + 1;
        if (activeIndex === carts.length) {
            activeIndex = 0;
        }
        setButtonClickValue('');
        setActiveRow(activeIndex);
    };

    const updateQty = () => {
        const localCart = carts.slice();
        const qty = localCart[activeRow].quantity === 1 ? 0 : localCart[activeRow].quantity.toString().slice(0, -1);
        localCart[activeRow].quantity = qty ? qty : 0;
        setCarts(localCart);

        setButtonClickValue(buttonClickValue.slice(0, -1));
    };

    const onClickFullScreen = () => {
        console.log("Full Screen cliked ");
        setFullScreen(!fullScreen);
    };


    const addToCarts = (items) => {
        setActiveRow(carts.length);
        setButtonClickValue('');
        updateCart(items);
    }
    const addOrderType = (type) => {
        setOrderType(type);
    }



    const loadModifiers = (modifier, modifierIndex) => {
        if (+modifier.sell_price_inc_tax > 0) {
            return (
                <p className="product-checkout__text mb-0" key={modifierIndex}>
                    {modifier.name} {parseFloat(modifier.sell_price_inc_tax).toFixed(2)} SR
                </p>
            )
        }

        return '';
    }

    const loadFreeModifiers = (modifiers) => {
        let modifierText = [];
        modifiers.forEach((modifier, index) => {
            if (+modifier.sell_price_inc_tax === 0) {
                modifierText.push(modifier.name);
            }
        });

        if (modifierText.length === 0) {
            return '';
        }

        return (
            <p className="product-checkout__text mb-0">
                {modifierText.join(',')}
            </p>
        )
    }

    // Display cart list
    const loadCartList = (cartItem, index) => {
        //console.log(" loadCartList");
       
        const cartProduct = cartItem;
        //const cartProduct = cartItem.product_row.product;
        console.log(cartProduct);
        const modifiers = cartItem.modifiers ?? [];
        return (
            <div className="border-bottom border-2 product-box test" key={index}
                onClick={() => onClickToItem(index)}>
                <div
                    className={`${activeRow === index ? 'active_todoList' : ''} product-block row align-items-center gx-0`}>
                    <div className="col-6">
                        <div className="product-checkout__product">
                            <h2 className="product-checkout__title mb-0" onClick={() => onClickUpdateItemInCart(cartItem)}>
                                {cartProduct.product_name}
                            </h2>
                            {modifiers.map((modifier, modifierIndex) => {
                                return loadModifiers(modifier, modifierIndex);
                            })
                            }
                            {loadFreeModifiers(modifiers)}
                        </div>
                    </div>
                    <div className="col-2">
                        <input type="text" className="product-checkout__qty text-center mb-0 custom_input" value={cartItem.quantity} />
                    </div>
                    <div className="col-2">
                        <div className="d-flex align-middle justify-content-around align-items-center">
                            {/* <span className="product-checkout__sub-total" onClick={() => onClickUpdateItemInDiscount(cartItem)}>
                                {calculatePrice(cartItem)}
                            </span> */}
                            <h2 className="product-checkout__sub-total" onClick={() => onClickUpdateItemInDiscount(cartItem)}>
                                {calculatePrice(cartItem)}
                            </h2>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="d-flex align-middle justify-content-around align-items-center">
                            <span
                                className="product-checkout__trash-icon text-danger">
                                <i className="fas fa-trash-alt"
                                    onClick={() => onDelete(index)}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    const selectCustomer = (customer) => {
        setCustomer(customer);
    };

    const onSelectTable = (tableId) => {
        setTableId(tableId);
    };

    const onSelectService = (serviceId) => {
        setServiceId(serviceId);
    };
    /*   const loadPrintBlock = () => {
          return (
              <div>
                  <div className={'d-none'}>
                      {printShow ? <PrintDataDynamicData ref={componentRef} paymentPrint={transactionDetails} user={user} /> : ''}
                      {printShow ? <PrintData ref={componentRef} paymentPrint={transactionDetails} user={user} /> : ''}
                      <button id="printReceiptHold" onClick={handlePrint}>Print this out!</button>
                  </div>
              </div>
          );
      } */

    const suspendedItem = () => {
        setIsSuspendItemModal(false);
        const formData = [];
        formData.push({
            cart: carts,
            orderType: orderType ? orderType : null,
            finalTotal: calculateCartTotalPrice(carts),
            suspended: 1,
            customerId: customer ? customer.id : 'no_customer_select',
            transactionId: transactionId ? transactionId : null,
            serviceId: serviceId,
            tableId: tableId,
        });

        if (transactionId) {
            editSuspendedProduct(prepareSuspendedData(formData, selectedLocationId), transactionId, (cb) => {
                if (cb.status) {
                    setCarts([]);
                    setCustomer('');
                    setTransactionId(0);
                    setTableId('');
                    setServiceId('');
                    setOrderType('');
                    fetchTableData(user.location_id);
                    if (cb.receipt) {
                        setTransactionDetails(cb.data);
                        setPrintShow(true);

                    }

                }
            });
        } else {
            suspendedProduct(prepareSuspendedData(formData, selectedLocationId), (cb) => {
                if (cb.status) {
                    setCarts([]);
                    setCustomer('');
                    setTransactionId();
                    setTableId('');
                    setServiceId('');
                    setOrderType('');
                    fetchTableData(user.location_id);
                    if (cb.receipt) {
                        setTransactionDetails(cb.data);
                        setPrintShow(true);
                    }
                }
            });
        }

    };



    const preparePaymentProps = {
        carts: carts,
        user: user,
        locations: locations,
        orderType: orderType,
        addOrderType: addOrderType,
        updateCart: updateCart,
        setTableId: setTableId,
        setServiceId: setServiceId,
        customer: customer,
        transactionId: transactionId,
        selectedLocationId: selectedLocationId,
        serviceId: serviceId,
        tableId: tableId
    };
    const belowCartTotal = (carts) => {
        const TotalCost = calculateCartTotalPrice(carts);
        let classhide = '';;
        if (TotalCost > 0) {
            classhide = "block";
        } else {
            classhide = "none";
        }

        return (
            <div className="product-checkout__navs-end px-3" style={{ "display": classhide }}>
                <div className="row w-100 gx-0 align-items-center">
                    <div className="col-9 inline-div">
                        <p className="product-checkout__final-total mb-0">
                            Total: {calculateCartTotalPrice(carts)} SR
                        </p>
                        <div>
                            <p className="product-checkout__modifier-tax mb-0 custom-text">
                                Modifier Tax: {calculateCartTotalModifierTax(carts)} SR
                            </p>
                            <p className="product-checkout__tax mb-0 custom-text">
                                TAX: {calculateCartTotalTax(carts)} SR
                            </p>
                        </div>
                    </div>
                    <div className="col-3">
                        <p className="product-checkout__discount mb-0 text-center custom-text">
                            Discount: {calculateCartTotalDiscount(carts)} SR
                        </p>
                    </div>
                </div>
            </div>
        )

    }

    return (
        <FullScreen isFullScreen={fullScreen} onChange={() => onClickFullScreen()}>
            <div className="POS-page custom-border demo" >
                <div className="container-fluid px-0">
                    <div className="top-bar d-flex align-items-center ">
                        <div className="row w-100 gx-0 custom-pospage">
                            <div className="col-sm-5 col-lg-4  container-full-width bg-white">
                                <div
                                    className="d-flex justify-content-between align-items-center top-bar__top-nav px-3">
                                    <ToastContainer />
                                    <div className="top-bar_btn-grp d-flex flex-wrap">
                                        <button type="button" onClick={onClickSuspendItemModal}
                                            disabled={carts.length === 0}
                                            className="btn btn-light top-bar__mini-btn d-flex align-items-center justify-content-center me-4 text-primary">
                                            <i className="fa fa-pause" aria-hidden="true" />
                                        </button>

                                        <button type="button" onClick={onClickDeleteModal} disabled={carts.length === 0}
                                            className="btn btn-light top-bar__mini-btn d-flex align-items-center justify-content-center text-primary">
                                            <i className="fa fa-times" aria-hidden="true" />
                                        </button>
                                    </div>
                                    {isSuspendItemModal &&
                                        <SuspendItemAddModal onClickSuspendItemModal={onClickSuspendItemModal} suspendedItem={suspendedItem} user={user} printShow={printShow} />}

                                    {isDeleteToggleModal &&
                                        <CartDeleteModal onClickDeleteModal={onClickDeleteModal}
                                            onClearCart={onClearCart} />}

                                    <div
                                        className="top-bar_btn-grp d-flex align-items-center">
                                        <button type="button" onClick={() => onNext()}
                                            className="d-flex align-items-center justify-content-center btn btn-light top-bar__round-mini-btn me-4 text-primary rounded-circle">
                                            <i className="fa fa-angle-up arrow-icon"
                                                aria-hidden="true" />
                                        </button>
                                        <button type="button" onClick={() => onPrev()}
                                            className="d-flex align-items-center justify-content-center btn btn-light top-bar__round-mini-btn text-primary rounded-circle">
                                            <i className="fa fa-angle-down arrow-icon"
                                                aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>

                                <div className="product-checkout mb-3">

                                    <div className="product-checkout__navs d-flex align-items-center px-3">
                                        <div className="row w-100 gx-0">
                                            <div className="col-4">
                                                <h4 className="product-checkout__first-title mb-0 ms-1">Order Type:</h4>
                                            </div>

                                            <div className="col-6">
                                                <div className="border-bottom border-2 product-box test">
                                                    <h4 className="product-checkout__first-title mb-0 text-center" style={{ "cursor": "pointer", "font-weight": "900" }} onClick={() => onClickUpdateOrderTypes(orderType)}>
                                                        {orderType && orderType.order_name && orderType.order_name}
                                                    </h4>
                                                    {/*  <h5 className="product-checkout__first-title mb-0 text-center" style={{ "cursor": "pointer", "font-weight": "900" }} >
                                                        {tableId && tableId}
                                                    </h5> */}


                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <hr className="border-line mb-0" />
                                    <div className="product-checkout__navs d-flex align-items-center px-3">
                                        <div className="row w-100 gx-0">
                                            <div className="col-6">
                                                <h4 className="product-checkout__first-title mb-0 ms-1">Product</h4>
                                            </div>
                                            <div className="col-2">
                                                <h4 className="product-checkout__first-title mb-0 text-center">QTY</h4>
                                            </div>
                                            <div className="col-2">
                                                <h4 className="product-checkout__first-title mb-0 text-center">ToT</h4>
                                            </div>
                                            <div className="col-2">
                                                <h4 className="product-checkout__first-title mb-0 text-center" style={{ "color": "red", "font-weight": "900" }}>X</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cart-scrollbar">
                                        <div className="mb-4">
                                            { console.log("Carts:" , carts)}
                                            {carts && carts.map((cart, index) => {
                                                return loadCartList(cart, index);
                                            })}
                                        </div>
                                    </div>
                                    <hr className="border-line mb-0" />
                                    {belowCartTotal(carts)}

                                </div>
                                <div className="calculator">
                                    <div className="row gx-0">
                                        <div
                                            className="col-4 text-center border border-primary border-end-0 border-bottom-0">
                                            <Customer selectCustomer={selectCustomer} customer={customer} />
                                        </div>
                                        <div
                                            className="col-4 text-center border border-primary border-end-0 border-bottom-0">
                                            <Serviceman selectedLocationId={selectedLocationId} onSelectService={onSelectService} serviceId={serviceId} />
                                        </div>
                                        <div className="col-4 text-center border border-primary border-bottom-0">
                                            <Table selectedLocationId={selectedLocationId} onSelectTable={onSelectTable} tableId={tableId} user={user} />
                                        </div>
                                        <div className="col-12">
                                            <div className="row gx-0">
                                                <div
                                                    className="col-6 text-center border border-primary d-flex align-items-center justify-content-center">
                                                    <Payment {...preparePaymentProps} />
                                                </div>
                                                <div className="col-6">
                                                    <Calculator buttonClickValue={buttonClickValue}
                                                        handleClickButton={handleClickButton}
                                                        removeLastCharacter={updateQty} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-7 col-lg-8  container-full-width pe-0 right-top">
                                <div
                                    className="right-content d-md-flex justify-content-md-between align-items-center top-bar__top-nav pe-3 ps-3 py-3 py-md-0">
                                    <nav aria-label="breadcrumb" className="me-3 mb-3 mb-md-0">
                                        <ul className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="#" className="text-white text-decoration-none">
                                                    <DropDown setSelectBoxId={setSelectBoxId} />
                                                </a>

                                            </li>
                                            <li className="breadcrumb-item text-white user-padding" aria-current="page">
                                                {user.first_name}
                                            </li>
                                        </ul>
                                    </nav>
                                    <AllButton onClickFullScreen={onClickFullScreen} selectedLocationId={selectedLocationId} suspendedSales={editSuspendedSale} onSelectTable={onSelectTable} />
                                </div>
                                <Category selectedLocationId={selectedLocationId} />
                                <Products selectedLocationId={selectedLocationId} updateCart={addToCarts} updateOrderType={addOrderType} addInOrderType={setOrderType} orderType={orderType} cartProducts={carts} locations={locations} />
                            </div>
                        </div>
                    </div>
                </div>
                {isOpenDiscountItemUpdateModel && <ProductDetailModal clickProductDetailModal={closeProductDetailModal} cartProduct={product} onProductUpdateInCart={onProductUpdateInCart} />}
                {isOpenCartItemUpdateModel && isModifierModelOpen && <AddProductModifier addProductInToCart={addProductToCart} product={product} closeModifierModel={closeModifierModel} />}
                {isOrderTypesOpen && <AddOrderTypes product={product} carts={carts} addOrderTypeInToCart={addOrderTypeToCart} addProductInToCart={addProductToCart} orderType={orderType} locations={locations} closeOrderTypes={closeOrderTypes} />}
                {shownToast.display ?
                    <div
                        className="notification-toaster d-flex align-items-center justify-content-between">
                        <p className="mb-0">{toastMessage.text}</p>
                        <button type="button" onClick={closeToast}
                            className="notification-toaster__close-icon btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close">X
                        </button>
                    </div> : ''}
            </div>
        </FullScreen>
    );
}

const mapStateToProps = (state) => {
    const { user, locations, toastMessage, editSuspendedSale, customers } = state;
    return { user, locations, toastMessage, editSuspendedSale, customers };
};



export default connect(mapStateToProps, {
    fetchLoginUser,
    fetchLoginUserFromIndexDB,
    fetchLocation,
    fetchLocationFromIndexDB,
    fetchFinalTransaction,
    fetchFinalTransactionIndexPage,
    suspendedProduct,
    editSuspendedProduct,
    fetchTableData,
})(App);
