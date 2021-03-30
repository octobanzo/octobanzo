import React from 'react';
import { NextPage } from 'next';
import { Button, Header, Hero } from '@octobanzo/components';
import styled from 'styled-components';

interface Props {}

const IndexPage: NextPage<Props> = (props) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}
        >
            {/* <Header /> */}
            <h1>Coming soon</h1>
            {/* <HeroCTA>
                    <h2
                        style={{
                            fontSize: 36,
                            lineHeight: '36px',
                            margin: 0,
                            marginBottom: 10,
                            letterSpacing: '-0.04em',
                            fontWeight: 600
                        }}
                    >
                        Super&nbsp;powerful Discord&nbsp;bot.
                    </h2>
                    <h3
                        style={{
                            margin: 0,
                            marginBottom: 10,
                            letterSpacing: '-0.04em',
                            fontWeight: 600
                        }}
                    >
                        Powered&nbsp;by machine&nbsp;learning.
                    </h3>
                    {/* <div>
                        <Button rounded disabled>
                            Get started
                        </Button>
                        <Button transparent disabled>
                            Coming soon
                        </Button>
                    </div>
                </HeroCTA> */}
        </div>
    );
};

const HeroCTA = styled.div`
    /* color: green; */
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    grid-column: 1 / -1;
    text-align: center;

    @media screen and (min-width: 768px) {
        text-align: left;
        align-items: flex-start;
        grid-column: 2 / span 6;
    }

    @media screen and (min-width: 1024px) {
        grid-column: 2 / span 8;
    }
`;

export default IndexPage;
