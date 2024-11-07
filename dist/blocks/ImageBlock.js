import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useEditor } from "../context";
import { MdAlignHorizontalLeft, MdAlignHorizontalRight, MdAlignHorizontalCenter } from "react-icons/md";
import Button from "../components/Button";
import { BlockToolbar, BlockToolbarColumn } from "../Block";
import { FaImage } from "react-icons/fa6";
const DefaultImageSelector = ({ children, value, onSelect, className }) => {
    const [currentImage, setCurrentImage] = useState(value);
    const inputRef = useRef(null);
    useEffect(() => {
        if (onSelect && (currentImage === null || currentImage === void 0 ? void 0 : currentImage.src) !== (value === null || value === void 0 ? void 0 : value.src))
            onSelect(currentImage);
    }, [currentImage]);
    const handleImageclick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) {
                    const dataUrl = e.target.result.toString();
                    setCurrentImage({ src: dataUrl });
                }
            };
            reader.readAsDataURL(file);
        }
    };
    return (_jsxs("div", { className: className, onClick: handleImageclick, children: [children, _jsx("input", { type: "file", hidden: true, ref: inputRef, accept: ".jpg, .jpeg, .png", onChange: handleFileChange })] }));
};
const ImageSelectorWrapper = ({ children, ImageSelector, value, onSelect, className }) => {
    if (ImageSelector)
        return (_jsx(ImageSelector, { value: value, onSelect: onSelect, className: className, children: children }));
    return (_jsx(DefaultImageSelector, { value: value, onSelect: onSelect, className: className, children: children }));
};
const ImagePreview = ({ src, aspect, align }) => {
    return (_jsx(_Fragment, { children: src ?
            _jsx("img", { className: "sg-block__blockImage__img", src: src, style: {
                    aspectRatio: aspect,
                    textAlign: align
                }, alt: "Selected Image" }) :
            _jsx("div", { className: "sg-block__blockImage__placeholder", children: _jsx(FaImage, {}) }) }));
};
const ImageBlock = ({ block, ImageSelector }) => {
    var _a, _b;
    const [imagePreview, setImagePreview] = useState((_b = (_a = block.value) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.src);
    const { updateBlock } = useEditor();
    const { blockID, value } = block;
    const { image, aspect, height, align } = value !== null && value !== void 0 ? value : {};
    const updateImageBlock = (newValue) => {
        updateBlock(blockID, {
            value: Object.assign(Object.assign({}, value), newValue)
        });
    };
    const handleImageSelection = (newValue, imagePreviewSrc = undefined) => {
        updateImageBlock({
            image: {
                id: newValue.id,
                src: newValue.src
            }
        });
        setImagePreview(imagePreviewSrc !== null && imagePreviewSrc !== void 0 ? imagePreviewSrc : newValue.src);
    };
    useEffect(() => {
        if (aspect && height !== 'auto') {
            updateImageBlock({
                aspect: undefined,
            });
        }
    }, [height]);
    const aspects = [4 / 3, 3 / 2, 16 / 9, 1];
    const aspectsLabels = ['4:3', '3:2', '16:9', '1:1'];
    const aligns = ['left', 'center', 'right'];
    const alignsIcons = [
        _jsx(MdAlignHorizontalLeft, {}, "alignLeft"),
        _jsx(MdAlignHorizontalCenter, {}, "alignCenter"),
        _jsx(MdAlignHorizontalRight, {}, "alignRight")
    ];
    return (_jsxs(_Fragment, { children: [_jsxs(BlockToolbar, { children: [_jsx(BlockToolbarColumn, { children: aspects.map((value, index) => (_jsx(Button, { variant: aspect === value && 'selected', onClick: () => updateImageBlock({
                                aspect: aspect === value ? undefined : value,
                                height: 'auto'
                            }), children: aspectsLabels[index] }, value))) }), _jsx(BlockToolbarColumn, { children: aligns.map((value, index) => (_jsx(Button, { variant: align === value ? 'selected' : "", onClick: () => updateImageBlock({ align: align === value ? undefined : value }), children: alignsIcons[index] }, value))) })] }), _jsx(ImageSelectorWrapper, { className: "sg-block__blockImage__selectorWrapper", value: image, onSelect: handleImageSelection, ImageSelector: ImageSelector, children: _jsx(ImagePreview, { src: imagePreview, align: align, aspect: aspect }) })] }));
};
export default ImageBlock;
