import React, { useState } from 'react';
import _ from 'lodash';
import { Button, Tooltip, Popover, Dropdown, Menu, Icon } from 'antd';
import { CompositeDecorator, EditorState, RichUtils } from 'draft-js';
import { customStyleMap, customColorMap } from '@/config/constants';
import Editor from 'draft-js-plugins-editor';
import styles from './BasicEditor.less';

const BasicEditor = ({ editorState, onChange, placeholder }) => {
    const handleInlineStyle = inlineStyle => e => {
        e.preventDefault();
        onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };

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
            </div>
            <div className={styles.editor}>
                <Editor
                    customStyleMap={customStyleMap}
                    editorState={editorState}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
};

export default BasicEditor;