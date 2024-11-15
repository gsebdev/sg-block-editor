var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from "clsx";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useEditor } from "./context";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Resizable } from "re-resizable";
import SpacingTool from "./components/SpacingTool";
const alignStyles = {
    alignSelf: {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
    },
    margin: {
        center: '0 auto',
        right: '0 0 0 auto',
        left: '0 auto 0 0',
    }
};
export const AddBlockContextMenu = ({ className, children, args }) => {
    const { addBlock, availableBlocks } = useEditor();
    return (_jsx("div", { className: clsx(className), children: _jsxs(DropdownMenu.Root, { children: [_jsx(DropdownMenu.Trigger, { asChild: true, children: children }), _jsxs(DropdownMenu.Content, { sideOffset: 0, align: "center", className: "sg-block__addMenu__content", children: [_jsx(DropdownMenu.Label, { className: "sg-block__addMenu__label", children: "Choisir un type" }), Object.values(availableBlocks).map((block) => {
                            const Icon = block.icon;
                            return (_jsxs(DropdownMenu.Item, { onClick: () => addBlock(block.type, args), className: "sg-block__addMenu__item", children: [!!Icon && _jsx(Icon, { style: { marginRight: '4px' } }), block.name] }, block.type));
                        })] })] }) }));
};
const toolbarContext = createContext([
    null,
    () => {
        throw new Error("Toolbar must be wrapped in context provider");
    }
]);
const BlockToolbarProvider = ({ children }) => {
    const [toolbar, setToolbar] = useState(null);
    return (_jsx(toolbarContext.Provider, { value: [toolbar, setToolbar], children: children }));
};
const BlockToolbarRenderer = ({ position, hasSpacingOptions, block }) => {
    const [toolbar] = useContext(toolbarContext);
    const { updateBlock } = useEditor();
    const handleChangeSpacings = useCallback((spacingsValue) => {
        updateBlock(blockID, {
            value: {
                spacings: spacingsValue
            }
        });
    }, [updateBlock, block.blockID]);
    const { value, blockID } = block;
    const { spacings } = value !== null && value !== void 0 ? value : {};
    return (_jsxs("div", { className: `sg-block__block__toolbar${position === 'top' ? ' sg-block__block__toolbar--top' : ''}`, children: [toolbar !== null && toolbar !== void 0 ? toolbar : null, hasSpacingOptions && _jsx(SpacingTool, { value: spacings, onChange: handleChangeSpacings })] }));
};
const ResizableWrapper = (_a) => {
    var _b, _c;
    var { isResizable, children } = _a, props = __rest(_a, ["isResizable", "children"]);
    return (_jsx(Resizable, { enable: props.enable || (isResizable ? undefined : false), className: props.className, maxWidth: `100%`, handleClasses: {
            right: 'sg-block__block__resizeHandle sg-block__block__resizeHandle--right',
            left: 'sg-block__block__resizeHandle sg-block__block__resizeHandle--left',
            top: 'sg-block__block__resizeHandle sg-block__block__resizeHandle--top',
            bottom: 'sg-block__block__resizeHandle sg-block__block__resizeHandle--bottom',
        }, size: {
            width: ((_b = props.size) === null || _b === void 0 ? void 0 : _b.width) || '100%',
            height: ((_c = props.size) === null || _c === void 0 ? void 0 : _c.height) || 'auto',
        }, style: props.style, onResizeStop: props.onResizeStop, onResize: props.onResize, onResizeStart: props.onResizeStart, children: children }));
};
export const BlockToolbar = ({ children }) => {
    const [, setToolbar] = useContext(toolbarContext);
    useEffect(() => {
        setToolbar(children);
        return () => {
            setToolbar(null);
        };
    }, [children]);
    return null;
};
export const BlockToolbarColumn = ({ children, title }) => {
    return (_jsxs("div", { children: [_jsx("p", { className: "sg-block__block__toolbar__column__title", children: _jsx("b", { children: title }) }), _jsx("div", { className: "sg-block__block__toolbar__column", children: children })] }));
};
const Block = ({ block, className, horizontalFlow }) => {
    var _a, _b, _c, _d, _e;
    const [toolbarPosition, setToolbarPosition] = useState('bottom');
    const { blocks, activeBlock, setActiveBlock, deleteBlock, availableBlocks, updateBlock } = useEditor();
    const blockRef = useRef(null);
    const { blockID, hasFocusWithin, parentID, type, value } = block !== null && block !== void 0 ? block : {};
    const isActive = blockID === activeBlock;
    const { isResizable, hasSpacingOptions, BlockEditorElement } = useMemo(() => {
        var _a, _b, _c;
        if (!type)
            return {};
        return {
            isResizable: ((_a = availableBlocks[type]) === null || _a === void 0 ? void 0 : _a.isResizable) || false,
            hasSpacingOptions: !!((_b = availableBlocks[type]) === null || _b === void 0 ? void 0 : _b.hasSpacingOptions),
            BlockEditorElement: (_c = availableBlocks[type]) === null || _c === void 0 ? void 0 : _c.editor
        };
    }, [availableBlocks, parentID]);
    const scrollHandler = useCallback(() => {
        var _a, _b;
        const { top, bottom } = (_b = (_a = blockRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) !== null && _b !== void 0 ? _b : {};
        if (bottom !== undefined && top !== undefined) {
            setToolbarPosition(window.innerHeight - bottom > top ? 'bottom' : 'top');
        }
    }, [blockRef, setToolbarPosition]);
    useEffect(() => {
        if (blockRef.current) {
            if (isActive) {
                scrollHandler();
                window.addEventListener('scroll', scrollHandler, true);
                blockRef.current.focus();
            }
            else {
                window.removeEventListener('scroll', scrollHandler, true);
            }
        }
        return () => window.removeEventListener('scroll', scrollHandler, true);
    }, [isActive, blockRef]);
    const handleClickCapture = useCallback((e) => {
        if (activeBlock !== blockID && !hasFocusWithin) {
            e.preventDefault();
            e.stopPropagation();
            setActiveBlock(blockID !== null && blockID !== void 0 ? blockID : null);
        }
    }, [activeBlock, hasFocusWithin, blockID, setActiveBlock]);
    if (!block)
        return null;
    if (!blockID)
        return null;
    if (!BlockEditorElement)
        return null;
    return (_jsx(BlockToolbarProvider, { children: _jsx("div", { ref: blockRef, style: {
                display: 'contents'
            }, onClickCapture: handleClickCapture, children: _jsxs(ResizableWrapper, { isResizable: !!isResizable && isActive, size: {
                    width: isResizable && (value === null || value === void 0 ? void 0 : value.width) ? value === null || value === void 0 ? void 0 : value.width : '100%',
                    height: isResizable && (value === null || value === void 0 ? void 0 : value.height) ? value === null || value === void 0 ? void 0 : value.height : 'auto',
                }, enable: isActive && typeof isResizable === 'object' ? isResizable : undefined, onResizeStop: (e, dir, ref, d) => {
                    var _a, _b;
                    const containerWidth = (_b = (_a = ref.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.clientWidth;
                    const newWidth = ref.offsetWidth;
                    const newHeight = ref.offsetHeight;
                    updateBlock(blockID, {
                        value: {
                            width: newWidth === containerWidth ? '100%' : d.width !== 0 ? newWidth + 'px' : value === null || value === void 0 ? void 0 : value.width,
                            height: d.height !== 0 ? newHeight + 'px' : value === null || value === void 0 ? void 0 : value.height,
                        }
                    });
                }, style: {
                    alignSelf: (value === null || value === void 0 ? void 0 : value.align) ? alignStyles.alignSelf[value.align] : undefined,
                    margin: (value === null || value === void 0 ? void 0 : value.align) ? alignStyles.margin[value.align] : undefined,
                    paddingTop: (_a = value === null || value === void 0 ? void 0 : value.spacings) === null || _a === void 0 ? void 0 : _a.top,
                    paddingBottom: (_b = value === null || value === void 0 ? void 0 : value.spacings) === null || _b === void 0 ? void 0 : _b.bottom,
                    paddingLeft: (_c = value === null || value === void 0 ? void 0 : value.spacings) === null || _c === void 0 ? void 0 : _c.left,
                    paddingRight: (_d = value === null || value === void 0 ? void 0 : value.spacings) === null || _d === void 0 ? void 0 : _d.right
                }, className: clsx('sg-block__block', !hasFocusWithin && !activeBlock && (!parentID || ((_e = blocks.get(parentID)) === null || _e === void 0 ? void 0 : _e.hasFocusWithin)) ? 'sg-block__block--hover' : '', isActive ? 'sg-block__block--active' : '', (!hasFocusWithin && !isActive && activeBlock) && 'sg-block__block--inactive', className), children: [isActive &&
                        _jsx(_Fragment, { children: _jsx(AddBlockContextMenu, { args: { position: 'before', reference: blockID, parentID }, className: "sg-block__contextMenu", children: _jsx("button", { title: "Ajouter un \u00E9l\u00E9ment avant le bloc actif", "aria-label": "Ajotuer un \u00E9l\u00E9ment avant le bloc actif", className: `sg-block__btn__addBlock sg-block__btn__addBlock--${horizontalFlow ? 'left' : 'top'}`, children: _jsx(FaPlus, {}) }) }) }), _jsx(BlockEditorElement, { block: block, isActive: isActive }), isActive && _jsx(BlockToolbarRenderer, { position: toolbarPosition, hasSpacingOptions: hasSpacingOptions, block: block }), isActive &&
                        _jsxs(_Fragment, { children: [_jsx("button", { className: "sg-block__btn sg-block__btn--square sg-block__btn__deleteBlock", onClick: () => deleteBlock(blockID), "aria-label": "Supprimer le block actif: " + type, title: "Supprimer le block actif: " + type, children: _jsx(RiDeleteBin5Line, {}) }), _jsx(AddBlockContextMenu, { args: { position: 'after', reference: blockID, parentID }, className: "sg-block__contextMenu", children: _jsx("button", { title: "Ajouter un \u00E9l\u00E9ment apr\u00E8s le bloc actif", "aria-label": "Ajouter un \u00E9l\u00E9ment apr\u00E8s le bloc actif", className: `sg-block__btn__addBlock sg-block__btn__addBlock--${horizontalFlow ? 'right' : 'bottom'}`, children: _jsx(FaPlus, {}) }) })] })] }) }) }));
};
export default Block;
