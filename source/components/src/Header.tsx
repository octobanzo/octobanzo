import React from 'react';
import styled from 'styled-components';
import { Utils } from '@octobanzo/common';
import Link from 'next/link';
import { SpaceCharacter } from './a11y';

interface Props {
    fullWidth?: boolean;
}

const defaultProps: Props = {
    fullWidth: false
};

export const Header: React.FC<Props> = (props) => {
    Utils.deepMerge(props, defaultProps, props);

    return (
        <HeaderWrapper>
            <HeaderInner {...props}>
                <Link href="/" passHref>
                    <SiteName>
                        <span>Octobanzo</span>
                        <SpaceCharacter />
                        <SiteNameTag>Alpha</SiteNameTag>
                    </SiteName>
                </Link>
            </HeaderInner>
        </HeaderWrapper>
    );
};

const HeaderWrapper = styled.header`
    max-width: 100%;
    font-size: 18px;
`;

const HeaderInner = styled.div<Props>`
    /* max-width: ${(props) => (props.fullWidth ? '100%' : '1024px')}; */
    margin: 0 auto;
    padding: 15px;
`;

const SiteName = styled.a`
    color: inherit;
    text-decoration: none;

    font-size: 20px;
    font-weight: 550;

    :focus {
        /* text-decoration: underline; */
    }

    :active {
        opacity: 0.5;
    }
`;

const SiteNameTag = styled.span`
    font-size: 15px;
    text-transform: uppercase;
    opacity: 0.7;
    margin-left: 4px;
`;
