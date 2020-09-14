import React from 'react';
import styled from 'styled-components';
import { Section, FlexRow } from '../layout';

export const Hero: React.FC = (props) => {
    return <Section {...props}>{props?.children || <></>}</Section>;
};
