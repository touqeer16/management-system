import React, { useEffect, useState } from "react";
import { fetchLocation, fetchLocationFromIndexDB } from "../../store/action/dropdownAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchProducts, fetchProductsFromIndexDB } from "../../store/action/allproductAction";

function DropDown(props) {
    const { fetchLocation, fetchLocationFromIndexDB, fetchProducts, fetchProductsFromIndexDB, locations, setSelectBoxId } = props;
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


    const OnchangeLocation = (e) => {
      
        if (!isWifiConnection) {
            fetchProductsFromIndexDB(e.target.value);
        } else{
              fetchProducts(e.target.value);
        }
        setSelectBoxId(e.target.value);
    }

    return (
        <select className="form-control select2" id="dashboard_location"
            onChange={(e) => OnchangeLocation(e)}
        >
            {locations.business_locations && locations.business_locations.map((location, index) => {
                return (
                    <option value={location.id}
                        className="option-drop option-color-window"
                        selected={location.selected_business_location ==
                            'selected' ? 'selected' : ''}
                        key={index}>{location.name}</option>
                )
            })}
        </select>
    )
}

DropDown.propTypes = {
    fetchLocation: PropTypes.func,
    fetchLocationFromIndexDB: PropTypes.func,
}

const mapStateToProps = (state) => {
    const { locations } = state;
    return { locations };
};

export default connect(mapStateToProps, { fetchLocation, fetchLocationFromIndexDB, fetchProducts, fetchProductsFromIndexDB })(DropDown);
