import React from 'react';

// TODO: test this with actual screen reader:
// I need to learn how they typically respond to various HTML information
//   (tags, attributes, etc.)

/**
 * Accessibility space:
 * Allows copied text to include a space without affecting visual layout.
 *
 * **WARNING:** Do not use in standard text! Only use in things like
 * visual lockups, where visual space is added by margin and text will not contain
 * proper space when copying or using a screen reader.
 */
export const SpaceCharacter: React.FC = (props) => {
    return (
        <span
            style={{
                width: 0,
                height: 0,
                display: 'inline-flex',
                overflow: 'visible'
            }}
        >
            {props.children || <>&nbsp;</>}
        </span>
    );
};
