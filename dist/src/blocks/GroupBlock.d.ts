import { BlockType, EditorParsedBlock } from "../definitions";
type GroupBlockType = BlockType<{
    flow: 'horizontal' | 'vertical';
}>;
declare const RowBlock: React.FC<{
    block: EditorParsedBlock<GroupBlockType>;
    isActive?: boolean;
}>;
export default RowBlock;
