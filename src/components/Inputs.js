import React, { useContext, useState } from 'react';
import '../scss/Inputs.scss'
import { Context, types } from '../store/store';
import { LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export default function Inputs() {

  const { state, dispatch } = useContext(Context);
  const [localState, setLocalState] = useState({
    principal: 0,
    annual_contribution: 0,
    interest_rate: 0,
    senior_interest_rate: 0,
    year: 0
  });

  // array of objects where each object has the following format:
  // {
  //    type: traditional,
  //    data: [{year: 2001, value:1000}, {year: 2002, value:1200}]
  // }
  const [chart, setChart] = useState([]);


  const isStateValid = () => {

  }

  const handleChange = e => {
    if (isNaN(e.target.value)) {
      alert("Please enter a valid number");
    } else {
      let clonedLocalState = { ...localState };
      clonedLocalState[e.target.name] = e.target.value;
      setLocalState(clonedLocalState);
    }
  }

  const handleCalculate = () => {
    const { principal, tax_rate, interest_rate, year } = localState;
    const currentYear = Number(new Date().getFullYear());
    const numOfYears = year - currentYear;
    let calculatedFunds = [];
    calculatedFunds.push({ type: "traditional", data: [] });
    calculatedFunds.push({ type: "roth", data: [] });
    for (let year = 0; year <= numOfYears; year++) {
      // traditional at index 0
      calculatedFunds[0].data.push({
        year: currentYear + year,
        value: roundUp(principal * Math.pow(1.0 + interest_rate / 100.0, year), 2)
      });
      // Roth at index 1
      calculatedFunds[1].data.push({
        year: currentYear + year,
        value: roundUp((principal - principal * tax_rate / 100.0) * Math.pow(1.0 + interest_rate / 100.0, year), 2)
      });
    }
    setChart(calculatedFunds);
  }

    // https://stackoverflow.com/questions/5191088/how-to-round-up-a-number-in-javascript
    function roundUp(num, precision) {
      precision = Math.pow(10, precision)
      return Math.ceil(num * precision) / precision
    }

  return (
    <div className="inputs-container d-flex flex-column justify-content-center" style={{ width: "100%", height: "100%", position: "relative" }}>
      <div>
        <div>
          <label>Principal($):</label>
          <input name="principal" type="number" onChange={handleChange} />
        </div>
        <div>
          <label>Annual Contribution($):</label>
          <input name="annual_contribution" type="number" onChange={handleChange} />
        </div>
        <div>
          <label>Tax Rate(%):</label>
          <input name="tax_rate" type="number" onChange={handleChange} />
        </div>
        <div>
          <label>Interest Rate(%):</label>
          <input name="interest_rate" type="number" onChange={handleChange} />
        </div>
        <div>
          <label>Senior Interest Rate(%):</label>
          <input name="senior_interest_rate" type="number" onChange={handleChange} />
        </div>
        <div>
          <label>Year to Reach 60: </label>
          <input name="year" type="number" onChange={handleChange} />
        </div>
        <button onClick={handleCalculate}>Calculate</button>
        <button>Reset</button>
      </div>
      {chart.length <= 0 || chart[0].data.length <= 0 ? null : (
        <div className="visualizor" style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer>
            <LineChart width={730} height={250} data={chart}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" type="category" allowDuplicatedCategory={false} textAnchor="middle" height={60} label={{ value: 'Year'}} />
              <YAxis label={{ value: 'U.S. dollars ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip separator=": $" />
              <Legend />
              <Line dataKey="value" data={chart[0].data} name="Traditional" stroke="#8884d8" dot={false} />
              <Line dataKey="value" data={chart[1].data} name="Roth" stroke="#82ca9d" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}