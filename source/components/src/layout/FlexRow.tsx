import React from 'react';
import styled from 'styled-components';

export const Row: React.FC = (props) => {
    return <FlexRow {...props}>{props?.children}</FlexRow>;
};

const FlexRow = styled.div`
    display: grid;
    grid-template-columns: repeat(var(--column-count), 1fr);
    gap: 0 15px;
`;
