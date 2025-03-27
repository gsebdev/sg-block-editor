import React from "react";
import clsx from "clsx";
import { useCallback} from "react";
import { BlockType, EditorParsedBlock } from "../definitions";
import { useEditor } from "../context";

type HtmlBlockType = BlockType<{
    htmlContent: string;
}>

const HtmlBlock: React.FC<{ block: EditorParsedBlock<HtmlBlockType>, isActive?: boolean }> = ({ block, isActive }) => {

    const { updateBlock } = useEditor();

    const { blockID, value } = block;

    const handleChange = useCallback((value: string) => {
        updateBlock(blockID, {
            value: {
                htmlContent: value
            }
        })
    }, [blockID, updateBlock]);

    return (
        <div className={clsx(
            "sg-block__blockHtml",
            isActive && "sg-block__blockHtml--active"
        )}>
            
            <textarea
                onChange={(e) => handleChange(e.target.value)}
                value={value?.htmlContent}
                className="sg-block__blockHtmlTextarea"
                rows={10}
            />
        </div>
    );
}

export default HtmlBlock;