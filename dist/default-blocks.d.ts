declare const _default: {
    text: {
        name: string;
        type: string;
        icon: import("react-icons").IconType;
        render: undefined;
        editor: import("react").FC<{
            block: import("./definitions").EditorParsedBlock<{
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
                children?: import("./definitions").BlockType<Record<string, string | number | object>>[];
            }>;
            isActive?: boolean;
        }>;
        defaultValue: {
            htmlContent: string;
        };
        isResizable: boolean;
        hasSpacingOptions: boolean;
    };
    image: {
        name: string;
        type: string;
        icon: import("react-icons").IconType;
        render: undefined;
        editor: import("react").FC<{
            block: import("./definitions").EditorParsedBlock<{
                type: string;
                value?: ({
                    image?: {
                        id?: number | string;
                        src: string;
                    };
                    aspect?: number;
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
                children?: import("./definitions").BlockType<Record<string, string | number | object>>[];
            }>;
            isActive?: boolean;
            ImageSelector?: import("react").ComponentType<{
                value: {
                    id?: number | string;
                    src: string;
                };
                onSelect?: (image: {
                    id?: number | string;
                    src: string;
                }, preview?: string) => void;
                className?: string;
            } & {
                children?: import("react").ReactNode | undefined;
            }>;
        }>;
        isResizable: boolean;
        hasSpacingOptions: boolean;
    };
    group: {
        name: string;
        type: string;
        icon: import("react-icons").IconType;
        render: undefined;
        editor: import("react").FC<import("./blocks/GroupBlock").RowBlockProps>;
        acceptChildren: boolean;
        autoChildrenSizing: boolean;
        isResizable: boolean;
        defaultValue: {
            flow: string;
            height: string;
        };
        hasSpacingOptions: boolean;
    };
};
export default _default;
