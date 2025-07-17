import apiConfig from "../../config/apiConfig";
import { closeRegisterActionType, constants, toastType } from "../../constants";
import { environment } from '../../environment';
import db from '../../indexDb';

const baseURL = environment.URL;


export const fetchCloseRegister = () => async (dispatch) => {
    await apiConfig.get(`cash-register-details`)
        .then((response) => {
            saveRegisterDetailsInIndexDB(response.data);
            dispatch({ type: closeRegisterActionType.FETCH_CLOSE_REGISTER, payload: response.data });
        })
        .catch(({ response }) => {
            dispatch({
                type: constants.ADD_TOAST,
                payload: { text: response.data.message, type: toastType.ERROR, display: true }
            });
        });
};

export const cashCloseRegister = (register) => async (dispatch) => {
    await apiConfig.post('cash-close-register', register)
        .then((response) => {
            dispatch({ type: closeRegisterActionType.CASH_CLOSE_REGISTER, payload: response.data });
            dispatch({ type: constants.ADD_TOAST, payload: { text: "Register closed successfully", display: true } });
            window.location.href = baseURL + "/cash-register/create";
            // window.location.reload();
        })
        .catch(({ response }) => {
            dispatch({
                type: constants.ADD_TOAST,
                payload: { text: response.data.message, type: toastType.ERROR, display: true }
            });
        });
};


export async function saveRegisterDetailsInIndexDB(data) {
    if (data) {
        if (db.registerDetails) db.registerDetails.clear();
        db.registerDetails.add({ registerDetailskey: 'registerDetailskey', data }).then(() => { });
    }
}

export const fetchRegisterDetailsFromIndexDB = () => async (dispatch) => {
    if (db.registerDetails) {
        const registerDetails = await db.registerDetails.where('registerDetailskey').equals('registerDetailskey').toArray();
        if (registerDetails && registerDetails.length > 0) {
            let IndexDbResponse = registerDetails[0]['data'];
            dispatch({ type: closeRegisterActionType.FETCH_CLOSE_REGISTER, payload: IndexDbResponse });
        }
    }
}

