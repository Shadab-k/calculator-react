import React, { useState } from "react";
import "./App.css";
import Calculate from "./components/Calculate";
import History from "./components/History";
import { useEffect } from "react";
import {getApiCall} from "./utils/services";

function App() {


  const [calculationHistory, setCalculationHistory] = useState([]);
  const [displayValue, setDisplayValue] = useState("0");
  const [expName, setExpName] = useState('')
  const [id, setId] = useState('')
  useEffect(() => {

    getApiCall(
      '/data/get-data',
     '', 
     (res) => {
      // console.log("response", res)
      setCalculationHistory([...res?.data])
    }, 
    (error) => console.log('error:', error))
    

  }, [])

  // console.log('history', calculationHistory)
  // console.log(
  //   'id', id
  // )

  const addToHistory = (item) => {
    setCalculationHistory([...calculationHistory, item]);
  };
  return (
    <div className="app">
      <Calculate addToHistory={addToHistory} displayValue={displayValue} setDisplayValue={setDisplayValue} setId={setId}
        expName={expName} setExpName={setExpName} id={id} />
      <History history={calculationHistory} setCalculationHistory={setCalculationHistory} setDisplayValue={setDisplayValue} setExpName={setExpName} setId={setId} />
    </div>
  );
}

export default App;