import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from "clsx";
import Block, { AddBlockContextMenu, BlockToolbar, BlockToolbarColumn } from "../Block";
import { BsArrowsExpand, BsArrowsExpandVertical } from "react-icons/bs";
import { useEditor } from "../context";
import Button from "../components/Button";
import { MdCenterFocusStrong } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
const RowBlock = ({ block, isActive }) => {
    const { blocks, setActiveBlock, updateBlock } = useEditor();
    const { blockID, hasFocusWithin, value, children } = block;
    const { flow, height } = value !== null && value !== void 0 ? value : {};
    return (_jsxs(_Fragment, { children: [_jsx(BlockToolbar, { children: _jsxs(BlockToolbarColumn, { children: [_jsx(Button, { variant: flow === "vertical" ? undefined : "selected", onClick: () => updateBlock(blockID, {
                                value: {
                                    flow: "horizontal"
                                }
                            }), title: "Empiler les blocs horizontalement", ariaLabel: "Empiler les blocs horizontalement", children: _jsx(BsArrowsExpandVertical, {}) }), _jsx(Button, { variant: flow !== "vertical" ? undefined : "selected", onClick: () => updateBlock(blockID, {
                                value: {
                                    flow: "vertical"
                                }
                            }), title: "Empiler les blocs verticalement", ariaLabel: "Empiler les blocs verticalement", children: _jsx(BsArrowsExpand, {}) })] }) }), _jsxs("div", { className: clsx("sg-block__blockGroup", block.hasFocusWithin && 'sg-block__blockGroup--focusWithin', flow === "vertical" ? 'sg-block__blockGroup--vertical' : 'sg-block__blockGroup--horizontal', height && (typeof height === 'number' || height.indexOf('px') !== -1) ? 'sg-block__blockGroup--fixedHeight' : ''), children: [!!children &&
                        block.children.map(childID => (_jsx(Block, { horizontalFlow: flow !== 'vertical', block: blocks.get(childID) }, childID))), !(children === null || children === void 0 ? void 0 : children.length) &&
                        _jsx("div", { className: "sg-block__blockGroup__placeholder" }), !!isActive &&
                        _jsx(AddBlockContextMenu, { args: { parentID: blockID }, children: _jsx("button", { title: "Ajouter des blocs \u00E0 l'int\u00E9rieur du groupe", "aria-label": "Ajouter des blocs \u00E0 l'int\u00E9rieur du groupe", className: "sg-block__btn sg-block__btn--square sg-block__blockGroup__addChild", children: _jsx(FaPlus, {}) }) }), (hasFocusWithin && !isActive) &&
                        _jsx(Button, { className: "sg-block__btn sg-block__btn--square sg-block__blockGroup__focusParent", onClick: () => setActiveBlock(blockID), title: "S\u00E9lectionner le groupe parent", ariaLabel: "S\u00E9lectionner le groupe parent", children: _jsx(MdCenterFocusStrong, {}) })] })] }));
};
export default RowBlock;
