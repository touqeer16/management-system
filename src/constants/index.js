import React from 'react';
import { fetchSuspendedSales } from "../store/action/suspendedSalesAction";

export const constants = {
    IS_LOADING: 'IS_LOADING',
    ADD_TOAST: 'ADD_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
};

export const apiBaseURL = {
    CATEGORY: 'get-categories',
    PRODUCT: 'get-products',
    CATEGORY_PRODUCT: 'get-category-products',
    LOGIN_USER: 'login-user',
    GET_PRODUCT_ROW: 'get-product-row'
};

export const loginUserActionType = {
    LOGIN_USER: 'LOGIN_USER',
};

export const APPENV = {
    APP_ENV: 'production',
};

export const categoryActionType = {
    FETCH_CATEGORY: 'FETCH_CATEGORY',
};

export const productActionType = {
    FETCH_ALL_PRODUCT: 'FETCH_ALL_PRODUCT',
    FETCH_PRODUCTS_CLICKABLE: 'FETCH_PRODUCTS_CLICKABLE',
    FETCH_FAVORITE: 'FETCH_FAVORITE',
};

export const productRowActionType = {
    FETCH_SINGLE_PRODUCT_ROW: 'FETCH_SINGLE_PRODUCT_ROW'
};

export const locationActionType = {
    FETCH_LOCATION: 'FETCH_LOCATION',
};

export const customerActionType = {
    ADD_CUSTOMER_DATA: 'ADD_CUSTOMER_DATA',
    SEARCH_CUSTOMER: 'SEARCH_CUSTOMER',
};

export const servicemanActionType = {
    FETCH_SERVICEMAN: 'FETCH_SERVICEMAN',
};

export const tableActionType = {
    FETCH_TABLE: 'FETCH_TABLE',
};

export const modifierProductActionType = {
    MODIFIER_PRODUCT: 'MODIFIER_PRODUCT'
};

export const suspendedProductActionType = {
    ADD_SUSPENDED_PRODUCT: 'ADD_SUSPENDED_PRODUCT'
};

export const toastType = {
    ERROR: 'error',
    SUCCESS: 'success'
};

export const registerDetailsActionType = {
    FETCH_REGISTER_DETAILS: 'FETCH_REGISTER_DETAILS'
};

export const closeRegisterActionType = {
    FETCH_CLOSE_REGISTER: 'FETCH_CLOSE_REGISTER',
    CASH_CLOSE_REGISTER: 'CASH_CLOSE_REGISTER',
};

export const suspendedSalesActionType = {
    FETCH_SUSPENDED_SALES: 'FETCH_SUSPENDED_SALES',
    DELETE_SUSPENDED_SALES: 'DELETE_SUSPENDED_SALES',
    DELETE_ALL_SUSPENDED_SALES: 'DELETE_ALL_SUSPENDED_SALES',
    EDIT_SUSPENDED_SALES: 'EDIT_SUSPENDED_SALES',
};

export const recentTransactionActionType = {
    FETCH_FINAL_TRANSACTION: 'FETCH_FINAL_TRANSACTION',
    DELETE_TRANSACTION: 'DELETE_TRANSACTION'
};

export const paymentActionType = {
    PAYMENT_PRINT: 'PAYMENT_PRINT',
};

export const ServerActionType = {
    SERVER_NOT_WORKING: 'Whoops! Server Not Available. Indexed DB working.',
    ADD_TO_CART: "Product added in cart.",
    PRODUCT_OUT_OF_STOCK: "Product out of stock",
};

export const IndexedDBActionType = {
    ADD_TO_CART: "Product added in cart from IndexedDB.",
    PRODUCT_NOT_EXIST: "Product not exist in IndexedDB.",
};