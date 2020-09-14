import React from 'react';
import styled from 'styled-components';
import { Utils } from '@octobanzo/common';

interface Props {
    name?: string;
}

const defaultProps: Props = {
    name: ''
};

export const Icon: React.FC<Props> = (props) => {
    Utils.deepMerge(props, defaultProps, props);

    return <></>;
};
