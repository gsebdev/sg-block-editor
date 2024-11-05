import { forwardRef, useCallback, useEffect, useRef } from "react";
import { BlocksEditorContextProvider, useEditor } from "./context";
import { BlocksEditorProps, EditorRefObject } from "./definitions";
import defaultBlocks from "./default-blocks";
import { FaPlus } from "react-icons/fa6";
import Block, { AddBlockContextMenu } from "./Block";
import clsx from "clsx";

const BlockEditorContent: React.FC = () => {

    const { blocks, setActiveBlock, availableBlocks } = useEditor();
    const editorRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (editorRef.current) {
            const rect = editorRef.current.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            const margin = 100;

            if (
                !(
                    x >= rect.left - margin &&
                    x <= rect.right + margin &&
                    y >= rect.top - margin &&
                    y <= rect.bottom + margin
                )
            ) {
                setActiveBlock(null);
            }
        }
    }, [setActiveBlock]);

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
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