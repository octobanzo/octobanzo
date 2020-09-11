import App, { AppContext } from 'next/app';

interface AppProps extends AppContext {
    pageProps: object;
}

const AppComponent = ({ Component, pageProps }: AppProps) => {
    return (
        <div>
            <Component {...pageProps} />
        </div>
    );
};

export default AppComponent;
