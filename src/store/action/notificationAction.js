import {constants} from "../../constants";

export const notify = (errorMessage) => async (dispatch) => {
    dispatch({type: constants.ADD_TOAST, payload: {text: errorMessage, display: true}});
};

