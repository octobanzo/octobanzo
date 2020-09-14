import React from 'react';
import styled from 'styled-components';
import { Utils } from '@octobanzo/common';
import Link from 'next/link';
import { SpaceCharacter } from './a11y';
import { FlexRow } from './layout';

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

const HeaderWrapper = styled(FlexRow)`
    max-width: 100%;
    font-size: 18px;
    padding: 0 var(--page-padding);
`;

const HeaderInner = styled.div<Props>`
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    height: 62px;

    @media screen and (max-width: 768px) {
        justify-content: center;
    }
`;

const SiteName = styled.a`
    color: inherit;
    text-decoration: none;

    font-size: 20px;
    font-weight: 550;

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
