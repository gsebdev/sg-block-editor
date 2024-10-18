import { ChangeEvent, ComponentType, PropsWithChildren, useEffect, useRef, useState } from "react";
import { useEditor } from "../context";
import { BlockType, EditorParsedBlock } from "../definitions";
import { MdAlignHorizontalLeft, MdAlignHorizontalRight, MdAlignHorizontalCenter } from "react-icons/md";
import Button from "../components/Button";
import { BlockToolbar, BlockToolbarColumn } from "../Block";
import { FaImage } from "react-icons/fa6";

type ImageType = {
    id?: number | string;
    src: string;
}

type ImageBlockType = BlockType<{
    image?: ImageType,
    aspect?: number,
    size?: {
        height: string | number,
        width: string | number
    },
    align?: 'left' | 'right' | 'center'
}>

type ImageSelectorProps = PropsWithChildren<{
    value: ImageType,
    onSelect?: (image: ImageType, preview?: string) => void,
    className?: string
}>;

type ImageSelectorWrapperProps = PropsWithChildren<{
    ImageSelector: ComponentType<ImageSelectorProps>,
    value: ImageSelectorProps['value'],
    onSelect: ImageSelectorProps['onSelect'],
    className?: string
}>;

const DefaultImageSelector: React.FC<ImageSelectorProps> = ({ children, value, onSelect, className }) => {

    const [currentImage, setCurrentImage] = useState<ImageType>(value);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (onSelect && currentImage?.src !== value?.src) onSelect(currentImage);
    }, [currentImage])

    const handleImageclick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader(); // Create a new FileReader object

            reader.onload = function (e) {
                if (e.target?.result) {
                    const dataUrl = e.target.result.toString();
                    setCurrentImage({ src: dataUrl });
                }
            };

            reader.readAsDataURL(file);
        }
    }

    return (
        <div className={className} onClick={handleImageclick}>
            {children}
            <input type="file" hidden ref={inputRef} accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
        </div>
    )
}

const ImageSelectorWrapper: React.FC<ImageSelectorWrapperProps> = ({
    children,
    ImageSelector,
    value,
    onSelect,
    className
}) => {
    if (ImageSelector) return (
        <ImageSelector
            value={value}
            onSelect={onSelect}
            className={className}
        >
            {children}
        </ImageSelector>
    );

    return (
        <DefaultImageSelector
            value={value}
            onSelect={onSelect}
            className={className}
        >
            {children}
        </DefaultImageSelector>
    )
}


/**
 * 
 * Image Block
 * 
 * 
 */
const ImageBlock: React.FC<{ block: EditorParsedBlock<ImageBlockType>, isActive?: boolean, ImageSelector?: ComponentType<ImageSelectorProps> }> = ({ block, ImageSelector }) => {

    const [imagePreview, setImagePreview] = useState<string>(block.value?.image?.src);

    const { updateBlock } = useEditor();

    const { blockID, value } = block;

    const { image, aspect, height, align } = value ?? {};

    const updateImageBlock = (newValue: Partial<ImageBlockType['value']>) => {
        updateBlock(blockID, {
            value: {
                ...value,
                ...newValue
            }
        })
    };

    const handleImageSelection = (newValue, imagePreviewSrc = undefined) => {
        updateImageBlock({
            image: {
                id: newValue.id,
                src: newValue.src
            }
        });
        setImagePreview(imagePreviewSrc ?? newValue.src);
    }

    useEffect(() => {
        if (aspect && height !== 'auto') {
            updateImageBlock({
                aspect: undefined,
            })
        }
    }, [height])

    const aspects = [4 / 3, 3 / 2, 16 / 9, 1];
    const aspectsLabels = ['4:3', '3:2', '16:9', '1:1'];

    const aligns = ['left', 'center', 'right'];
    const alignsIcons = [
        <MdAlignHorizontalLeft key={"alignLeft"} />,
        <MdAlignHorizontalCenter key={"alignCenter"} />,
        <MdAlignHorizontalRight key={"alignRight"} />
    ];


    return (
        <>
            <BlockToolbar>
                <BlockToolbarColumn>
                    {
                        aspects.map((value, index) => (
                            <Button
                                key={value}
                                variant={aspect === value && 'selected'}
                                onClick={() => updateImageBlock({
                                    aspect: aspect === value ? undefined : value,
                                    height: 'auto'
                                })}
                            >
                                {aspectsLabels[index]}
                            </Button>
                        ))
                    }
                </BlockToolbarColumn>
                <BlockToolbarColumn>
                    {
                        aligns.map((value: 'left' | 'right' | 'center', index) => (
                            <Button
                                key={value}
                                variant={align === value ? 'selected' : ""}
                                onClick={() => updateImageBlock({ align: align === value ? undefined : value })}
                            >
                                {alignsIcons[index]}
                            </Button>
                        ))
                    }
                </BlockToolbarColumn>
            </BlockToolbar>
            <ImageSelectorWrapper
                className="sg-block__blockImage__selectorWrapper"
                value={image}
                onSelect={handleImageSelection}
                ImageSelector={ImageSelector}
            >

                {imagePreview ?
                    <img
                        className="sg-block__blockImage__img"
                        src={imagePreview}
                        style={{
                            aspectRatio: aspect,
                            textAlign: align
                        }}
                        alt="Selected Image"
                    /> :
                    <div className="sg-block__blockImage__placeholder">
                        <FaImage />
                    </div>
                }
            </ImageSelectorWrapper>
        </>

    )

}

export default ImageBlock;