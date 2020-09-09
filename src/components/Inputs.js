import React, { useContext, useState } from 'react';
import '../scss/Inputs.scss'
import { Context } from '../store/store';
import { LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export default function Inputs() {

  const { state, dispatch } = useContext(Context);
  const [localState, setLocalState] = useState({
    principal: 0,
    tax_rate: 0.0,
    interest_rate: 0.0,
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
    let clonedLocalState = { ...localState };
    clonedLocalState[e.target.name] = e.target.value;
    setLocalState(clonedLocalState);
  }

  const handleCalculate = () => {
    const { principal, tax_rate, interest_rate, year } = state;
    const currentYear = Number(new Date().getFullYear());
    const numOfYears = year - currentYear;
    let calculatedFunds = [];
    calculatedFunds.push({ type: "Traditional", data: [] });
    calculatedFunds.push({ type: "Roth", data: [] });
    for (let year = 0; year <= numOfYears; year++) {
      // traditional at index 0
      calculatedFunds[0].data.push({
        year: currentYear + year,
        value: principal * Math.pow(1.0 + interest_rate, year)
      });
      // Roth at index 1
      calculatedFunds[1].data.push({
        year: currentYear + year,
        value: (principal - principal * tax_rate) * Math.pow(1.0 + interest_rate, year)
      });
    }
    console.log(calculatedFunds)
    setChart(calculatedFunds);
  }

  const data = [
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

  return (
    <div className="inputs-container d-flex flex-column" style={{width: "100%", height:"100%", position: "relative"}}>
      {/* <div>
        <div>
          <label>Principal:</label>
          <input name="principal" onChange={handleChange} />
        </div>
        <div>
          <label>Tax Rate:</label>
          <input name="tax_rate" onChange={handleChange} />
        </div>
        <div>
          <label>Interest Rate:</label>
          <input name="interest_rate" onChange={handleChange} />
        </div>
        <div>
          <label>Year to Reach 60</label>
          <input name="year" onChange={handleChange} />
        </div>
        <button onClick={handleCalculate}>Calculate</button>
        <button>Reset</button>
      </div> */}
      <div className="visualizor">
      <LineChart width={600} height={300} data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
      </div>
    </div>
  )
}