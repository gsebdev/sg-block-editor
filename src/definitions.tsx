import { Enable } from "re-resizable"
import { ComponentType, ReactElement } from "react"
import { IconType } from "react-icons"

export interface BlocksEditorProps {
    data?: BlockType[] | null,
    onChange?: (data: BlockType[]) => void,
    extraBlocks?: Record<string, EditorBlock>
}

type EditorBlockComponentProps = {
    block: EditorParsedBlock,
    isActive?: boolean
}

export type EditorBlock = {
    name: string,
    type: string,
    icon?: IconType|ComponentType,
    render?: (value: BlockType<BlockValueGeneric>['value']) => Promise<string>|string,
    editor?: ComponentType<EditorBlockComponentProps>,
    defaultValue?: BlockType<BlockValueGeneric>['value'],
    acceptChildren?: boolean,
    isResizable?: boolean | Enable,
    hasSpacingOptions?: boolean
}

export interface EditorProviderProps {
    children: React.ReactNode,
    data?: BlockType[] | null,
    onChange?: (data: BlockType[]) => void,
    availableBlocks: { [key: string|symbol]: EditorBlock }
}

export type EditorParsedBlock<T extends BlockType = BlockType<BlockValueGeneric>> = Omit<T, 'children'> & {
    blockID: string,
    parentID?: string,
    children?: string[],
    hasFocusWithin?: boolean,
    isActive?: boolean,
}
 
type BlockValueGeneric = Record<symbol|string, string|number|object|undefined>;

export type BlockType<V = BlockValueGeneric> = {
    type: string;
    value?: V & { 
        width?: number|string,
        height?: number|string,
        spacings?: {
            top?: string,
            right?: string,
            bottom?: string,
            left?: string
        }
    };
    children?: BlockType<BlockValueGeneric>[];
};

export type EditorRefObject = {
    JSONValue: BlockType<BlockValueGeneric>[],
    HTMLValue: string,
    getJSONValue(): BlockType[];
    getHTMLValue(): string;
}

export type addBlockMenuProps = { 
    className?: string, 
    args?: { parentID?: string, position?: 'after' | 'before', reference?: string }, 
    children: ReactElement 
}