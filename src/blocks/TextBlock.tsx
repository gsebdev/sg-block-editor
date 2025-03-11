import React, { useMemo } from "react";
import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";
import { BlockType, EditorParsedBlock } from "../definitions";
import { useEditor } from "../context";
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ContentState, convertToRaw, EditorState } from "draft-js";

type TextBlockType = BlockType<{
    htmlContent: string;
}>

const TextBlock: React.FC<{ block: EditorParsedBlock<TextBlockType>, isActive?: boolean, toolbarOptions?: object }> = ({ block, isActive, toolbarOptions = textBlockToolbarOptions }) => {

    const { updateBlock } = useEditor();

    const { blockID, value } = block;

    const editorRef = useRef<Editor|null>(null);
    const initialEditorState = useMemo(() => {
        const html = '<p>Nouveau bloc de <strong>Texte</strong> 😀</p>';
        const contentBlock = htmlToDraft(value?.htmlContent ?? html);
        return convertToRaw(ContentState.createFromBlockArray(contentBlock.contentBlocks))
    }, []);

    useEffect(() => {
        if(editorRef.current && isActive) {
            editorRef.current.focusEditor();        
        }
    }, [isActive]);

    const handleChange = useCallback((state: EditorState) => {
        updateBlock(blockID, {
            value: {
                htmlContent: draftToHtml(convertToRaw(state.getCurrentContent()))
            }
        })
    }, [blockID, updateBlock]);

    return (
        <>
            <div className={clsx(
                "sg-block__blockText",
                isActive && "sg-block__blockText--active"
            )}>
                
                <Editor
                    ref={editorRef}
                    onEditorStateChange={handleChange}
                    initialContentState={initialEditorState}
                    toolbarOnFocus
                    wrapperClassName="sg-text__editor-container"
                    toolbarClassName="sg-text__toolbar"
                    toolbar={toolbarOptions}
                />
            </div>
        </>
    );
}

export const textBlockToolbarOptions = {
    options: [
        "inline",
        "blockType",
        "fontSize",
        "list",
        "textAlign",
        "colorPicker",
        "link",
        "emoji",
        "history"
      ],
    inline: {
        inDropdown: false,
        options: ['bold', 'italic', 'underline']
    },
    list: { 
        inDropdown: false,
        options: ["unordered", "ordered"],
        title: 'Liste'
    },
    textAlign: { 
        inDropdown: true,
        options: ["left", "center", "right"],
        title: 'Alignement'
    },
    link: { inDropdown: false },
    history: { inDropdown: false },
    embedded: {},
    fontFamily: {},
    fontSize: {
        options: [
            "14px",
            "16px",
            "18px",
            "20px"
        ],
        title: "Taille de police"
    },
    blockType: {
        options: [
            "Normal",
            "H1",
            "H2",
            "H3",
            "H4",
            "Blockquote"
          ],
          title: "Format"
    }
}

export default TextBlock;