import React, { useContext, useState } from 'react';
import '../scss/Inputs.scss'
import { Context, types } from '../store/store';
import { LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export default function Inputs() {

  const { state, dispatch } = useContext(Context);
  const [localState, setLocalState] = useState({
    principal: 0,
    annual_contribution: 0,
    tax_rate: 0,
    interest_rate: 0,
    senior_tax_rate: 0,
    year_retire: 0,
    withdraw_year: 0,
    withdraw_amount: 0,
  });

  // array of objects where each object has the following format:
  // {
  //    type: traditional,
  //    data: [{year: 2001, value:1000}, {year: 2002, value:1200}]
  // }
  const [chart, setChart] = useState([]);
  const [withdrawTable, setWithdrawTable] = useState([]);

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
    const { principal, tax_rate, interest_rate, year_retire } = localState;
    const currentYear = Number(new Date().getFullYear());
    const numOfYears = year_retire - currentYear;
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

  const computeTraditionalPenalty = (withdrawAmount) => {
    const { tax_rate } = localState;
    return Number(withdrawAmount) * (tax_rate + 0.1);
  }

  const computeRothPenalty = () => {
    return 0
  }

  const handleDelete = (e) => {
    let cloned = [...withdrawTable];
    cloned.splice(e.target.value, 1); // remove element at index e.target.value
    setWithdrawTable(cloned);
  }

  const handleAdd = () => {
    let cloned = [...withdrawTable];
    const { withdraw_amount, withdraw_year } = localState;
    if (withdraw_amount === 0 || withdraw_year === 0) {
      return;
    }
    let row = {};
    row.year = Number(withdraw_year);
    row.amount = Number(withdraw_amount);
    // Traditional computations
    row.traditional = {};
    row.traditional.costs = computeTraditionalPenalty(withdraw_amount);
    row.traditional.remaining = withdraw_amount - computeTraditionalPenalty(withdraw_amount);
    // Roth computations
    row.roth = {};
    row.roth.costs = computeRothPenalty(withdraw_amount);
    row.roth.remaining = withdraw_amount - computeRothPenalty(withdraw_amount);

    cloned.push(row);
    cloned.sort((o1, o2) => o1.year - o2.year);
    setWithdrawTable(cloned);
    // reset, get ready for next row
    setLocalState({ ...localState, withdraw_amount: 0, withdraw_year: 0 });
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
          <input name="senior_tax_rate" type="number" onChange={handleChange} />
        </div>
        <div>
          <label>Year to Reach 60: </label>
          <input name="year_retire" type="number" onChange={handleChange} />
        </div>
        <button onClick={handleCalculate}>Calculate</button>
        <button>Reset</button>
      </div>
      {/* {chart.length <= 0 || chart[0].data.length <= 0 ? null : (
        <div className="visualizor" style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer>
            <LineChart width={730} height={250} data={chart}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" type="category" allowDuplicatedCategory={false} textAnchor="middle" height={60} label={{ value: 'Year' }} />
              <YAxis label={{ value: 'U.S. dollars ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip separator=": $" />
              <Legend />
              <Line dataKey="value" data={chart[0].data} name="Traditional" stroke="#8884d8" dot={false} />
              <Line dataKey="value" data={chart[1].data} name="Roth" stroke="#82ca9d" dot={false} />
            </LineChart>
          </ResponsiveContainer> */}
      <div>
        <table className="withdraw-table table">
          <thead>
            <tr>
              <th scope="col">Year:</th>
              <th scope="col">Amount($):</th>
              <th scope="col">Traditional IRA</th>
              <th scope="col">Roth IRA</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawTable.map( (e,i) =>
              <tr key={i}>
              <td><input name="withdraw_year" value={e.year} readOnly /></td>
              <td><input name="withdraw_amount" value={e.amount} readOnly /></td>
              <td>
                <div>
                  <div>
                    <label>Costs(tax, penalties): {e.traditional.costs}</label>
                  </div>
                  <div>
                    <label>Remaining: {e.traditional.remaining}</label>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <label>Costs(tax, penalties): {e.roth.costs}</label>
                  </div>
                  <div>
                    <label>Remaining:{e.roth.remaining}</label>
                  </div>
                </div>
              </td>
              <td>
                <button value={i} onClick={handleDelete}>Delete</button>
              </td>
            </tr>
            )}
            <tr key={withdrawTable.length}>
              <td><input name="withdraw_year" onChange={handleChange} /></td>
              <td><input name="withdraw_amount" onChange={handleChange} /></td>
              <td>
                {/* <div>
                  <div>
                    <label>Costs(tax, penalties): </label>
                  </div>
                  <div>
                    <label>Remaining: </label>
                  </div>
                </div> */}
              </td>
              <td>
                {/* <div>
                  <div>
                    <label>Costs(tax, penalties): </label>
                  </div>
                  <div>
                    <label>Remaining:</label>
                  </div>
                </div> */}
              </td>
              <td>
                <button value={withdrawTable.length} onClick={handleAdd}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    //   )}
    // </div>
  )
}