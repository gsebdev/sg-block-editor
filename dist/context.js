import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from "react";
import { genBlockID } from "./helpers";
const initialContext = {
    isDirty: false,
    setIsDirty: () => { },
    blocks: new Map(),
    setBlocks: () => { },
    addBlock: () => { },
    updateBlock: () => { },
    deleteBlock: () => { },
    activeBlock: null,
    setActiveBlock: () => { },
    availableBlocks: {},
};
const blockEditorContext = createContext(initialContext);
export const BlocksEditorContextProvider = forwardRef(({ children, data, onChange, availableBlocks }, ref) => {
    const [blocks, setBlocks] = useState(new Map());
    const [renderedBlocks, setRenderedBlocks] = useState(data);
    const [isDirty, setIsDirty] = useState(false);
    const [activeBlock, setActiveBlock] = useState(null);
    useImperativeHandle(ref, () => ({
        getRenderedValue: () => renderedBlocks !== null && renderedBlocks !== void 0 ? renderedBlocks : []
    }));
    useEffect(() => {
        if (isDirty) {
            const renderBlocks = (b) => {
                if (b.children && Array.isArray(b.children)) {
                    return {
                        type: b.type,
                        value: b.value,
                        children: b.children.map(child => {
                            const childBlock = blocks.get(child);
                            if (childBlock) {
                                return renderBlocks(childBlock);
                            }
                            return {
                                type: 'text',
                                value: {
                                    htmlContent: '<p>[ERROR] Block not found</p>'
                                }
                            };
                        })
                    };
                }
                return {
                    type: b.type,
                    value: b.value,
                };
            };
            setTimeout(() => {
                const rendered = Array.from(blocks.values()).filter(block => !block.parentID).map(editorBlock => renderBlocks(editorBlock));
                setRenderedBlocks(rendered);
                onChange === null || onChange === void 0 ? void 0 : onChange(rendered);
                setIsDirty(false);
            });
        }
    }, [blocks, isDirty, onChange]);
    useEffect(() => {
        setRenderedBlocks(data);
        if (data) {
            const initialBlocks = new Map();
            const parseBlocks = (b, parentID) => {
                const blockID = genBlockID();
                if (b.children && Array.isArray(b.children)) {
                    const parsed = Object.assign(Object.assign({}, b), { blockID, parentID, children: [] });
                    parsed.children = b.children.map(child => parseBlocks(child, blockID));
                    initialBlocks.set(blockID, parsed);
                }
                else {
                    initialBlocks.set(blockID, Object.assign(Object.assign({}, b), { blockID,
                        parentID, children: undefined }));
                }
                return blockID;
            };
            data.forEach(b => parseBlocks(b));
            setBlocks(initialBlocks);
        }
    }, [data]);
    const updateBlock = useCallback((blockID, updatedData, shouldNotDirty) => {
        setBlocks(prevBlocks => {
            var _a, _b, _c;
            const newBlocks = new Map(prevBlocks);
            const blockToUpdate = newBlocks.get(blockID);
            if (!blockToUpdate)
                return prevBlocks;
            const newBlock = Object.assign(Object.assign(Object.assign({}, blockToUpdate), updatedData), { value: Object.assign(Object.assign({}, (_a = blockToUpdate.value) !== null && _a !== void 0 ? _a : {}), (_b = updatedData.value) !== null && _b !== void 0 ? _b : {}) });
            newBlocks.set(blockID, newBlock);
            if (((_c = updatedData.value) === null || _c === void 0 ? void 0 : _c.flow) && availableBlocks[blockToUpdate.type].autoChildrenSizing) {
                blockToUpdate.children.forEach(child => {
                    var _a;
                    const childBlock = newBlocks.get(child);
                    if (childBlock) {
                        childBlock.value = Object.assign(Object.assign({}, (childBlock.value || {})), { width: updatedData.value.flow !== 'vertical' ? (100 / blockToUpdate.children.length) + '%' : '100%', height: updatedData.value.flow === 'vertical' ? (100 / blockToUpdate.children.length) + '%' : (_a = blockToUpdate.value) === null || _a === void 0 ? void 0 : _a.height });
                    }
                });
            }
            return newBlocks;
        });
        if (!shouldNotDirty)
            setIsDirty(true);
    }, [setBlocks]);
    useEffect(() => {
        var _a;
        const blocksThatShouldHaveFocusWithin = [];
        if (activeBlock) {
            const activeBlockParent = (_a = blocks.get(activeBlock)) === null || _a === void 0 ? void 0 : _a.parentID;
            let nParentBlock = activeBlockParent ? blocks.get(activeBlockParent) : undefined;
            while (nParentBlock) {
                blocksThatShouldHaveFocusWithin.push(nParentBlock.blockID);
                nParentBlock = nParentBlock.parentID ? blocks.get(nParentBlock.parentID) : undefined;
            }
        }
        blocks.forEach((block) => {
            if (blocksThatShouldHaveFocusWithin.includes(block.blockID)) {
                if (!block.hasFocusWithin)
                    updateBlock(block.blockID, { hasFocusWithin: true }, true);
            }
            else {
                if (block.hasFocusWithin)
                    updateBlock(block.blockID, { hasFocusWithin: false }, true);
            }
        });
    }, [blocks, activeBlock, updateBlock]);
    const addBlock = useCallback((type, args) => {
        const blockID = genBlockID();
        const { parentID, position, reference } = args !== null && args !== void 0 ? args : {};
        setBlocks(prevBlocks => {
            var _a, _b, _c;
            const newBlocksArray = Array.from(prevBlocks);
            let insertIndex = newBlocksArray.length;
            if (reference) {
                insertIndex = newBlocksArray.findIndex(([id]) => id === reference);
                if (position === 'after')
                    insertIndex += 1;
            }
            newBlocksArray.splice(insertIndex, 0, [
                blockID, {
                    type,
                    value: (_a = availableBlocks[type]) === null || _a === void 0 ? void 0 : _a.defaultValue,
                    blockID,
                    parentID,
                    children: ((_b = availableBlocks[type]) === null || _b === void 0 ? void 0 : _b.acceptChildren) ? [] : undefined
                }
            ]);
            if (parentID) {
                const parentBlock = (_c = newBlocksArray.find(([id]) => id === parentID)) === null || _c === void 0 ? void 0 : _c[1];
                if (parentBlock && Array.isArray(parentBlock.children)) {
                    if (!parentBlock.children.includes(blockID)) {
                        let childrenInsertIndex = parentBlock.children.length;
                        if (reference) {
                            childrenInsertIndex = parentBlock.children.findIndex(id => id === reference);
                            if (position === 'after')
                                childrenInsertIndex += 1;
                        }
                        parentBlock.children.splice(childrenInsertIndex, 0, blockID);
                        if (availableBlocks[parentBlock.type].autoChildrenSizing) {
                            parentBlock.children.forEach(child => {
                                var _a, _b, _c, _d;
                                const childBlock = (_a = newBlocksArray.find(([id]) => id === child)) === null || _a === void 0 ? void 0 : _a[1];
                                if (childBlock) {
                                    const { value } = childBlock;
                                    childBlock.value = Object.assign(Object.assign({}, (value || {})), { width: ((_b = parentBlock.value) === null || _b === void 0 ? void 0 : _b.flow) !== 'vertical' ? (100 / parentBlock.children.length) + '%' : undefined, height: ((_c = parentBlock.value) === null || _c === void 0 ? void 0 : _c.flow) === 'vertical' ? (100 / parentBlock.children.length) + '%' : (_d = parentBlock.value) === null || _d === void 0 ? void 0 : _d.height });
                                }
                            });
                        }
                    }
                }
            }
            return new Map(newBlocksArray);
        });
        setActiveBlock(blockID);
        setIsDirty(true);
    }, []);
    const deleteBlock = useCallback((blockID) => {
        let newSelectedBlock = null;
        setBlocks(prevBlock => {
            var _a;
            const newBlocks = new Map(prevBlock);
            const blockToDelete = newBlocks.get(blockID);
            if (!blockToDelete)
                return newBlocks;
            if (blockToDelete === null || blockToDelete === void 0 ? void 0 : blockToDelete.parentID)
                newSelectedBlock = blockToDelete.parentID;
            const IDsToDelete = [];
            const getChildrenIDsRecursive = (bID) => {
                const b = newBlocks.get(bID);
                if (b && b.children && Array.isArray(b.children)) {
                    for (const childID of b.children) {
                        getChildrenIDsRecursive(childID);
                    }
                }
                IDsToDelete.push(bID);
            };
            const deleteInParentChildren = () => {
                if (blockToDelete && blockToDelete.parentID) {
                    const parentBlock = newBlocks.get(blockToDelete.parentID);
                    if (parentBlock && parentBlock.children) {
                        parentBlock.children = parentBlock.children.filter(childID => childID !== blockID);
                    }
                }
            };
            const deleteBlockWithchildren = () => {
                getChildrenIDsRecursive(blockID);
                deleteInParentChildren();
                IDsToDelete.forEach(ID => newBlocks.delete(ID));
            };
            deleteBlockWithchildren();
            const parentBlock = newBlocks.get(newSelectedBlock);
            if (newSelectedBlock && ((_a = availableBlocks[parentBlock === null || parentBlock === void 0 ? void 0 : parentBlock.type]) === null || _a === void 0 ? void 0 : _a.autoChildrenSizing)) {
                parentBlock.children.forEach(child => {
                    var _a, _b, _c;
                    const childBlock = newBlocks.get(child);
                    if (childBlock) {
                        const { value } = childBlock;
                        childBlock.value = Object.assign(Object.assign({}, (value || {})), { width: ((_a = parentBlock.value) === null || _a === void 0 ? void 0 : _a.flow) !== 'vertical' ? (100 / parentBlock.children.length) + '%' : undefined, height: ((_b = parentBlock.value) === null || _b === void 0 ? void 0 : _b.flow) === 'vertical' ? (100 / parentBlock.children.length) + '%' : (_c = parentBlock.value) === null || _c === void 0 ? void 0 : _c.height });
                    }
                });
            }
            return newBlocks;
        });
        setActiveBlock(newSelectedBlock);
        setIsDirty(true);
    }, []);
    return (_jsx(blockEditorContext.Provider, { value: {
            blocks,
            setBlocks,
            isDirty,
            setIsDirty,
            addBlock,
            updateBlock,
            deleteBlock,
            activeBlock,
            setActiveBlock,
            availableBlocks
        }, children: children }));
});
BlocksEditorContextProvider.displayName = 'BlocksEditorContextProvider';
export const useEditor = () => useContext(blockEditorContext);
