import React, { Component, useState, useEffect, ImageBackground, View, Text } from "react";
import Paper from '@material-ui/core/Paper';
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Header from "./Header";
import Content from "./Content";
import DisplayHoldings from "./DisplayHoldings.jsx";
import FrequentlyAskedQuestions from "./FrequentlyAskedQuestions.jsx";
import Footer from "./Footer.jsx";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import "./styles.css";

const darkTheme = createTheme({
  palette: {
    type: 'dark',
  },
});

const styles = {
	paperContainer: {
		backgroundImage: './assets/img/background.jpg',
	}
}

function Home() {
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline/>
			<Grid container direction="column">
				<Grid item>
					<Header />
		        </Grid>

		        <img src={require('./assets/img/background.jpg')} className="photo"/>

		        <br /><br />

		        <Grid item container>
		        	<Grid item xs={false} sm={2} />
	        		<Grid item xs={12} sm={8}>
	        			<Content />
    				</Grid>
    				<Grid item xs={false} sm={2} />
		        </Grid>
				
				<br /><br /><br />
		        
		        <Grid item container>
		        	<Grid item xs={false} sm={2} />
	        		<Grid item xs={12} sm={8}>
	        			<FrequentlyAskedQuestions />
    				</Grid>
    				<Grid item xs={false} sm={2} />
		        </Grid>
		    </Grid>
		    
		    <br /><br /><br /><br />
		    {/*<Footer />*/}
		    <br /><br /><br />
		</ThemeProvider>
	);
}

export default Home;