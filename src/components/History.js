import React from "react";
import "./History.css";
import assets from '../assets/images'
import { useState } from "react";
import { deleteApiCall } from "../utils/services";


const History = ({
  history, setDisplayValue, setExpName, setCalculationHistory, setId
}) => {

  const [search, setSearch] = useState('')

  const handleUndo = (index) => {
    if (history.length > 0) {
      setDisplayValue(history[index].calculation)
      setExpName(history[index].name)
      setId(history[index]._id)
      history.splice(index, 1)
      let temp = [...history]
      setCalculationHistory([...temp])
    }
  };

  const handleDelete = (index) => {
    deleteApiCall('/data/remove-data/',history[index]._id,(res) => {
      // console.log('res', res)
      history.splice(index, 1)
      let temp = [...history]
      setCalculationHistory([...temp])
    },(error) => {
      console.log('error', error)
    })
  }

  const onChangeSearch = (e) => {
    const { value } = e.target
    setSearch(value)
  }

  const filterItem = () => {
    let temp = history.filter((item) => {
      if (item.name?.toLowerCase().includes(search?.toLowerCase())) return true
      return false
    })
    return temp
  }


  return (
    <div className="history">
      <h2>Your Calculations</h2>
      <input className="search-box" type="search" placeholder="Search..." name="search" onChange={onChangeSearch} value={search} />

      <div className="conatiner">

        <div className="row">
          <div className="column">
            <p>Name</p>
          </div>
          <div className="column">
            <p>Calculation</p>
          </div>
          <div className="column">
            <p>Result</p>
          </div>
          <div className="column">
            <p>Operation</p>
          </div>
        </div>
        {filterItem().map((item, index) => {
          return (
            <div key={index} className="row">
              <div className="column">
                {item.name}
              </div>
              <div key={index} className="column">
                {item.calculation}
              </div>
              <div className="column">
                {item.result}
              </div>
              <div className="column">
                <img className="icon" onClick={() => handleUndo(index)} src={assets.undo} alt="" />
                <img className="icon" onClick={() => handleDelete(index)} src={assets.trashCan} alt="" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default History;