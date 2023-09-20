import React, { useState } from "react";
import "./Calculator.css";
import {postApiCall} from "../utils/services";

const arr = [
    "7",
    "8",
    "9",
    "+",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "*",
    "0",
    ".",
    "%",
    "/",
    "=",

];
const Calculate = ({
    addToHistory, displayValue, setDisplayValue, expName, setExpName, id, setId
}) => {

    const [expression, setExpression] = useState("");


    const calculate = () => {
        try {
            const result = calculateExpression(displayValue);
            setExpression(displayValue + '=' + result.toString());
            setDisplayValue(result.toString());
        } catch (error) {
            setExpression(displayValue + '= Error');
            setDisplayValue("Error");
        }
    };


    const calculateExpression = (exp) => {
        // Remove any spaces from the expression
        exp = exp.replace(/\s/g, "");

        // Use regular expressions to split the expression into numbers and operators
        const numbers = exp.split(/[-+*/]/).map(Number);
        const operators = exp.split(/[0-9]+/).filter(Boolean);

        // Initialize the result with the first number
        let result = numbers[0];

        // Iterate through the operators and perform calculations
        for (let i = 0; i < operators.length; i++) {
            const operator = operators[i];
            const nextNumber = numbers[i + 1];

            switch (operator) {
                case "+":
                    result += nextNumber;
                    break;
                case "-":
                    result -= nextNumber;
                    break;
                case "*":
                    result *= nextNumber;
                    break;
                case "/":
                    if (nextNumber === 0) {
                        return "Error";
                    }
                    result /= nextNumber;
                    break;
                case "%":
                    if (nextNumber === 0) {
                        return "Error";
                    }
                    result %= nextNumber;
                    break;

                default:
                    return "Error";
            }
        }

        return result;
    };


    const onExpNameChange = (event) => {
        setExpName(event.target.value)
    }


    const onSavePress = () => {
        let temp = {
            name: expName,
            exp: expression.split('=')[0],
            result: expression.split('=')[1],
        }
        postApiCall('/data/create-data',
        {
            name: temp.name,
            calculation: temp.exp,
            result: temp.result,
            id: id
        },
        (res) => {
            // console.log('data', res)
            addToHistory({
                ...res
            })
            setExpression('')
            setId('')
            setExpName('')
            setDisplayValue('0')
        },
        (err)=> {
            console.log('error', err)
        }
        )
      
    }

    const clear = () => {
        setDisplayValue("0");
        setExpression("");
        setExpName('')
    };

    const undo = () => {
        setDisplayValue((prev) => {
            if (prev?.length !== 1 && prev !== "Error") {

                return prev.slice(0, prev.length - 1);
            }
            else {
                return '0';
            }
        });
    };

    const onButtonClick = (event) => {
        const { value } = event?.target;
        if (!isNaN(parseInt(value))) {
            setDisplayValue((prev) => {
                if (prev !== '0') return `${prev}${value}`;
                else return value;
            });
        } else if (value === "=") {
            calculate();
        } else {
            setDisplayValue((prev) => {
                if (value === ".") {
                    return prev + value;
                } else {
                    return prev + value;
                }
            });
        }
    };

    return (
        <>
            <div className="calculator">
                <div className="calculator-display">
                    <h1>Calculator </h1>
                    <div className="display">{displayValue}</div>
                    <div className="buttons">
                        {arr.map((item, index) => {
                            return (
                                <button
                                    key={index}
                                    value={item}
                                    className={`keypad-btn ${isNaN(parseInt(item)) ? 'operation-button' : ''}`}
                                    onClick={onButtonClick}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                    <div className="clear-button-container">
                        <button onClick={clear} className="clear-button">
                            {"AC"}
                        </button>
                        <button onClick={undo} className="clear-button undo-button">
                            {"C"}
                        </button>
                    </div>
                    <h1>Calculation Name</h1>
                    <span>
                        {" "}
                        <input
                            type="text"
                            placeholder="Enter Name ..."
                            className="input-data"
                            value={expName}
                            onChange={onExpNameChange}
                        />
                        <button className="btn" type="button" onClick={onSavePress} disabled={!expression.includes('=')}>
                            Save
                        </button>
                    </span>
                </div>
            </div>
        </>
    );
};

export default Calculate;