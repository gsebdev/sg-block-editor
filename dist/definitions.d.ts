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
    defaultValue?: BlockType<Record<string, string | number | object>>['value'];
    acceptChildren?: boolean;
    autoChildrenSizing?: boolean;
    isResizable?: boolean;
    hasSpacingOptions?: boolean;
};
export interface EditorProviderProps {
    children: React.ReactNode;
    data?: BlockType[] | null;
    onChange?: (data: BlockType[]) => void;
    availableBlocks: Record<string, EditorBlock>;
}
export type EditorParsedBlock<T extends BlockType = BlockType<Record<string, string | number | object>>> = Omit<T, 'children'> & {
    blockID: string;
    parentID?: string;
    children?: string[];
    hasFocusWithin?: boolean;
    isActive?: boolean;
};
export type BlockType<V = Record<string, string | number | object>> = {
    type: string;
    value?: V & {
        width?: number | string;
        height?: number | string;
        spacings?: {
            top?: string;
            right?: string;
            bottom?: string;
            left?: string;
        };
    };
    children?: BlockType<Record<string, string | number | object>>[];
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
