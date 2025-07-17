
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, loginUserActionType } from "../../constants";
import db from '../../indexDb';

export const fetchLoginUser = () => async (dispatch) => {
    await apiConfig.get(apiBaseURL.LOGIN_USER).then((response) => {
        saveLoginUserInIndexDB(response.data.user);
        dispatch({ type: loginUserActionType.LOGIN_USER, payload: response.data.user });
    }).catch(({ error }) => {
        // console.log("error:", "user login not working");
    });
};

export async function saveLoginUserInIndexDB(data) {
    if (data) {
        if (db.loginUser) db.loginUser.clear();
        db.loginUser.add({ loginkey: 'loginkey', data }).then(() => { });
    }
}

export const fetchLoginUserFromIndexDB = () => async (dispatch) => {
    const loginUser = await db.loginUser.where('loginkey').equals('loginkey').toArray();
    if (loginUser && loginUser.length > 0) {
        let IndexDbResponse = loginUser[0]['data'];
        dispatch({ type: loginUserActionType.LOGIN_USER, payload: IndexDbResponse });
        // return loginUser[0]['data']['user'];
    }
    // return null;

}