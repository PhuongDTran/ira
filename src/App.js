import React, { useReducer } from 'react';
import './App.scss';

import Inputs from "./components/Inputs";
import { Context, initialState, reducer } from './store/store';


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <div className="App">
        <Inputs />
      </div>
    </Context.Provider>
  );
}

export default App;
