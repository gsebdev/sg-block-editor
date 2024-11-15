import { createContext, Dispatch, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from "react";
import { BlockType, EditorBlock, EditorParsedBlock, EditorProviderProps, EditorRefObject } from "./definitions";
import { SetStateAction } from "react";
import { genBlockID } from "./helpers";

const initialContext: {
    blocks: Map<string, EditorParsedBlock>,
    setBlocks: Dispatch<SetStateAction<Map<string, EditorParsedBlock>>>,
    addBlock: (type: BlockType['type'], args?: { parentID?: string, position?: 'after' | 'before', reference?: string }) => void,
    updateBlock: (blockID: string, value: Partial<EditorParsedBlock>, shouldNotDirty?: boolean) => void,
    deleteBlock: (blockID: string) => void,
    isDirty: boolean,
    setIsDirty: Dispatch<SetStateAction<boolean>>
    activeBlock: string | null,
    setActiveBlock: Dispatch<SetStateAction<string | null>>,
    availableBlocks: { [key: string]: EditorBlock },
} = {
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

export const BlocksEditorContextProvider = forwardRef<EditorRefObject, EditorProviderProps>(({ children, data, onChange, availableBlocks }, ref) => {

    const [blocks, setBlocks] = useState<Map<string, EditorParsedBlock>>(new Map());
    const [renderedBlocks, setRenderedBlocks] = useState<BlockType[] | null | undefined>(data);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [activeBlock, setActiveBlock] = useState<string | null>(null);
    
    useImperativeHandle(ref, () => ({
        getRenderedValue: () => renderedBlocks ?? []
    }))
    useEffect(() => {
        if (isDirty) {
            const renderBlocks = (b: EditorParsedBlock): BlockType => {
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
                    }
                }
                return {
                    type: b.type,
                    value: b.value,
                };
            }
            setTimeout(() => {
                const rendered = Array.from(blocks.values()).filter(block => !block.parentID).map(editorBlock => renderBlocks(editorBlock));
                setRenderedBlocks(rendered);
                onChange?.(rendered);
                setIsDirty(false);
            })

        }
    }, [blocks, isDirty, onChange]);

    useEffect(() => {
        setRenderedBlocks(data);
        // parse blocks and set initital state
        if (data) {
            const initialBlocks = new Map<string, EditorParsedBlock>();

            const parseBlocks = (b: BlockType, parentID?: string) => {
                const blockID = genBlockID();

                if (b.children && Array.isArray(b.children)) {
                    const parsed: EditorParsedBlock = { ...b, blockID, parentID, children: [] };
                    parsed.children = b.children.map(child => parseBlocks(child, blockID));
                    initialBlocks.set(blockID, parsed);
                } else {
                    initialBlocks.set(blockID, {
                        ...b,
                        blockID,
                        parentID,
                        children: undefined
                    });
                }
                return blockID;
            }

            data.forEach(b => parseBlocks(b));

            setBlocks(initialBlocks);
        }
    }, [data]);

    const updateBlock = useCallback((blockID: string, updatedData: Partial<EditorParsedBlock>, shouldNotDirty?: boolean) => {
        setBlocks(prevBlocks => {
            const newBlocks = new Map<string, EditorParsedBlock>(prevBlocks);
            const blockToUpdate = newBlocks.get(blockID);

            if (!blockToUpdate) return prevBlocks;


            const newBlock = {
                ...blockToUpdate,
                ...updatedData,
                value: {
                    ...blockToUpdate.value ?? {},
                    ...updatedData.value ?? {}
                }
            }

            newBlocks.set(blockID, newBlock);

            return newBlocks;
        });
        if (!shouldNotDirty) setIsDirty(true);
    }, [setBlocks]);

    useEffect(() => {
        const blocksThatShouldHaveFocusWithin: string[] = [];

        if (activeBlock) {
            
            // find all blocks that should have focus within
            const activeBlockParent = blocks.get(activeBlock)?.parentID;
            let nParentBlock: EditorParsedBlock | undefined = activeBlockParent ? blocks.get(activeBlockParent) : undefined;
            while (nParentBlock) {
                blocksThatShouldHaveFocusWithin.push(nParentBlock.blockID);
                nParentBlock = nParentBlock.parentID ? blocks.get(nParentBlock.parentID) : undefined;
            }
        }

        // update necessary blocks to have focus within
        blocks.forEach((block) => {
            if (blocksThatShouldHaveFocusWithin.includes(block.blockID)) {
                if (!block.hasFocusWithin) updateBlock(block.blockID, { hasFocusWithin: true }, true)
            } else {
                if (block.hasFocusWithin) updateBlock(block.blockID, { hasFocusWithin: false }, true)
            }
        });
    }, [blocks, activeBlock, updateBlock]);

    const addBlock = useCallback((type: BlockType['type'], args?: { parentID?: string, position?: 'after' | 'before', reference?: string }) => {
        const blockID = genBlockID();
        const { parentID, position, reference } = args ?? {};

        setBlocks(prevBlocks => {
            const newBlocksArray = Array.from(prevBlocks);

            let insertIndex = newBlocksArray.length;
            if (reference) {
                insertIndex = newBlocksArray.findIndex(([id]) => id === reference);
                if (position === 'after') insertIndex += 1;
            }

            newBlocksArray.splice(insertIndex, 0, [
                blockID, {
                    type,
                    value: availableBlocks[type]?.defaultValue,
                    blockID,
                    parentID,
                    children: availableBlocks[type]?.acceptChildren ? [] : undefined
                }]);

            // When parentID is provided, we insert the new block as a child of that parent
            if (parentID) {
                const parentBlock = newBlocksArray.find(([id]) => id === parentID)?.[1];
                if (parentBlock && Array.isArray(parentBlock.children)) {

                    if (!parentBlock.children.includes(blockID)) {
                        let childrenInsertIndex = parentBlock.children.length;
                        if (reference) {
                            childrenInsertIndex = parentBlock.children.findIndex(id => id === reference);
                            if (position === 'after') childrenInsertIndex += 1;
                        }
                        parentBlock.children.splice(childrenInsertIndex, 0, blockID);
                    }
                }
            }
            return new Map(newBlocksArray);
        });
        setActiveBlock(blockID);
        setIsDirty(true);
    }, []);

    const deleteBlock = useCallback((blockID: string) => {
        let newSelectedBlock: string | null = null;

        setBlocks(prevBlock => {
            const newBlocks = new Map(prevBlock);
            const blockToDelete = newBlocks.get(blockID);

            if (!blockToDelete) return newBlocks;

            if (blockToDelete?.parentID) newSelectedBlock = blockToDelete.parentID;

            const IDsToDelete: string[] = []

            const getChildrenIDsRecursive = (bID: string) => {
                const b = newBlocks.get(bID);
                if (b && b.children && Array.isArray(b.children)) {
                    for (const childID of b.children) {
                        getChildrenIDsRecursive(childID);
                    }
                }
                IDsToDelete.push(bID);
            }

            const deleteInParentChildren = () => {
                if (blockToDelete && blockToDelete.parentID) {
                    const parentBlock = newBlocks.get(blockToDelete.parentID);
                    if (parentBlock && parentBlock.children) {
                        parentBlock.children = parentBlock.children.filter(childID => childID !== blockID);
                    }
                }
            }

            const deleteBlockWithchildren = () => {
                getChildrenIDsRecursive(blockID);
                deleteInParentChildren();
                IDsToDelete.forEach(ID => newBlocks.delete(ID))
            }



            deleteBlockWithchildren();

            return newBlocks;
        });
        setActiveBlock(newSelectedBlock);
        setIsDirty(true);
    }, []);


    return (
        <blockEditorContext.Provider value={{
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
        }}>
            {children}
        </blockEditorContext.Provider>
    )
});

BlocksEditorContextProvider.displayName = 'BlocksEditorContextProvider';

export const useEditor = () => useContext(blockEditorContext);
