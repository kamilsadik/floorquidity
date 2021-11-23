import React, { Component, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//import DisplayHoldings from "./DisplayHoldings.jsx";
import { userHoldings } from "./UserHoldings.jsx";
import { tokens } from "./Inventory.jsx";

const useStyles = makeStyles({
  table: {
    minWidth: 350,
  },
});

const HoldingsTable = props => {
  const {
    address,
    name,
    symbol,
    description,
    verified,
    outstanding,
    maxSupply,
    lastPrice,
    creatorTokenId,
  } = props;

  const classes = useStyles();

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

  function createData(token, amountHeld, value) {
    return { token, amountHeld, value };
  }

  // Initialize empty array of rows
  const rows = [];
  // Initialize total number of tokens user holds
  let totalUserTokens = 0;
  // Initialize total value of user tokens
  let totalUserValue = 0;

  // Add user's holdings of each token to array of rows
  for (let i=0; i<holdingsState.length; i++) {
    // Only include a row for tokens the user actually owns
    if (holdingsState[i] != 0) {
      rows.push(
        createData(
          tokenState.map(tokenObj => tokenObj.symbol)[i],
          holdingsState[i],
          (holdingsState[i]*tokenState.map(tokenObj => tokenObj.lastPrice)[i]/1000000000000000000).toFixed(6)
        )
      )
    }
    // Update total number of tokens user holds
    totalUserTokens+=Number(holdingsState[i]);
    // Update total value of user's tokens
    totalUserValue+=(holdingsState[i]*tokenState.map(tokenObj => tokenObj.lastPrice)[i]/1000000000000000000);
  }

  // Add row showing holding totals
  rows.push(
    createData(
      'TOTAL',
      totalUserTokens,
      totalUserValue.toFixed(6)
    )
  )

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell align="right">Holdings</TableCell>
            <TableCell align="right">Value (ETH)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.token}>
              <TableCell component="th" scope="row">
                {row.token}
              </TableCell>
              <TableCell align="right">{row.amountHeld}</TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );


}

export default HoldingsTable