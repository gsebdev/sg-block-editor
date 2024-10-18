import { Dispatch } from "react";
import { BlockType, EditorParsedBlock } from "./definitions";
import { SetStateAction } from "react";
export declare const useEditor: () => {
    blocks: Map<string, EditorParsedBlock>;
    setBlocks: Dispatch<SetStateAction<Map<string, EditorParsedBlock>>>;
    addBlock: (type: BlockType["type"], args?: {
        parentID?: string;
        position?: "after" | "before";
        reference?: string;
    }) => void;
    updateBlock: (blockID: string, value: Partial<EditorParsedBlock>, shouldNotDirty?: boolean) => void;
    deleteBlock: (blockID: string) => void;
    isDirty: boolean;
    setIsDirty: Dispatch<SetStateAction<boolean>>;
    activeBlock: string | null;
    setActiveBlock: Dispatch<SetStateAction<string | null>>;
};
