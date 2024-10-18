declare const _default: {
    text: {
        name: string;
        type: string;
        icon: import("react-icons").IconType;
        render: any;
        editor: import("react").FC<{
            block: import("./definitions").EditorParsedBlock<{
                type: string;
                value?: {
                    htmlContent: string;
                } & {
                    width?: number | string;
                    height?: number | string;
                };
                children?: import("./definitions").BlockType<any>[];
            }>;
            isActive?: boolean;
        }>;
        defaultValue: {
            htmlContent: string;
        };
    };
    image: {
        name: string;
        type: string;
        icon: import("react-icons").IconType;
        render: any;
        editor: import("react").FC<{
            block: import("./definitions").EditorParsedBlock<{
                type: string;
                value?: {
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
                };
                children?: import("./definitions").BlockType<any>[];
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
    };
    group: {
        name: string;
        type: string;
        icon: import("react-icons").IconType;
        render: any;
        editor: import("react").FC<{
            block: import("./definitions").EditorParsedBlock<{
                type: string;
                value?: {
                    flow: "horizontal" | "vertical";
                } & {
                    width?: number | string;
                    height?: number | string;
                };
                children?: import("./definitions").BlockType<any>[];
            }>;
            isActive?: boolean;
        }>;
        acceptChildren: boolean;
        autoChildrenSizing: boolean;
    };
    space: {
        name: string;
        type: string;
        icon: import("react-icons").IconType;
        render: any;
        editor: any;
    };
};
export default _default;
