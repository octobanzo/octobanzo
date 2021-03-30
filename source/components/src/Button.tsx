import React from 'react';
import styled from 'styled-components';

interface Props {
  rounded?: boolean;
  icon?: boolean | 'left' | 'right' | 'only';
  transparent?: boolean;
  background?: string;
  disabled?: boolean;
}

const defaultProps: Props = {
  rounded: false,
  icon: false,
  transparent: false,
  background: '#171986',
  disabled: false
};

export const Button: React.FC<Props> = (props) => {
  props = { ...defaultProps, ...props };

  return (
    <CustomButton {...props}>
      {props.children || (props.icon === 'only' ? '' : 'Button')}
    </CustomButton>
  );
};

const CustomButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 14px;

  flex: none;
  order: 1;
  align-self: auto;

  cursor: pointer;
  border: none;
  border-radius: ${(props: Props) => (props.rounded ? 1024 : 5)}px;
  background-color: ${(props: Props) => props.background};
  color: white;
  /* color: ${(props: Props) =>
    props.disabled ? 'rgba(255, 255, 255, .5)' : 'white'}; */
  font: inherit;
  font-size: 16px;
`;

// const CustomButton = styled.button`
//     display: inline-flex;
//     justify-content: center;
//     align-items: center;
//     text-align: center;

//     font-size: 16px;

//     cursor: pointer;

//     flex-shrink: 1;
//     flex-grow: 0;
//     /* width: auto; */

//     border: none;
//     color: white;
//     font: inherit;
//     border-radius: ${(props: Props) => (props.rounded ? '50%' : '5px')};
//     min-height: 34px;
// `;
