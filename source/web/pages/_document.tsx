import Document, { Html, Head, Main, NextScript } from 'next/document';
import { fontUrl } from '@octobanzo/components';
import { ServerStyleSheet } from 'styled-components';

class DocumentClass extends Document {
    render() {
        return (
            <Html>
                <Head>
                    {/* this will be more useful in the future */}
                    <link rel="preload" href={fontUrl} as="style" />

                    <link rel="stylesheet" href={fontUrl} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default DocumentClass;

export async function getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App: any) => (props: any) =>
                    sheet.collectStyles(<App {...props} />)
            });

        const initialProps = await Document.getInitialProps(ctx);
        return {
            ...initialProps,
            styles: (
                <>
                    {initialProps.styles}
                    {sheet.getStyleElement()}
                </>
            )
        };
    } finally {
        sheet.seal();
    }
}
