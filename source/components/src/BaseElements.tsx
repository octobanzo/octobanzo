import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        
        background-color: #101010;
        color: #f8f8f8;
        font-family: 'Inter', sans-serif;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    *:focus {
        box-shadow: 0 0 2px 3px rgba(0, 128, 255, .65);
    }
`;

export const AppWrapper = styled.div`
    /* background: green; */
`;

export const fontUrl =
    'https://fonts.googleapis.com/css2?family=Inter:wght@320,400;530;650&display=block';
