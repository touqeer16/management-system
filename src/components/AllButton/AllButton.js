import SuspendedSalesModal from "../../shared/Components/SuspendedSalesModal";
import RegisterDetailModal from "../RegisterModal/RegisterDetailModal";
import CloseRegisterModal from '../RegisterModal/CloseRegisterModal';
import RecentTransactionsModal from '../RecentModal/RecentTransactionsModal';
import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { environment } from '../../environment';


const AllButton = (props) => {
    const { onClickFullScreen, editSuspendedSale, onSelectTable } = props;
    const [isWifiConnection, setIsWifiConnection] = useState(true);
    const [isPauseToggleModal, setIsPauseToggleModal] = useState(false);
    const [isRegisterToggleModal, setIsRegisterToggleModal] = useState(false);
    const [isCloseRegisterModal, setIsCloseRegisterModal] = useState(false);
    const [isRecentToggleModal, setIsRecentToggleModal] = useState(false);
    const baseURL = environment.URL;

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

    // Watch for fullscreenchange
    /*  useEffect(() => {
         setTimeout(() => {
             document.getElementById('fullscreenbtn').click();
         }, "20000")
     }, []); */

    //pause model
    const onPauseClickToggleModal = () => {
        setIsPauseToggleModal(!isPauseToggleModal);
    };

    //register-details modal
    const onRegisterClickToggleModal = () => {
        setIsRegisterToggleModal(!isRegisterToggleModal);
    };

    const onCloseRegisterModal = () => {
        setIsCloseRegisterModal(!isCloseRegisterModal);
    };

    //recent transactions modal
    const onRecentClickToggleModal = () => {
        setIsRecentToggleModal(!isRecentToggleModal);
    };

    //redirect home page
    const onGoHomePage = () => {
        window.location.href = baseURL + '/home';
    };



    useEffect(() => {
        document.body.style.overflow = isRegisterToggleModal ? 'hidden' : 'unset';
    }, [isRegisterToggleModal]);

    useEffect(() => {
        document.body.style.overflow = isRecentToggleModal ? 'hidden' : 'unset';
    }, [isRecentToggleModal]);

    useEffect(() => {
        document.body.style.overflow = isPauseToggleModal ? 'hidden' : 'unset';
    }, [isPauseToggleModal]);

    useEffect(() => {

        document.body.style.overflow = isCloseRegisterModal ? 'hidden' : 'unset';

    }, [isCloseRegisterModal]);

    const closeModal = () => {
        setIsRecentToggleModal(false);
    };


    return (
        <div className="top-bar_btn-grp d-flex flex-wrap justify-content-end">
            <button id="fullscreenbtn" type="button" onClick={() => onClickFullScreen()}
                className=" btn btn-light top-bar__text-btn me-2 text-primary"
                data-toggle="tooltip" data-placement="top" title="Fullscreen">
                {/*full screen*/}
                <i className="fa fa-window-maximize" aria-hidden="true" />
            </button>

            <button type="button" data-bs-toggle="modal" data-bs-target="#servicemanModal"
                onClick={onPauseClickToggleModal}
                className="btn btn-light top-bar__text-btn me-2 text-primary"
                data-toggle="tooltip" data-placement="top" title="On Hold Order">
                <i className="fa fa-pause"
                    aria-hidden="true" />
            </button>
            {isPauseToggleModal &&
                <SuspendedSalesModal editSuspendedSale={editSuspendedSale}
                    onPauseClickToggleModal={onPauseClickToggleModal} onSelectTable={onSelectTable} />}

            <button type="button" onClick={onRecentClickToggleModal}
                className="btn btn-light top-bar__text-btn me-2 text-primary"
                data-toggle="tooltip" data-placement="top" title="Recent Transactions">
                <i className="fa fa-clock"
                    aria-hidden="true" />
            </button>
            {isRecentToggleModal &&
                <RecentTransactionsModal
                    onRecentClickToggleModal={onRecentClickToggleModal} closeModal={closeModal} />}

            <button type="button" data-bs-toggle="modal" data-bs-target="#servicemanModal"
                onClick={onRegisterClickToggleModal}
                className="btn btn-light top-bar__text-btn me-2 text-primary"
                data-toggle="tooltip" data-placement="top" title="Register Details">
                {/*Register Details*/}
                <i className="fa fa-briefcase"
                    aria-hidden="true" />
            </button>
            {isRegisterToggleModal &&
                <RegisterDetailModal onRegisterClickToggleModal={onRegisterClickToggleModal} />}

            <button type="button" data-bs-target="#servicemanModal" onClick={onCloseRegisterModal}
                className="btn btn-light top-bar__text-btn me-2 text-primary"
                data-toggle="tooltip" data-placement="top" title="Current Register">
                {/*Close Register*/}
                <i className="fa fa-times"
                    aria-hidden="true" />
            </button>
            {isCloseRegisterModal &&
                <CloseRegisterModal onCloseRegisterModal={onCloseRegisterModal} />}

            <button type="button" onClick={() => onGoHomePage()}
                className="btn btn-light top-bar__text-btn me-2 text-primary"
                data-toggle="tooltip" data-placement="top" title="Back to Dashboard">
                {/*Dashboard*/}
                <i className="fa fa-tachometer-alt"
                    aria-hidden="true" />
            </button>

            <button type="button" data-toggle="tooltip" data-placement="top" title="Internet Connection"
                className={`${isWifiConnection ? 'text-primary' : 'text-danger'} btn btn-light top-bar__text-btn`}>
                <i className="fa  fa-wifi" aria-hidden="true" />
            </button>
        </div>
    )
};
const mapStateToProps = (state) => {
    const { suspendedSales, editSuspendedSale } = state;
    return { suspendedSales, editSuspendedSale };
};



export default connect(mapStateToProps, {})(AllButton);

