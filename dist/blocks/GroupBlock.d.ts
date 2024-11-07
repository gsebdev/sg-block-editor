import React from "react";
import { BlockType, EditorParsedBlock } from "../definitions";
type GroupBlockType = BlockType<{
    flow: 'horizontal' | 'vertical';
}>;
export interface RowBlockProps {
    block: EditorParsedBlock<GroupBlockType>;
    isActive?: boolean;
}
declare const RowBlock: React.FC<RowBlockProps>;
export default RowBlock;
