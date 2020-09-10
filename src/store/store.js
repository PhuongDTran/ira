import React from 'react';

export const initialState = {
  principal: 1000,
  tax_rate: 23,
  interest_rate: 1,
  senior_interest_rate: 0,
  year: 2025
}

export const types = {
  UPDATE_ALL: "UPDATE_ALL"
}

export function reducer (state, action) {
  switch (action.type) {
    case types.UPDATE_ALL:
      return {...action.payload}
    default:
      return initialState
  }
}

export const Context = React.createContext(null)