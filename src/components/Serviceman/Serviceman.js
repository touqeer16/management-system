import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchServiceman, fetchServiceManFromIndexDB } from "../../store/action/servicemanAction";
// import { propTypes } from "react-bootstrap/esm/Image";

const Serviceman = (props) => {
    const [isServicesToggleModal, setIsServiceToggleModal] = useState(false);
    const [SelectChosenColor, setSelectChosenColor] = useState(false);
    const { fetchServiceman, fetchServiceManFromIndexDB, serviceman, onSelectService, selectedLocationId, serviceId } = props;
    const [isWifiConnection, setIsWifiConnection] = useState(true);
    const [selectedserviceManId, setserviceManId] = useState(serviceId);

    const onServiceClickToggleModal = () => {
        setIsServiceToggleModal(!isServicesToggleModal);
    };

    useEffect(() => {
        document.body.style.overflow = isServicesToggleModal ? 'hidden' : 'unset';
    });
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
        setserviceManId(serviceId ? serviceId : null);
        if (!isWifiConnection) {
            fetchServiceManFromIndexDB(selectedLocationId);
        } else {
            fetchServiceman(selectedLocationId);
        }
    }, [selectedLocationId]);

    const OnClickSelectColor = (serviceMan) => {
        const id = serviceMan.id === selectedserviceManId ? null : serviceMan.id;
        setserviceManId(id);
        setSelectChosenColor(serviceMan.full_name);
        onSelectService(serviceMan.id)
    };

    const addServiceTable = () => {
        onSelectService(serviceId)
        setIsServiceToggleModal(false);
    };

    return (
        <div>
            <button type="button"
                className="btn text-primary w-100 h-100 coustom-hover"
                data-bs-toggle="modal"
                data-bs-target="#servicemanModal"
                onClick={onServiceClickToggleModal}
            >
                Serviceman
            </button>
            <div className={`${isServicesToggleModal
                ? 'serviceman-modal'
                : null} pos-modal`}>
                <div
                    className="modal-dialog modal-dialog-centered hide-show-dialog">
                    <div className="modal-content border-0 px-4 py-2">
                        <button type="button" className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onServiceClickToggleModal}
                            onKeyPress={onServiceClickToggleModal}>X
                        </button>
                        <div className="modal-body">
                            <div className="row">
                                <div
                                    className="col-lg-11 col-12 border-4 border-lg-end pe-lg-0 pe-sm-4 mb-5">
                                    <div
                                        className="pe-lg-2 me-lg-1 mt-4 mt-sm-5 mt-lg-0">
                                        <h5 className="modal-title border-bottom border-4 mb-3 mt-1 mt-sm-0"
                                            id="servicemanModalLabel">
                                            Serviceman
                                        </h5>
                                        <div
                                            className="serviceman-modal__main-box bg-secondary">
                                            <div
                                                className="serviceman-modal__service-btn-grp pt-3 px-2 pb-5 d-flex flex-wrap">
                                                {serviceman.service_staff && serviceman.service_staff.map((serviceMan, index) => {
                                                    return (
                                                        <button type="button" key={index}
                                                            className={`${selectedserviceManId === serviceMan.id ? "service-active" : ""} serviceman-modal__service-btn btn btn-outline-dark d-flex align-items-center justify-content-center`}
                                                            onClick={() => OnClickSelectColor(serviceMan)}
                                                        >
                                                            {serviceMan.full_name}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end mt-5">
                                    <button type="button"
                                        onClick={addServiceTable}
                                        className="btn btn-primary modal-btn modal-footer-btn serviceman-modal__add-btn mt-3">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-overlay" onClick={onServiceClickToggleModal}
                    role="button" tabIndex="0" aria-label="background overlay"
                    onKeyDown={onServiceClickToggleModal}>{ }</div>
            </div>
        </div>
    )
};
Serviceman.propTypes = {
    fetchServiceman: PropTypes.func,
    fetchServiceManFromIndexDB: PropTypes.func
};

const mapStateToProps = (state) => {
    const { serviceman } = state;
    return { serviceman };
};

export default connect(mapStateToProps, { fetchServiceman, fetchServiceManFromIndexDB })(Serviceman);
