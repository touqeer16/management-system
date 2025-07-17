import React from "react";


const Calculator = (props) => {

    const {buttonClickValue, handleClickButton, removeLastCharacter} = props;

    return (
        <div className="row row-cols-3 gx-0">
            <button type="button" onClick={() => handleClickButton(buttonClickValue + 1)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-bottom-0">
                1
            </button>
            <button type="button" onClick={() => handleClickButton(buttonClickValue + 2)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                2
            </button>
            <button type="button" onClick={() => handleClickButton(buttonClickValue + 3)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                3
            </button>
            <button type="button" onClick={() => handleClickButton(buttonClickValue + 4)}
                    className="btn text-primary border border-primary rounded-0 border-bottom-0">4
            </button>
            <button type="button" onClick={() => handleClickButton(buttonClickValue + 5)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                5
            </button>
            <button type="button" onClick={() => handleClickButton(buttonClickValue + 6)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                6
            </button>
            <button type="button" onClick={() => handleClickButton(buttonClickValue + 7)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-bottom-0">
                7
            </button>
            <button type="button" onClick={() => handleClickButton(buttonClickValue + 8)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                8
            </button>
            <button type="button" onClick={() => handleClickButton(buttonClickValue + 9)}
                    className="btn numeric-btn text-primary border border-primary rounded-0 border-start-0 border-bottom-0">
                9
            </button>
            <button type="button"
                    className="btn numeric-btn text-primary border border-primary rounded-0"/>
            <button type="button" onClick={() => handleClickButton(buttonClickValue + 0)}
                    className="btn text-primary numeric-btn border border-primary rounded-0 border-start-0">
                0
            </button>
            <button type="button" onClick={()=> removeLastCharacter()}
                    className="btn numeric-btn text-white border border-primary rounded-0 border-start-0">
                <i className="fa fa-times calculator__close-box"
                   aria-hidden="true"/>
            </button>
        </div>
    )
};

export default Calculator;