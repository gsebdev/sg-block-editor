import 'quill/dist/quill.snow.css';
import { BlockType, EditorParsedBlock } from "../definitions";
type TextBlockType = BlockType<{
    htmlContent: string;
}>;
declare const TextBlock: React.FC<{
    block: EditorParsedBlock<TextBlockType>;
    isActive?: boolean;
}>;
export default TextBlock;
