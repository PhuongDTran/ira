import React from 'react';

export const initialState = {
  principal: 1000,
  tax_rate: 0.23,
  interest_rate: 0.1,
  senior_interest_rate: 0.0,
  year: 2025
}

export const types = {

}

export function reducer (state, action) {
  switch (action.type) {
    case types.SET_COLOR:
    default:
      return initialState
  }
}

export const Context = React.createContext(null)