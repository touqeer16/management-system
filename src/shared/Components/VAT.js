import React, { useEffect, useState } from "react";
import { fetchLocation, fetchLocationFromIndexDB } from "../../store/action/dropdownAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchProducts, fetchProductsFromIndexDB } from "../../store/action/allproductAction";

function VAT(props) {
    const { fetchLocation, fetchLocationFromIndexDB, fetchProductsFromIndexDB, locations } = props;
    const [isWifiConnection, setIsWifiConnection] = useState(true);
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
        fetchLocation();
        if (!isWifiConnection) {
            fetchLocationFromIndexDB();
        }
    }, []);
    return (
        locations.business_locations && locations.business_locations.map((location, index) => {
            return (location.tax_number_1)
        })
    )
}

VAT.propTypes = {
    fetchLocation: PropTypes.func,
    fetchLocationFromIndexDB: PropTypes.func,
}

const mapStateToProps = (state) => {
    const { locations } = state;
    return { locations };
};

export default connect(mapStateToProps, { fetchLocation, fetchLocationFromIndexDB, fetchProducts, fetchProductsFromIndexDB })(VAT);
