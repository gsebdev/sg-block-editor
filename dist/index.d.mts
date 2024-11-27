import * as react from 'react';
import react__default, { ComponentType, ReactElement, Dispatch, SetStateAction, PropsWithChildren } from 'react';
import { Enable } from 're-resizable';
import * as react_icons from 'react-icons';
import { IconType } from 'react-icons';

interface BlocksEditorProps {
    data?: BlockType[] | null;
    onChange?: (data: BlockType[]) => void;
    extraBlocks?: Record<string, EditorBlock>;
}
type EditorBlockComponentProps = {
    block: EditorParsedBlock;
    isActive?: boolean;
};
type EditorBlock = {
    name: string;
    type: string;
    icon?: IconType | ComponentType;
    render?: (value: BlockType<BlockValueGeneric>['value']) => string;
    editor?: ComponentType<EditorBlockComponentProps>;
    defaultValue?: BlockType<BlockValueGeneric>['value'];
    acceptChildren?: boolean;
    isResizable?: boolean | Enable;
    hasSpacingOptions?: boolean;
};
interface EditorProviderProps {
    children: React.ReactNode;
    data?: BlockType[] | null;
    onChange?: (data: BlockType[]) => void;
    availableBlocks: {
        [key: symbol]: EditorBlock;
    };
}
type EditorParsedBlock<T extends BlockType = BlockType<BlockValueGeneric>> = Omit<T, 'children'> & {
    blockID: string;
    parentID?: string;
    children?: string[];
    hasFocusWithin?: boolean;
    isActive?: boolean;
};
type BlockValueGeneric = Record<symbol | string, string | number | object | undefined>;
type BlockType<V = BlockValueGeneric> = {
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
    children?: BlockType<BlockValueGeneric>[];
};
type EditorRefObject = {
    getJSONValue: () => BlockType[];
    getHTMLValue: () => string;
};
type addBlockMenuProps = {
    className?: string;
    args?: {
        parentID?: string;
        position?: 'after' | 'before';
        reference?: string;
    };
    children: ReactElement;
};

type definitions_BlockType<V = BlockValueGeneric> = BlockType<V>;
type definitions_BlocksEditorProps = BlocksEditorProps;
type definitions_EditorBlock = EditorBlock;
type definitions_EditorParsedBlock<T extends BlockType = BlockType<BlockValueGeneric>> = EditorParsedBlock<T>;
type definitions_EditorProviderProps = EditorProviderProps;
type definitions_EditorRefObject = EditorRefObject;
type definitions_addBlockMenuProps = addBlockMenuProps;
declare namespace definitions {
  export type { definitions_BlockType as BlockType, definitions_BlocksEditorProps as BlocksEditorProps, definitions_EditorBlock as EditorBlock, definitions_EditorParsedBlock as EditorParsedBlock, definitions_EditorProviderProps as EditorProviderProps, definitions_EditorRefObject as EditorRefObject, definitions_addBlockMenuProps as addBlockMenuProps };
}

declare const _default$1: react.ForwardRefExoticComponent<BlocksEditorProps & react.RefAttributes<EditorRefObject>>;

declare const useEditor: () => {
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
    availableBlocks: {
        [key: string]: EditorBlock;
    };
};

type GroupBlockType = BlockType<{
    flow: 'horizontal' | 'vertical';
    template?: number[];
}>;
interface RowBlockProps {
    block: EditorParsedBlock<GroupBlockType>;
    isActive?: boolean;
}
declare const RowBlock: react__default.FC<RowBlockProps>;

type ImageType = {
    id?: number | string;
    src: string;
};
type ImageBlockType = BlockType<{
    image?: ImageType;
    aspect?: number | string;
    size?: {
        height: string | number;
        width: string | number;
    };
    align?: 'left' | 'right' | 'center';
}>;
type ImageSelectorProps = PropsWithChildren<{
    value?: ImageType;
    onSelect?: (image?: ImageType, preview?: string) => void;
    className?: string;
}>;
declare const ImageBlock: react__default.FC<{
    block: EditorParsedBlock<ImageBlockType>;
    isActive?: boolean;
    ImageSelector?: ComponentType<ImageSelectorProps>;
}>;

type TextBlockType = BlockType<{
    htmlContent: string;
}>;
declare const TextBlock: react__default.FC<{
    block: EditorParsedBlock<TextBlockType>;
    isActive?: boolean;
}>;

declare const _default: {
    text: {
        name: string;
        type: string;
        icon: react_icons.IconType;
        render: undefined;
        editor: react.FC<{
            block: EditorParsedBlock<{
                type: string;
                value?: ({
                    htmlContent: string;
                } & {
                    width?: number | string;
                    height?: number | string;
                    spacings?: {
                        top?: string;
                        right?: string;
                        bottom?: string;
                        left?: string;
                    };
                }) | undefined;
                children?: BlockType<{
                    [x: string]: string | number | object | undefined;
                    [x: symbol]: string | number | object | undefined;
                }>[];
            }>;
            isActive?: boolean;
        }>;
        defaultValue: {
            htmlContent: string;
        };
        isResizable: {
            right: boolean;
            left: boolean;
            top: boolean;
            bottom: boolean;
            bottomLeft: boolean;
            bottomRight: boolean;
            topLeft: boolean;
            topRight: boolean;
        };
        hasSpacingOptions: boolean;
    };
    image: {
        name: string;
        type: string;
        icon: react_icons.IconType;
        render: undefined;
        editor: react.FC<{
            block: EditorParsedBlock<{
                type: string;
                value?: ({
                    image?: {
                        id?: number | string;
                        src: string;
                    };
                    aspect?: number | string;
                    size?: {
                        height: string | number;
                        width: string | number;
                    };
                    align?: "left" | "right" | "center";
                } & {
                    width?: number | string;
                    height?: number | string;
                    spacings?: {
                        top?: string;
                        right?: string;
                        bottom?: string;
                        left?: string;
                    };
                }) | undefined;
                children?: BlockType<{
                    [x: string]: string | number | object | undefined;
                    [x: symbol]: string | number | object | undefined;
                }>[];
            }>;
            isActive?: boolean;
            ImageSelector?: react.ComponentType<ImageSelectorProps>;
        }>;
        isResizable: boolean;
        hasSpacingOptions: boolean;
    };
    group: {
        name: string;
        type: string;
        icon: react_icons.IconType;
        render: undefined;
        editor: react.FC<RowBlockProps>;
        acceptChildren: boolean;
        isResizable: boolean;
        defaultValue: {
            flow: string;
        };
        hasSpacingOptions: boolean;
    };
};

export { _default$1 as BlockEditor, definitions as Definitions, ImageBlock, RowBlock, TextBlock, _default as defaultBlocks, useEditor };
