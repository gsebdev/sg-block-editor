import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";
import { BlockType, EditorParsedBlock } from "../definitions";
import { useEditor } from "../context";
import TextIgniter from "../lib/rich-text-module/component/src/components/TextIgniter";

type TextBlockType = BlockType<{
    htmlContent: string;
}>

const TextBlock: React.FC<{ block: EditorParsedBlock<TextBlockType>, isActive?: boolean }> = ({ block, isActive }) => {

    // define text editor features
    const features = [
        "heading",
        "bold",
        "italic",
        "underline",
        "unorderedList",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "createLink",
    ];

    const { updateBlock } = useEditor();

    const { blockID, value } = block;

    const { htmlContent } = value;

    const editorRef = useRef(null);

    useEffect(() => {
        if(editorRef.current?.editorRef?.current && isActive) {
            editorRef.current.editorRef.current.focus();        
        }
    }, [isActive])

    const handleChange = useCallback((val: string) => {
        updateBlock(blockID, {
            value: {
                htmlContent: val
            }
        })
    }, [blockID, updateBlock]);

    return (
        <>
            <div className={clsx(
                "sg-block__blockText",
                isActive && "sg-block__blockText--active"
            )}>
                <TextIgniter
                    ref={editorRef}
                    onChange={handleChange}
                    defaultContent={htmlContent}
                    features={features}
                    height={"100%"}
                />
            </div>
        </>
    );
}

export default TextBlock;