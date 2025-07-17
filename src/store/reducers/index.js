import {combineReducers} from 'redux';
import categoryReducers from "./categoryReducers";
import allProductReducers from "./allproductReducers";
import dropdownReducers from "./dropdownReducers";
import tableReducers from "./tableReducers";
import userReducers from "./userReducers";
import servicemanReducers from "./servicemanReducers";
import customerReducers from "./customerReducers";
import favoriteReducers from "./favoriteReducers";
import modifierProduct from "./modifierProduct";
import searchReducers from "./searchReducers";
import progressReducer from './progressReducer';
import toastReducer from './toastReducer';
import registerDetailsReducers from "./registerDetailsReducers";
import closeRegisterReducers from "./closeRegisterReducers";
import currentRegisterReducers from "./currentRegisterReducers";
import suspendedSalesReducers from "./suspendedSalesReducers";
import recentTransactionReducers from "./recentTransactionReducers";
import editSuspendedSalesReducers from "./editSuspendedSalesReducers";
import paymentPrintReducers from "./paymentPrintReducers";

export default combineReducers({
    category: categoryReducers,
    products: allProductReducers,
    locations: dropdownReducers,
    user: userReducers,
    serviceman: servicemanReducers,
    customers: customerReducers,
    tables:tableReducers,
    featured_products:favoriteReducers,
    modifierProduct: modifierProduct,
    search: searchReducers,
    isLoading: progressReducer,
    toastMessage: toastReducer,
    registerDetails: registerDetailsReducers,
    closeRegisters: closeRegisterReducers,
    cashRegister: currentRegisterReducers,
    suspendedSales: suspendedSalesReducers,
    recentTransactions: recentTransactionReducers,
    editSuspendedSale: editSuspendedSalesReducers,
    paymentPrints: paymentPrintReducers,
});