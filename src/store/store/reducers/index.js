import {combineReducers} from 'redux';
import categoryReducers from "./categoryReducers";
import allProductReducers from "./allproductReducers";
import dropdownReducers from "./dropdownReducers";
import tableReducers from "./tableReducers";
import userReducers from "./userReducers";
import rowProductReducers from "./rowProductReducers";
import servicemanReducers from "./servicemanReducers";
import customerReducers from "./customerReducers";
import favoriteReducers from "./favoriteReducers";
import modifierProduct from "./modifierProduct";
import searchReducers from "./searchReducers";

export default combineReducers({
    category: categoryReducers,
    products: allProductReducers,
    locations: dropdownReducers,
    user: userReducers,
    rowProduct: rowProductReducers,
    serviceman: servicemanReducers,
    customers: customerReducers,
    tables:tableReducers,
    featured_products:favoriteReducers,
    modifierProduct: modifierProduct,
    search: searchReducers,
});