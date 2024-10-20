import React, { PropsWithChildren } from "react";
import { addBlockMenuProps, EditorParsedBlock } from "./definitions";
export declare const AddBlockContextMenu: React.FC<addBlockMenuProps>;
export declare const BlockToolbar: React.FC<PropsWithChildren>;
export declare const BlockToolbarColumn: React.FC<PropsWithChildren>;
declare const Block: React.FC<{
    block: EditorParsedBlock | undefined;
    className?: string;
    horizontalFlow?: boolean;
    isResizable?: boolean;
}>;
export default Block;
