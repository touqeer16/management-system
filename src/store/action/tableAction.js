import apiConfig from "../../config/apiConfig";
import { tableActionType } from "../../constants";
import db from '../../indexDb';

export const fetchTableData = (locationId) => async (dispatch) => {
    await apiConfig.get(`get-tables?location_id=${locationId}`)
        .then((response) => {
            dispatch({ type: tableActionType.FETCH_TABLE, payload: response.data });
        })
        .catch(({ error }) => {
            console.log("error", error);
        });
};

export async function saveTableDataInIndexDB(data) {
    if (data) {
        if (db.serviceTable) db.serviceTable.clear();
        db.serviceTable.add({ tablekey: 'tablekey', data }).then(() => { });
    }
}

export const fetchTableDataFromIndexDB = (locationId) => async (dispatch) => {
    const serviceTable = await db.serviceTable.where('tablekey').equals('tablekey').toArray();
    if (serviceTable && serviceTable.length > 0) {
        let IndexDbResponse = serviceTable[0]['data'];
        dispatch({ type: tableActionType.FETCH_TABLE, payload: IndexDbResponse });
    }
}