import { AppContext } from 'next/app';
import { AppWrapper, GlobalStyle } from '@octobanzo/components';

interface AppProps extends AppContext {
    pageProps: object;
}

const AppComponent: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <AppWrapper>
            <GlobalStyle />
            <Component {...pageProps} />
        </AppWrapper>
    );
};

export default AppComponent;
