import React, { Component, useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { userHoldings } from "./UserHoldings.jsx";
import { tokens } from "./Inventory.jsx";

const DisplayHoldings = () => {

  const [holdingsState, setHoldingsState] = useState([]);
  console.log(userHoldings);
  useEffect(() => {
    async function fetchData() {
      setHoldingsState(await userHoldings);
    }
    fetchData();
  }, []);

  const [tokenState, setTokenState] = useState([]);
  useEffect(() => {
    async function fetchData() {
      setTokenState(await tokens);
    }
    fetchData();
  }, []);

  const getTokenAmount = tokenAmountObj => {
    return (
      <div>
        {tokenAmountObj}
      </div>
    );
  };

  return (
    <div>
      {holdingsState.map(tokenAmountObj => getTokenAmount(tokenAmountObj))}
    </div>
  );
};

export default DisplayHoldings;

//      {tokenState.map(obj => <div>obj</div>)}
