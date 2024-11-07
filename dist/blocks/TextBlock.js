import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";
import { useEditor } from "../context";
import TextIgniter from "../lib/rich-text-module/component/src/components/TextIgniter";
const TextBlock = ({ block, isActive }) => {
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
        var _a, _b;
        if (((_b = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editorRef) === null || _b === void 0 ? void 0 : _b.current) && isActive) {
            editorRef.current.editorRef.current.focus();
        }
    }, [isActive]);
    const handleChange = useCallback((val) => {
        updateBlock(blockID, {
            value: {
                htmlContent: val
            }
        });
    }, [blockID, updateBlock]);
    return (_jsx(_Fragment, { children: _jsx("div", { className: clsx("sg-block__blockText", isActive && "sg-block__blockText--active"), children: _jsx(TextIgniter, { ref: editorRef, onChange: handleChange, defaultContent: htmlContent, features: features, height: "100%" }) }) }));
};
export default TextBlock;
