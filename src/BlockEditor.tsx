import { forwardRef, useCallback, useEffect, useRef } from "react";
import { BlocksEditorContextProvider, useEditor } from "./context";
import { BlocksEditorProps, EditorRefObject } from "./definitions";
import defaultBlocks from "./default-blocks";
import { FaPlus } from "react-icons/fa6";
import Block, { AddBlockContextMenu } from "./Block";
import clsx from "clsx";

const BlockEditorContent: React.FC = () => {

    const { blocks, setActiveBlock } = useEditor();
    const editorRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
                setActiveBlock(null);
        }
    }, [setActiveBlock]);

    useEffect(() => {
        document.body.addEventListener('click', handleClickOutside);
        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, [handleClickOutside]);


    return (
        <div ref={editorRef} className={clsx(
            "sg-block__editor__content",
            blocks.size === 0 ? "sg-block__editor__content--empty" : ""
        )}>
            <div>
                {!!blocks &&
                    Array.from(blocks.values()).filter(block => !block.parentID).map(block => (
                        <Block key={block.blockID} block={block} />
                    ))
                }
                {blocks.size === 0 &&
                    <AddBlockContextMenu>
                        <button className="sg-block__btn"><FaPlus style={{ marginRight: 4 }} />Ajouter du contenu</button>
                    </AddBlockContextMenu>
                }
            </div>

        </div>
    )
}

export default forwardRef<EditorRefObject, BlocksEditorProps>(function BlocksEditor({ data, onChange, extraBlocks }, ref) {
    const blocks = {
        ...defaultBlocks,
        ...extraBlocks
    };

    return (
        <BlocksEditorContextProvider data={data} onChange={onChange} ref={ref} availableBlocks={blocks}>
            <BlockEditorContent />
        </BlocksEditorContextProvider>
    )
});