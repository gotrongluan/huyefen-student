import { stateToHTML } from 'draft-js-export-html';
import _ from 'lodash';
import { customStyleMap } from '@/config/constants';

export const exportToHTML = editorState => {
    const contentState = editorState.getCurrentContent();
    const customInlineStyles = _.mapValues(customStyleMap, val => ({
        style: val
    }));
    const inlineStyles = {
        BOLD: {
            element: 'b',
            style: {
                color: '#FADA5E'
            }
        },
        ...customInlineStyles
    };
    const blockStyleFn = block => {
        const blockType = block.getType();
        if (blockType === 'code-block') 
            return {
                style: {
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: '\'Soure Code Pro\', monospace',
                    padding: '0px 6px 2px 6px',
                    borderLeft: '3px solid #FADA5E',
                    margin: 0
                }
            };
        if (blockType === 'atomic')
            return {
                style: {
                    margin: '0 0 1em'
                }
            };
    };
    const entityStyleFn = entity => {
        const entityType = entity.getType().toUpperCase();
        if (entityType === 'LINK') {
            return {
                element: 'a',
                style: {
                    color: '#FADA5E',
                    textDecoration: 'underline'
                }
            };
        }
        if (entityType === 'IMAGE') {
            const { src, width, height = 'auto', alignment = 'default' } = entity.getData();
            let imageStyle = {
                position: 'relative',
                cursor: 'default',
                width,
                height
            };
            if (alignment === 'left') {
                imageStyle = {
                    ...imageStyle,
                    float: 'left'
                };
            }
            else if (alignment === 'center') {
                imageStyle = {
                    ...imageStyle,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    display: 'block'
                };
            }
            else if (alignment === 'right') {
                imageStyle = {
                    ...imageStyle,
                    float: 'right'
                };
            }
            return {
                element: 'img',
                attributes: {
                    src: src,
                    alt: _.uniqueId('img_')
                },
                style: imageStyle
            }
        }
    };
    const options = {
        inlineStyles,
        blockStyleFn,
        entityStyleFn
    }
    return stateToHTML(contentState, options);
};