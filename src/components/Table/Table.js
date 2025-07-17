import React, { useCallback, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTableData, fetchTableDataFromIndexDB } from "../../store/action/tableAction";
import { editSuspendedSales } from "../../store/action/suspendedSalesAction";

const Table = (props) => {
    const { fetchTableData, tables, onSelectTable, tableId, selectedLocationId, user, editSuspendedSales } = props;
    const [isTableToggleModal, setIsTableToggleModal] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState(tableId);
    const [isWifiConnection, setIsWifiConnection] = useState(true);

    const onTableClickToggleModal = () => {
        setIsTableToggleModal(!isTableToggleModal);
    };

    useEffect(() => {
        //every second check internet connection
        const interval = setInterval(() => {
            if (navigator.onLine) {
                setIsWifiConnection(true);
            } else {
                setIsWifiConnection(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isTableToggleModal ? 'hidden' : 'unset';
    });

    useEffect(() => {
        setSelectedTableId(tableId ? tableId : null);
    }, [isTableToggleModal]);

    useEffect(() => {
        fetchTableData(selectedLocationId);
        if (!isWifiConnection) {
            fetchTableDataFromIndexDB(selectedLocationId);
        }

    }, [selectedLocationId]);

    const onTableSelectColor = (table) => {
        const id = table.id === selectedTableId ? null : table.id;
        setSelectedTableId(id);
    };

    const editSuspendSale = (salesId, tableID) => {
        onSelectTable(tableID);
        editSuspendedSales(salesId);
        fetchTableData(user.location_id);
        setIsTableToggleModal(false);
    };


    const onTableClickModal = () => {
        setIsTableToggleModal(!isTableToggleModal);
        setSelectedTableId('');

    };

    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            setIsTableToggleModal(false);
            setSelectedTableId('');
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    const addProductTable = () => {
        onSelectTable(selectedTableId)
        setIsTableToggleModal(false);
    };

    const loadTable = (table, index) => {
        if (table.id != table.res_table_id) {
            return (
                <button type="button" key={index}
                    className={`${selectedTableId === table.id ? "tables-active" : " "}  table-modal__table-btn btn btn-outline-dark d-flex align-items-center justify-content-center`}
                    onClick={() => onTableSelectColor(table)}>
                    {table.name}

                </button>
            )
        }
    }
    const loadonHoldTable = (table, index) => {
        if (table.id == table.res_table_id) {
            return (
                <button type="button"
                    className={` ${table.id === table.res_table_id ? "tables-booked" : " "} table-modal__table-btn btn  d-flex align-items-center justify-content-center`}
                    onClick={() => editSuspendSale(table.transaction_id, table.res_table_id)}>
                    {table.name}
                </button>
            )
        }
    }

    const displayLabel = () => {
        return (<button type="button"
            className="btn text-primary w-100 h-100 coustom-hover"
            data-bs-toggle="modal"
            data-bs-target="#tableModal"
            onClick={onTableClickToggleModal}>
            Table
        </button>)
    }

    if (!isTableToggleModal) {
        return displayLabel();
    }

    return (
        <div>
            {displayLabel()}
            <div className={`table-modal pos-modal`}>
                <div
                    className="modal-dialog modal-dialog-centered hide-show-dialog">
                    <div className="modal-content border-0 px-4 py-2">
                        <button type="button" className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onTableClickModal}
                            onKeyPress={onTableClickModal}>X
                        </button>
                        <div className="modal-body">
                            <div className="row">
                                <div
                                    className="col-sm-11 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4 mb-5">
                                    <div className="pe-lg-2 me-lg-1 mt-4 mt-sm-5 mt-lg-0">
                                        <h5 className="modal-title border-bottom border-4 mb-3 mt-1 mt-sm-0"
                                            id="tableModalLabel">
                                            On Hold Table
                                        </h5>
                                        <div className="custom-scrollbar">
                                            <div className="table-modal__main-box bg-secondary">
                                                <div
                                                    className="table-modal__table-btn-grp pt-3 px-2 pb-5 d-flex flex-wrap">

                                                    {tables.tables && tables.tables.map((table, index) => {
                                                        return loadonHoldTable(table, index)
                                                    })}

                                                </div>
                                            </div>
                                        </div>
                                        <h5 className="modal-title border-bottom border-4 mb-3 mt-1 mt-sm-0"
                                            id="tableModalLabel">
                                            Table
                                        </h5>
                                        <div className="custom-scrollbar">
                                            <div className="table-modal__main-box bg-secondary">
                                                <div
                                                    className="table-modal__table-btn-grp pt-3 px-2 pb-5 d-flex flex-wrap">
                                                    {tables.tables && tables.tables.map((table, index) => {
                                                        return loadTable(table, index)
                                                    })}


                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="text-end mt-5">
                                    <button type="button"
                                        // disabled={selectedTableId === null}
                                        onClick={addProductTable}
                                        className="btn btn-primary modal-btn modal-footer-btn table-modal__add-btn mt-3">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-overlay"
                    onClick={onTableClickToggleModal}
                    role="button" tabIndex="0" aria-label="background overlay"
                    onKeyDown={onTableClickToggleModal}>{ }</div>
            </div>
        </div>
    )
};

Table.propTypes = {
    fetchTableData: PropTypes.func,
    editSuspendedSales: PropTypes.func,
    fetchTableDataFromIndexDB: PropTypes.func,
};
const mapStateToProps = (state) => {
    const { tables } = state;
    return { tables };
};

export default connect(mapStateToProps, { fetchTableData, fetchTableDataFromIndexDB, editSuspendedSales })(Table);

