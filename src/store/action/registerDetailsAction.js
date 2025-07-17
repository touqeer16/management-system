import apiConfig from "../../config/apiConfig";
import { constants, registerDetailsActionType, toastType } from "../../constants";
import db from '../../indexDb';

export const fetchRegisterDetails = () => async (dispatch) => {
    await apiConfig.get(`cash-register-details`)
        .then((response) => {
            saveRegisterDetailsInIndexDB(response.data);
            dispatch({ type: registerDetailsActionType.FETCH_REGISTER_DETAILS, payload: response.data });
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
            dispatch({ type: registerDetailsActionType.FETCH_REGISTER_DETAILS, payload: IndexDbResponse });
        }
    }
}
