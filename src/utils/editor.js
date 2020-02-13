import { stateToHTML } from 'draft-js-export-html';
import _ from 'lodash';
import { customStyleMap } from '@/config/constants';

export const exportToHTML = editorState => {
    const contentState = editorState.getCurrentContent();
    const customInlineStyles = _.mapValues(customStyleMap, val => ({
        style: val
    }));
    const inlineStyles = {
        ...customInlineStyles
    };
    const blockRenderers = {
        'code-block': (block) => {
            return (
                '<pre style="font-weight:bold;color:white;font-family:\'Source Code Pro\', monospace;padding:0px 6px 2px 6px;border-left: 3px solid #FADA5E;margin:0">' + block.getText() + '</pre>'
            )
        }
    };
    const blockStyleFn = block => {
        const blockType = block.getType();
        // if (blockType === 'code-block') 
        //     return {
        //         style: {
        //             fontWeight: 'bold',
        //             color: 'white',
        //             fontFamily: '\'Soure Code Pro\', monospace',
        //             padding: '0px 6px 2px 6px',
        //             borderLeft: '3px solid #FADA5E',
        //             margin: 0
        //         }
        //     };
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
            const { href } = entity.getData();
            return {
                element: 'a',
                attributes: {
                    href: `https://${href}`,
                    target: '_blank',
                },
                style: {
                    cursor: 'pointer',
                    color: '#FADA5E'
                }
            };
        }
        if (entityType === 'IMAGE') {
            const { src, width = 40, height, alignment = 'default' } = entity.getData();
            let imageStyle = {
                position: 'relative',
                cursor: 'default',
                width: `${width}%`,
                height: height ? `${height}%` : 'auto'
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
        entityStyleFn,
        blockRenderers,
        defaultBlockTag: 'div'
    }
    return stateToHTML(contentState, options);
};