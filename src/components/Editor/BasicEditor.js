import React, { useState } from 'react';
import _ from 'lodash';
import { Button, Tooltip, Popover, Dropdown, Menu, Icon, Divider } from 'antd';
import { CompositeDecorator, EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import styles from './BasicEditor.less';

const BasicEditor = ({ editorState, onChange, placeholder }) => {
    return (
        <div className={styles.basicEditor}>
            <div className={styles.buttons}>

            </div>
            <Divider className={styles.divider} />
            <div className={styles.editor}>
                <Editor
                    editorState={editorState}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
};

export default BasicEditor;