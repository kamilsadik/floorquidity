import React, { Component, useState, useEffect } from "react";
import TokenCard from "./TokenCard";
import { Grid } from "@material-ui/core";
import tokenList from "./constants";
import { tokens } from "./Inventory.jsx";

const Content = () => {

  const [tokenState, setTokenState] = useState([]);

  console.log(tokens);
  window.tokens=tokens;
  useEffect(() => {
    async function fetchData() {
      setTokenState(await tokens);
    }
    fetchData();
  }, []);

  const getTokenCard = tokenObj => {
    return (
      <Grid item xs={12} sm={4} lg={3} alignItems="stretch">
        <TokenCard {...tokenObj} />
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      {tokenState.map(tokenObj => getTokenCard(tokenObj))}
    </Grid>
  );
};

export default Content;
