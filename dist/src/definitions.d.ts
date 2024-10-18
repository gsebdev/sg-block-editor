import { ComponentType, ReactElement } from "react";
import { IconType } from "react-icons";
export interface BlocksEditorProps {
    data?: BlockType[] | null;
    onChange?: (data: BlockType[]) => void;
    extraBlocks?: Record<string, EditorBlock>;
}
type EditorBlockComponentProps = {
    block: EditorParsedBlock;
    isActive?: boolean;
};
export type EditorBlock = {
    name: string;
    type: string;
    icon?: IconType | ComponentType;
    render?: ComponentType;
    editor?: ComponentType<EditorBlockComponentProps>;
    defaultValue?: BlockType<any>['value'];
    acceptChildren?: boolean;
};
export interface EditorProviderProps {
    children: React.ReactNode;
    data?: BlockType[] | null;
    onChange?: (data: BlockType[]) => void;
    availableBlocks: Record<string, EditorBlock>;
}
export type EditorParsedBlock<T extends BlockType = BlockType<any>> = Omit<T, 'children'> & {
    blockID: string;
    parentID?: string;
    children?: string[];
    hasFocusWithin?: boolean;
};
export type BlockType<V = {}> = {
    type: string;
    value?: V & {
        width?: number | string;
        height?: number | string;
    };
    children?: BlockType<any>[];
};
export type EditorRefObject = {
    getRenderedValue: () => BlockType[];
};
export type addBlockMenuProps = {
    className?: string;
    args?: {
        parentID?: string;
        position?: 'after' | 'before';
        reference?: string;
    };
    children: ReactElement;
};
export {};
