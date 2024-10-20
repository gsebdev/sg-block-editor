import { ComponentType, PropsWithChildren } from "react";
import { BlockType, EditorParsedBlock } from "../definitions";
type ImageType = {
    id?: number | string;
    src: string;
};
type ImageBlockType = BlockType<{
    image?: ImageType;
    aspect?: number;
    size?: {
        height: string | number;
        width: string | number;
    };
    align?: 'left' | 'right' | 'center';
}>;
type ImageSelectorProps = PropsWithChildren<{
    value: ImageType;
    onSelect?: (image: ImageType, preview?: string) => void;
    className?: string;
}>;
/**
 *
 * Image Block
 *
 *
 */
declare const ImageBlock: React.FC<{
    block: EditorParsedBlock<ImageBlockType>;
    isActive?: boolean;
    ImageSelector?: ComponentType<ImageSelectorProps>;
}>;
export default ImageBlock;
