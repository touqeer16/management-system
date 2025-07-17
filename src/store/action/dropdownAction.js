import apiConfig from "../../config/apiConfig";
import { locationActionType } from "../../constants";
import db from '../../indexDb';

export const fetchLocation = () => async (dispatch) => {
    await apiConfig.get('get-locations')
        .then((response) => {
            saveLocationInIndexDB(response.data);
            dispatch({ type: locationActionType.FETCH_LOCATION, payload: response.data });
        })
        .catch(({ error }) => {
            console.log("error", error);
        });
};

export async function saveLocationInIndexDB(data) {
    if (data) {
        if (db.userLocation) db.userLocation.clear();
        db.userLocation.add({ locationkey: 'locationkey', data }).then(() => { });
    }
}

export const fetchLocationFromIndexDB = () => async (dispatch) => {
    const userLocation = await db.userLocation.where('locationkey').equals('locationkey').toArray();
    if (userLocation && userLocation.length > 0) {
        let IndexDbResponse = userLocation[0]['data'];
        dispatch({ type: locationActionType.FETCH_LOCATION, payload: IndexDbResponse });
    }
}
