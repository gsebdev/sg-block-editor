import clsx from "clsx";
import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import 'quill/dist/quill.snow.css';
import { BlockType, EditorParsedBlock } from "../definitions";
import { useEditor } from "../context";

type TextBlockType = BlockType<{
    htmlContent: string;
}>

const TextBlock: React.FC<{ block: EditorParsedBlock<TextBlockType>, isActive?: boolean }> = ({ block, isActive }) => {

    const { updateBlock } = useEditor();

    const { blockID, value } = block;

    const { htmlContent } = value;

    const { quill, quillRef } = useQuill({
        theme: 'snow',
        modules: {
            toolbar: [
                [{ header: [2, 3, 4, false] }],
                ["bold", "italic", "underline"],
                [
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                ],
                ["link"],
                [{ align: [] }],
                ["clean"],
            ],
        },
        formats: ['header', 'bold', 'italic', 'underline', 'link', 'align', 'list', 'indent'],
    });

    useEffect(() => {
        if (quill) {
            if (htmlContent !== quill.root.innerHTML && typeof htmlContent === 'string') quill.clipboard.dangerouslyPasteHTML(htmlContent);
            quill.on(
                'text-change',
                () => {
                    if (htmlContent !== quill.root.innerHTML) {
                        updateBlock(blockID, {
                            value: {
                                htmlContent: quill.root.innerHTML
                            }
                        })
                    }
                }
            )

        }
        return () => {
            if (quill) quill.off('text-change');
        };
    }, [quill, htmlContent, updateBlock, blockID]);


    return (
        <div className={clsx(
            "sg-block__blockText",
            isActive && "sg-block__blockText--active"
        )}>
            <div ref={quillRef} />
        </div>);
}

export default TextBlock;