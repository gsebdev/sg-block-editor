import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import { BlocksEditorContextProvider, useEditor } from "./context";
import defaultBlocks from "./default-blocks";
import { FaPlus } from "react-icons/fa6";
import Block, { AddBlockContextMenu } from "./Block";
import clsx from "clsx";
const BlockEditorContent = () => {
    const { blocks, setActiveBlock } = useEditor();
    const editorRef = useRef(null);
    const handleClickOutside = useCallback((e) => {
        if (editorRef.current && !editorRef.current.contains(e.target)) {
            setActiveBlock(null);
        }
    }, [setActiveBlock]);
    useEffect(() => {
        document.body.addEventListener('click', handleClickOutside);
        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, [handleClickOutside]);
    return (_jsx("div", { ref: editorRef, className: clsx("sg-block__editor__content", blocks.size === 0 ? "sg-block__editor__content--empty" : ""), children: _jsxs("div", { children: [!!blocks &&
                    Array.from(blocks.values()).filter(block => !block.parentID).map(block => (_jsx(Block, { block: block }, block.blockID))), blocks.size === 0 &&
                    _jsx(AddBlockContextMenu, { children: _jsxs("button", { className: "sg-block__btn", children: [_jsx(FaPlus, { style: { marginRight: 4 } }), "Ajouter du contenu"] }) })] }) }));
};
export default forwardRef(function BlocksEditor({ data, onChange, extraBlocks }, ref) {
    const blocks = Object.assign(Object.assign({}, defaultBlocks), extraBlocks);
    return (_jsx(BlocksEditorContextProvider, { data: data, onChange: onChange, ref: ref, availableBlocks: blocks, children: _jsx(BlockEditorContent, {}) }));
});
