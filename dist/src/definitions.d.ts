export interface BlocksEditorProps {
    data?: BlockType[] | null;
    onChange?: (data: BlockType[]) => void;
}
export interface EditorProviderProps {
    children: React.ReactNode;
    data?: BlockType[] | null;
    onChange?: (data: BlockType[]) => void;
}
export type EditorParsedBlock = Omit<BlockType, 'children'> & {
    blockID: string;
    parentID?: string;
    children?: string[];
    hasFocusWithin?: boolean;
};
export type BlockType = {
    type: "group" | "text" | "image" | "space";
    value?: string | number | {
        [key: string]: any;
    };
    children?: BlockType[];
};
export type EditorRefObject = {
    getRenderedValue: () => BlockType[];
};
