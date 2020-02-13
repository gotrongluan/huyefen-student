import React, { useState, useRef } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Button, Tooltip, Popover, Icon, Input } from 'antd';
import { Modifier, EditorState, RichUtils, KeyBindingUtil, getDefaultKeyBinding } from 'draft-js';
import { customStyleMap, customColorMap } from '@/config/constants';
import Editor from 'draft-js-plugins-editor';
import { checkValidLinkWithoutProtocol } from '@/utils/utils';
import styles from './BasicEditor.less';

const { hasCommandModifier } = KeyBindingUtil;
const { Search } = Input;

const findLinkEntity = (contentBlock, callback, contentState) => {
	contentBlock.findEntityRanges((character) => {
		const entityKey = character.getEntity();
		if (entityKey === null) {
			return false;
		}
		return contentState.getEntity(entityKey).getType() === 'LINK';
	}, callback);
};

const Anchor = ({ contentState, entityKey, children }) => {
    const { href } = contentState.getEntity(entityKey).getData();
    const link = `https://${href}`;
	return (
		<Tooltip placement="top" title={`Shift+Click to ${link}`}>
            <span 
                className={styles.link}
                onClick={e => {
                    e.stopPropagation();
                    if (e.shiftKey) {
                        window.open(link, '_blank');
                    }
                }}
            >
                {children}
            </span>
        </Tooltip>
	);
};

