import apiConfig from "../../config/apiConfig";
import { servicemanActionType } from "../../constants";
import db from '../../indexDb';
export const fetchServiceman = (locationId) => async (dispatch) => {
    await apiConfig.get(`get-service-staffs?location_id=${locationId}`)
        .then((response) => {
            saveServiceManInIndexDB(response.data);
            dispatch({ type: servicemanActionType.FETCH_SERVICEMAN, payload: response.data });
        })
        .catch(({ error }) => {
            console.log("error", error);
        });
};

export async function saveServiceManInIndexDB(data) {
    if (data) {
        if (db.serviceStaff) db.serviceStaff.clear();
        db.serviceStaff.add({ staffkey: 'staffkey', data }).then(() => { });
    }
}

export const fetchServiceManFromIndexDB = (locationId) => async (dispatch) => {
    const serviceStaff = await db.serviceStaff.where('staffkey').equals('staffkey').toArray();
    if (serviceStaff && serviceStaff.length > 0) {
        let IndexDbResponse = serviceStaff[0]['data'];
        dispatch({ type: servicemanActionType.FETCH_SERVICEMAN, payload: IndexDbResponse });
    }
};
