import React from 'react';
import { AppContext } from 'next/app';
import { AppWrapper, GlobalStyle } from '@octobanzo/components';
import Head from 'next/head';

interface AppProps extends AppContext {
    pageProps: object;
}

const AppComponent: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <AppWrapper>
            <Head>
                <title>Octobanzo</title>
            </Head>
            <GlobalStyle />
            <Component {...pageProps} />
        </AppWrapper>
    );
};

export default AppComponent;
