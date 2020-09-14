import React from 'react';
import styled from 'styled-components';
import { FlexRow } from '.';

export const Section: React.FC = (props) => {
    return <SectionComponent {...props}>{props?.children}</SectionComponent>;
};

const SectionComponent = styled(FlexRow)`
    padding: 80px var(--page-padding);
    max-width: var(--page-max-width);
`;
