import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Block, { AddBlockContextMenu, BlockToolbar, BlockToolbarColumn } from "../Block";
import { BsArrowsExpand, BsArrowsExpandVertical } from "react-icons/bs";
import { useEditor } from "../context";
import Button from "../components/Button";
import { MdCenterFocusStrong } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
const RowBlock = ({ block, isActive }) => {
    var _a;
    const minChildWidth = 320;
    const { blockID, hasFocusWithin, value, children } = block;
    const { flow, height, template } = value !== null && value !== void 0 ? value : {};
    const [groupWidth, setGroupWidth] = useState(null);
    const [currentTemplate, setCurrentTemplate] = useState(template || []);
    const [isResizing, setIsResizing] = useState(null);
    const groupRef = useRef(null);
    const { blocks, setActiveBlock, updateBlock } = useEditor();
    const prevXRef = useRef(null);
    const isResizable = !!(children === null || children === void 0 ? void 0 : children.length) && groupWidth ? groupWidth > (minChildWidth * (children === null || children === void 0 ? void 0 : children.length)) : false;
    const handleResizeStart = useCallback((e, indexEl) => {
        if (isResizable) {
            setIsResizing(indexEl);
            prevXRef.current = e.clientX;
            document.body.style.userSelect = 'none';
        }
    }, [prevXRef, setIsResizing, groupWidth, minChildWidth]);
    useEffect(() => {
        if (isResizing !== null) {
            const currentTemplateRef = { current: null };
            const handleResize = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const deltaX = !!prevXRef.current ? e.clientX - prevXRef.current : 0;
                const deltaPercentage = !!groupWidth ? deltaX / groupWidth * 100 : 0;
                if (groupWidth)
                    setCurrentTemplate((prevTemplate) => {
                        const newTemplate = [...prevTemplate];
                        newTemplate[isResizing] += deltaPercentage;
                        newTemplate[isResizing + 1] -= deltaPercentage;
                        if (newTemplate[isResizing] / 100 * groupWidth < minChildWidth ||
                            newTemplate[isResizing + 1] / 100 * groupWidth < minChildWidth) {
                            currentTemplateRef.current = prevTemplate;
                            return prevTemplate;
                        }
                        currentTemplateRef.current = newTemplate;
                        return newTemplate;
                    });
                prevXRef.current = e.clientX;
            };
            const handleResizeEnd = () => {
                setIsResizing(null);
                prevXRef.current = null;
                document.body.style.userSelect = '';
                if (currentTemplateRef.current) {
                    updateBlock(blockID, {
                        value: {
                            template: currentTemplateRef.current.map((val => Math.floor(val)))
                        }
                    });
                }
            };
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', handleResizeEnd);
            return () => {
                document.removeEventListener('mousemove', handleResize);
                document.removeEventListener('mouseup', handleResizeEnd);
            };
        }
    }, [isResizing, groupWidth]);
    useEffect(() => {
        setCurrentTemplate(template || []);
    }, [template]);
    useEffect(() => {
        const handleResize = (entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect;
                setGroupWidth(width);
            }
        };
        const resizeObserver = new ResizeObserver(handleResize);
        if (groupRef.current) {
            resizeObserver.observe(groupRef.current);
        }
        return () => {
            if (groupRef.current) {
                resizeObserver.unobserve(groupRef.current);
            }
            resizeObserver.disconnect();
        };
    }, []);
    useEffect(() => {
        if (children)
            updateBlock(blockID, {
                value: {
                    template: children.map(() => 100 / children.length)
                }
            });
    }, [children]);
    return (_jsxs(_Fragment, { children: [_jsx(BlockToolbar, { children: _jsxs(BlockToolbarColumn, { title: 'Direction', children: [_jsx(Button, { variant: flow === "vertical" ? undefined : "selected", onClick: () => updateBlock(blockID, {
                                value: {
                                    flow: "horizontal"
                                }
                            }), title: "Empiler les blocs horizontalement", ariaLabel: "Empiler les blocs horizontalement", children: _jsx(BsArrowsExpandVertical, {}) }), _jsx(Button, { variant: flow !== "vertical" ? undefined : "selected", onClick: () => updateBlock(blockID, {
                                value: {
                                    flow: "vertical"
                                }
                            }), title: "Empiler les blocs verticalement", ariaLabel: "Empiler les blocs verticalement", children: _jsx(BsArrowsExpand, {}) })] }) }), _jsxs("div", { className: clsx("sg-block__blockGroup", block.hasFocusWithin && 'sg-block__blockGroup--focusWithin', flow === "vertical" ? 'sg-block__blockGroup--vertical' : 'sg-block__blockGroup--horizontal', height && (typeof height === 'number' || height.indexOf('px') !== -1) ? 'sg-block__blockGroup--fixedHeight' : ''), ref: groupRef, children: [!!children &&
                        ((_a = block.children) === null || _a === void 0 ? void 0 : _a.map((childID, indexEl) => (_jsxs("div", { className: "sg-block__blockGroup__childContainer", style: {
                                flex: (currentTemplate === null || currentTemplate === void 0 ? void 0 : currentTemplate[indexEl]) + "% 1 0",
                                minWidth: minChildWidth + "px"
                            }, children: [_jsx(Block, { horizontalFlow: flow !== 'vertical', block: blocks.get(childID) }), isActive && (indexEl !== children.length - 1) &&
                                    _jsx("div", { className: clsx("sg-block__blockGroup__resizeHandle", (!isResizable || flow === 'vertical') && "sg-block__blockGroup__resizeHandle--disabled"), onMouseDown: (e) => handleResizeStart(e, indexEl) })] }, childID)))), !(children === null || children === void 0 ? void 0 : children.length) &&
                        _jsx("div", { className: "sg-block__blockGroup__placeholder" }), !!isActive &&
                        _jsx(AddBlockContextMenu, { args: { parentID: blockID }, className: "sg-block__blockGroup__addChild", children: _jsx("button", { title: "Ajouter des blocs \u00E0 l'int\u00E9rieur du groupe", "aria-label": "Ajouter des blocs \u00E0 l'int\u00E9rieur du groupe", className: "sg-block__btn sg-block__btn--square", children: _jsx(FaPlus, {}) }) }), (hasFocusWithin && !isActive) &&
                        _jsx(Button, { className: "sg-block__btn sg-block__btn--square sg-block__blockGroup__focusParent", onClick: (e) => {
                                e.stopPropagation();
                                setActiveBlock(blockID);
                            }, title: "S\u00E9lectionner le groupe parent", ariaLabel: "S\u00E9lectionner le groupe parent", children: _jsx(MdCenterFocusStrong, {}) })] })] }));
};
export default RowBlock;
