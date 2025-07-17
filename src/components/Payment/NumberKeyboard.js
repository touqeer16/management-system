//keyboard number
import React from "react";

const NumberKeyboard = ({updateAmount, addAmount, clearAmount}) => {
    return (
        <div className="row row-cols-4 gx-0">
            <button type="button" onClick={() => updateAmount(1)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-bottom-0">
                1
            </button>
            <button type="button" onClick={() => updateAmount(2)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                2
            </button>
            <button type="button" onClick={() => updateAmount(3)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                3
            </button>
            <button type="button" onClick={() => addAmount(10)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                +10
            </button>
            <button type="button" onClick={() => updateAmount(4)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-bottom-0">
                4
            </button>
            <button type="button" onClick={() => updateAmount(5)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                5
            </button>
            <button type="button" onClick={() => updateAmount(6)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                6
            </button>
            <button type="button" onClick={() => addAmount(50)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                +50
            </button>
            <button type="button" onClick={() => updateAmount(7)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-bottom-0">
                7
            </button>
            <button type="button" onClick={() => updateAmount(8)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                8
            </button>
            <button type="button" onClick={() => updateAmount(9)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                9
            </button>
            <button type="button" onClick={() => addAmount(100)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                +100
            </button>
            <button type="button" onClick={() => updateAmount('.')}
                    className="btn numeric-btn text-primary border border-primary rounded-0">
                .
            </button>
            <button type="button" onClick={() => updateAmount(0)}
                    className="btn text-primary numeric-btn border border-primary rounded-0 border-start-0">
                0
            </button>
            <button type="button" onClick={() => clearAmount()}
                    className="btn numeric-btn text-white border border-primary rounded-0 border-start-0">
                <i className="fa fa-times calculator__close-box big-close"
                   aria-hidden="true"/>
            </button>
            <button type="button" onClick={() => addAmount(500)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0">
                +500
            </button>
        </div>
    )
};

export default NumberKeyboard;