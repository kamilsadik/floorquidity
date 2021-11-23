import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';


const data = {
    title: "FAQ",
    rows: [
        {
            title: "What is Kreana?",
            content: `Krena is a Ethereum-based fundraising platform and marketplace for creators and their fans. Creators can mint a fundraising
            token, and fans can buy and sell the tokens of their favorite creators. To incentivize token ownership, creators can offer perks like 1:1 Zooms,
            backstage passes, and more to holders of their tokens. Fans benefit from guaranteed liquidity on their creator token holdings, and the
            potential for price appreciation as their favorite creator's following grows.`,
        },
        {
            title: "How does it work?",
            content: `Kreana uses a novel mechanism called a  <a href="https://github.com/kamilsadik/Kreana/blob/main/README.md" target="_blank">Dynamic Automated Market Maker (DAMM)</a>. The DAMM is a variation of a
            traditional bonding curve which allows for a fixed percentage of the liquidity pool to be routed toward a fundraising goal,
            while the remainder of the pool serves to provide smooth and continuous liquidity on the underlying token. Creator tokens
            conform to the <a href="https://docs.openzeppelin.com/contracts/3.x/erc1155" target="_blank">ERC-1155 Multi Token Standard</a>.`,
        },
        {
            title: "What do I need in order to get started?",
            content: `In order to create a token, or to buy and sell a creator's token, you'll need an Ethereum wallet that allows you
            to interact with Ethereum blockchain apps. We recommend <a href="https://metamask.io/index.html" target="_blank">MetaMask</a>, an easy-to-use wallet
            built into your browser. Once you've set up your wallet, you'll just need to buy some ETH in order to transact.\n(Note: For the
            alpha release on Rinkeby testnet, you can get ETH for free from the <a href="https://faucet.rinkeby.io/" target="_blank">Rinkeby faucet</a>).`,
        },
        {
            title: "How do I create my own token?",
            content: `Once your <a href="https://metamask.io/index.html" target="_blank">MetaMask</a> wallet is set up, just
            click the "Create a Token" button in the menu bar to mint your fundraising token!`,
        },
        {
            title: "How do I buy or sell a token?",
            content: `Once your <a href="https://metamask.io/index.html" target="_blank">MetaMask</a> wallet is set up, just
            click "Buy" or "Sell" on the token you'd like to trade! Note that you can only sell tokens you own.`,
        },
        {
            title: "Where can I get help or send suggestions?",
            content: `We'd love to hear from you! You can reach us at <a href="mailto:hello@kreana.xyz" target="_blank">hello@kreana.xyz</a>.`,
        },
    ],
};

const styles = {
    bgColor: 'transparent',
    titleTextColor: "white",
    rowTitleColor: "white",
    rowContentColor: "#FFFFFFB3",
    arrowColor: "white",
    rowContentPaddingLeft: "20px",
    rowContentPaddingBottom: "15px",
};

const darkTheme = createTheme({
  palette: {
    type: 'dark',
  },
});


const config = {
    // animate: true,
    // arrowIcon: "V",
    // tabFocus: true
};

export default function FrequentlyAskedQuestions() {

    return (
        <div>
            <Faq
                data={data}
                styles={styles}
                config={config}
            />
        </div>
    );
}
