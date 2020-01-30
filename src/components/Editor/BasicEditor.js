import React, { useState } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Button, Tooltip, Popover, Dropdown, Menu, Icon } from 'antd';
import { Modifier, EditorState, RichUtils, KeyBindingUtil, getDefaultKeyBinding } from 'draft-js';
import { customStyleMap, customColorMap } from '@/config/constants';
import Editor from 'draft-js-plugins-editor';
import styles from './BasicEditor.less';

const { hasCommandModifier } = KeyBindingUtil;

const BasicEditor = ({ editorState, onChange, placeholder }) => {
    const [colorVisible, setColorVisible] = useState(false);

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
    }
    const handleInlineStyle = inlineStyle => e => {
        e.preventDefault();
        onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };
    const handleToggleColor = color => e => {
		e.preventDefault();
		const selection = editorState.getSelection();

		// Let's just allow one color at a time. Turn off all active colors.
		const nextContentState = _.keys(customColorMap)
		.reduce((contentState, color) => {
			return Modifier.removeInlineStyle(contentState, selection, color)
		}, editorState.getCurrentContent());

		let nextEditorState = EditorState.push(
			editorState,
			nextContentState,
			'change-inline-style'
		);

		const currentStyle = editorState.getCurrentInlineStyle();

		// Unset style override for current color.
		if (selection.isCollapsed()) {
			nextEditorState = currentStyle.reduce((state, color) => {
				return !!customColorMap[color] ? RichUtils.toggleInlineStyle(state, color) : state;
			}, nextEditorState);
		}

		// If the color is being toggled on, apply it.
		if (!currentStyle.has(color)) {
			nextEditorState = RichUtils.toggleInlineStyle(
				nextEditorState,
				color
			);
		}

		onChange(nextEditorState);
		setColorVisible(false);
    };
    const customColorMapKeys = _.keys(customColorMap);
	let colorData = _.map(customColorMapKeys, colorKey => ({
		key: colorKey,
		...customColorMap[colorKey]
	}));
	colorData = _.chunk(colorData, 5);
	const currentInlineStyle = editorState.getCurrentInlineStyle();
	let activeKey;
	for (let i = 0; i < customColorMapKeys.length; ++i) {
		if (currentInlineStyle.has(customColorMapKeys[i])) {
			activeKey = customColorMapKeys[i];
			break;
		}
	}
	if (!activeKey) activeKey = 'BLACK';
    return (
        <div className={styles.basicEditor}>
            <div className={styles.buttons}>
                <Tooltip placement="top" title="Bold | Cmd+B">
                    <span className={styles.btn} onMouseDown={handleInlineStyle('BOLD')}><Icon type="bold" /></span>
                </Tooltip>
                <Tooltip placement="top" title="Italic | Cmd+I">
                    <span className={styles.btn} onMouseDown={handleInlineStyle('ITALIC')}><Icon type="italic" /></span>
                </Tooltip>
                <Tooltip placement="top" title="Underline | Cmd+U">
                    <span className={styles.btn} onMouseDown={handleInlineStyle('UNDERLINE')}><Icon type="underline" /></span>
                </Tooltip>
                <Tooltip placement="top" title="Highlight | Cmd+H">
                    <span className={styles.btn} onMouseDown={handleInlineStyle('HIGHLIGHT')}><Icon type="highlight" /></span>
                </Tooltip>
                <Popover
                    placement="bottom"
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
                </Popover>
            </div>
            <div className={styles.editor}>
                <Editor
                    customStyleMap={customStyleMap}
                    editorState={editorState}
                    onChange={onChange}
                    placeholder={placeholder}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={keyBindingFn}
                />
            </div>
        </div>
    )
};

export default BasicEditor;