const BasicEditor = ({ editorState, onChange, placeholder }) => {
    const editorRef = useRef(null);
    //const [colorVisible, setColorVisible] = useState(false);
    const [link, setLink] = useState('');
    const [linkVisible, setLinkVisible] = useState(false);
    const decorators = [
        {
            strategy: findLinkEntity,
            component: Anchor
        }
    ];
    const blockStyleFn = contentBlock => {
        const blockType = contentBlock.getType();
        if (blockType === 'code-block') return styles.codeBlock;
    };
    const onKeyPressed = e => {
        if (e.key === 'Tab') {
            e.preventDefault();
			const newContentState = Modifier.replaceText(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                '\t'
            );
            onChange(EditorState.push(editorState, newContentState, 'tab-character'));
		}
    };
    const handleKeyCommand = command => {
        if (command === 'highlight') {
            return onChange(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
        }
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };
    const keyBindingFn = e => {
        if (e.keyCode === 72 && hasCommandModifier(e)) {
            return 'highlight';
        }
        return getDefaultKeyBinding(e);
    };
    const handleFocus = () => editorRef.current.focus();
    const handleInlineStyle = inlineStyle => e => {
        e.preventDefault();
        onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };
    const handleBlock = blockType => e => {
        e.preventDefault();
        onChange(RichUtils.toggleBlockType(editorState, blockType));
    };
    // const handleToggleColor = color => e => {
	// 	e.preventDefault();
	// 	const selection = editorState.getSelection();

	// 	// Let's just allow one color at a time. Turn off all active colors.
	// 	const nextContentState = _.keys(customColorMap)
	// 	.reduce((contentState, color) => {
	// 		return Modifier.removeInlineStyle(contentState, selection, color)
	// 	}, editorState.getCurrentContent());

	// 	let nextEditorState = EditorState.push(
	// 		editorState,
	// 		nextContentState,
	// 		'change-inline-style'
	// 	);

	// 	const currentStyle = editorState.getCurrentInlineStyle();

	// 	// Unset style override for current color.
	// 	if (selection.isCollapsed()) {
	// 		nextEditorState = currentStyle.reduce((state, color) => {
	// 			return !!customColorMap[color] ? RichUtils.toggleInlineStyle(state, color) : state;
	// 		}, nextEditorState);
	// 	}

	// 	// If the color is being toggled on, apply it.
	// 	if (!currentStyle.has(color)) {
	// 		nextEditorState = RichUtils.toggleInlineStyle(
	// 			nextEditorState,
	// 			color
	// 		);
	// 	}

	// 	onChange(nextEditorState);
	// 	setColorVisible(false);
    // };
    const handleAddLink = () => {
        const selection = editorState.getSelection();
		const contentState = editorState.getCurrentContent();
		let newContentState = contentState.createEntity('LINK', 'MUTABLE', { href: link });
		const entityKey = newContentState.getLastCreatedEntityKey();
		newContentState = Modifier.applyEntity(
			newContentState,
			selection,
			entityKey
		);
		const newEditorState = EditorState.push(
			editorState,
			newContentState,
			'add-new-link'
		);
		onChange(newEditorState);
		setLinkVisible(false);
		setLink('');
    };
    const getBlockType = () => {
        const selectionState = editorState.getSelection();
		return editorState.getCurrentContent().getBlockForKey(selectionState.getStartKey()).getType();
    };
    const inlineStyleBtnClass = inlineStyle => {
        const currentInlineStyle = editorState.getCurrentInlineStyle();
        if (currentInlineStyle.has(inlineStyle)) return classNames(styles.btn, styles.btnActive);
        return styles.btn;
    };
    const entityClass = entityType => {
        const selectionState = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const blockKey = selectionState.getStartKey();
        const offset = selectionState.getStartOffset();
        const block = contentState.getBlockForKey(blockKey);
        const entityKey = block.getEntityAt(offset);
        if (entityKey) {
            const entity = contentState.getEntity(entityKey);
            return entity.getType() === entityType ? classNames(styles.btnActive, styles.btn) : styles.btn;
        }
        return styles.btn;
    };
    const blockBtnClass = blockType => {
        if (getBlockType() === blockType) return classNames(styles.btn, styles.btnActive);
        return styles.btn;
    };
    //const customColorMapKeys = _.keys(customColorMap);
	// let colorData = _.map(customColorMapKeys, colorKey => ({
	// 	key: colorKey,
	// 	...customColorMap[colorKey]
	// }));
	// colorData = _.chunk(colorData, 5);
	// const currentInlineStyle = editorState.getCurrentInlineStyle();
	// let activeKey;
	// for (let i = 0; i < customColorMapKeys.length; ++i) {
	// 	if (currentInlineStyle.has(customColorMapKeys[i])) {
	// 		activeKey = customColorMapKeys[i];
	// 		break;
	// 	}
	// }
	// if (!activeKey) activeKey = 'SILVER';
    return (
        <div className={styles.basicEditor}>
            <div className={styles.buttons}>
                <Tooltip placement="top" title="Bold | Cmd+B">
                    <span className={inlineStyleBtnClass('BOLD')} onMouseDown={handleInlineStyle('BOLD')}><Icon type="bold" /></span>
                </Tooltip>
                <Tooltip placement="top" title="Italic | Cmd+I">
                    <span className={inlineStyleBtnClass('ITALIC')} onMouseDown={handleInlineStyle('ITALIC')}><Icon type="italic" /></span>
                </Tooltip>
                <Tooltip placement="top" title="Underline | Cmd+U">
                    <span className={inlineStyleBtnClass('UNDERLINE')} onMouseDown={handleInlineStyle('UNDERLINE')}><Icon type="underline" /></span>
                </Tooltip>
                <Tooltip placement="top" title="Highlight | Cmd+H">
                    <span className={inlineStyleBtnClass('HIGHLIGHT')} onMouseDown={handleInlineStyle('HIGHLIGHT')}><Icon type="highlight" /></span>
                </Tooltip>
                {/* <Popover
                    placement="top"
                    content={(
                        <div>
                            <div className={styles.header}>Select color</div>
                            <div className={styles.colors}>
                                {_.map(colorData, colorRow => (
                                    <div key={_.uniqueId('color_row_')} className={styles.row}>
                                        {_.map(colorRow, color => (
                                            <span 
                                                className={activeKey === color.key ? classNames(styles.active, styles.color) : styles.color}
                                                key={color.key}
                                                onMouseDown={handleToggleColor(color.key)}
                                            >
                                                <span className={styles.icon} style={{ backgroundColor: color.color }}/>
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    popupClassName={styles.colorPopover}
                    trigger="hover"
                    visible={colorVisible}
                    onVisibleChange={setColorVisible}
                >
                    <span className={styles.btn} ><Icon type="font-colors" /></span>
                </Popover> */}
                <Popover
                    placement="top"
                    popupClassName={styles.linkPopover}
                    trigger="hover"
                    visible={linkVisible}
                    onVisibleChange={setLinkVisible}
                    content={(
                        <div className={styles.content}>
                            <Search
                                addonBefore={<span>https://</span>}
                                enterButton={
                                    <Button
                                        type="primary"
                                        disabled={!checkValidLinkWithoutProtocol(link)}
                                        style={{ width: 60 }}
                                    >
                                        Add
                                    </Button>
                                }
                                value={link}
                                placeholder="Enter href..."
                                onChange={e => setLink(e.target.value)}
                                onSearch={handleAddLink}
                            />
                        </div>
                    )}
                >
                    <span className={entityClass('LINK')} ><Icon type="link" /></span>
                </Popover>
                <Tooltip placement="top" title="Header 2">
                    <span className={blockBtnClass('header-two')} onMouseDown={handleBlock('header-two')}>H2</span>
                </Tooltip>
                <Tooltip placement="top" title="Header 5">
                    <span className={blockBtnClass('header-five')} onMouseDown={handleBlock('header-five')}>H5</span>
                </Tooltip>
                <Tooltip placement="top" title="Code block">
                    <span className={blockBtnClass('code-block')} onMouseDown={handleBlock('code-block')}><Icon type="code" /></span>
                </Tooltip>
            </div>
            <div className={styles.editor} onKeyDown={onKeyPressed} onClick={handleFocus}>
                <Editor
                    blockStyleFn={blockStyleFn}
                    customStyleMap={customStyleMap}
                    editorState={editorState}
                    onChange={onChange}
                    placeholder={placeholder}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={keyBindingFn}
                    decorators={decorators}
                    ref={editorRef}
                />
            </div>
        </div>
    )
};

export default BasicEditor;