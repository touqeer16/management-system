import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCategory, fetchCategoryFromIndexDB } from "../../store/action/categoryAction";
import { fetchProductClickable, fetchProducts, fetchProductsFromIndexDB, fetchProductClickableFromIndexDB } from "../../store/action/allproductAction";

const Category = (props) => {
    const { fetchCategory, fetchCategoryFromIndexDB, fetchProductClickableFromIndexDB, category, selectedLocationId, fetchProductsFromIndexDB, fetchProductClickable, fetchProducts } = props;
    const [categoryName, setCategoryName] = useState('All');
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

        if (!isWifiConnection) {
            fetchCategoryFromIndexDB();
        } else {
            fetchCategory(selectedLocationId);
        }

    }, []);

    const onSelectCategory = (category) => {
        setCategoryName(category.name);
        fetchProductClickableFromIndexDB(category.id, selectedLocationId);
        /* if (!isWifiConnection) {
            fetchProductClickableFromIndexDB(category.id, selectedLocationId);
        } else {
            fetchProductClickable(category.id, selectedLocationId);
        } */
    };

    const onSelectAll = () => {
        fetchProductsFromIndexDB(selectedLocationId);
        /* if (!isWifiConnection) {
            fetchProductsFromIndexDB(selectedLocationId);
        } else {
            fetchProducts(selectedLocationId);
        } */

        setCategoryName('All');
    };

    const onSelectFavorite = () => {
        fetchProductsFromIndexDB(selectedLocationId);
        /* if (!isWifiConnection) {
            fetchProductsFromIndexDB(selectedLocationId);
        } else {
            fetchProducts(selectedLocationId, 1);
        } */
        setCategoryName("Favorites");
    };

    return (
        <div>
            <div className="breadcrumb-nav d-flex justify-content-between align-items-center pe-3">
                <a href="#"
                    className="btn breadcrumb-nav__nav-title text-decoration-none text-primary rounded-0 border-0">
                    {categoryName}
                </a>

                <div className="top-bar_btn-grp">
                    <button type="button" onClick={() => onSelectAll()}
                        className="btn btn-primary top-bar__text-btn breadcrumb-nav__small-btn me-2 text-white">
                        ALL
                    </button>
                    <button type="button" onClick={() => onSelectFavorite()}
                        className="btn btn-primary top-bar__text-btn breadcrumb-nav__favorite-btn text-white d-none">
                        <i className="fa fa-heart" aria-hidden="true" />
                    </button>
                </div>
            </div>
            {category.categories && category.categories.length === 0 ?
                <div className="mini-box overflow-hidden" key={category.id}>
                    <div className="row gx-0 flex-nowrap overflow-auto">
                        <div
                            className='mini-box__block active text-primary d-flex align-items-center justify-content-center categories-box'>
                            <h5>No category</h5>
                        </div>
                    </div>
                </div> : ''
            }
            <div className="mini-box overflow-hidden">
                <div className="row gx-0 flex-nowrap overflow-auto">
                    {category.categories && category.categories.map((category, index) => {
                        return (
                            <div
                                className={`${categoryName === category.name ? 'active' : 'inactive'} mini-box__block active text-primary d-flex align-items-center justify-content-center`}
                                onClick={() => onSelectCategory(category)} key={index}>
                                {(category.image != null) ?
                                    <div>
                                        <img src={category.image_url} className="d-block mx-auto mt-1 category_img" alt={category.name} />
                                        <p className="category_name">   {category.name}</p>
                                    </div> : category.name}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
};

Category.propTypes = {
    OnClickAllCategoryButton: PropTypes.func,
    fetchCategory: PropTypes.func,
    fetchCategoryFromIndexDB: PropTypes.func,
    fetchProductClickable: PropTypes.func,
    fetchProductClickableFromIndexDB: PropTypes.func,
    fetchProducts: PropTypes.func,
    fetchProductsFromIndexDB: PropTypes.func,
};
const mapStateToProps = (state) => {
    const { category } = state;
    return { category };
};

export default connect(mapStateToProps, { fetchCategory, fetchCategoryFromIndexDB, fetchProductClickable, fetchProductsFromIndexDB, fetchProductClickableFromIndexDB, fetchProducts })(Category);

