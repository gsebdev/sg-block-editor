import { createContext, Dispatch, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
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
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [activeBlock, setActiveBlock] = useState<string | null>(null);
    const renderedRef = useRef({
        JSONValue: data ?? [],
        HTMLValue: '',
        getJSONValue() { return this.JSONValue; },
        getHTMLValue() { return this.HTMLValue; }
    })

    useImperativeHandle(ref, () => renderedRef.current);

    useEffect(() => {
        if (isDirty) {
            const renderBlocksToJSONRecursive = (b: EditorParsedBlock): BlockType => {
                if (b.children && Array.isArray(b.children)) {
                    return {
                        type: b.type,
                        value: b.value,
                        children: b.children.map(child => {
                            const childBlock = blocks.get(child);
                            if (childBlock) {
                                return renderBlocksToJSONRecursive(childBlock);
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
            
            const updateValuesAsync = async () => {
                const blocksValue = Array.from(blocks.values())
                
                //Render the HTML if render function is provided
                let newRenderedHTML = '';
                //recursive html render
                const renderToHTML = async (b:EditorParsedBlock) => {
                    const { type, value, children } = b;
                    const { render } = availableBlocks[type] ?? {};
                    if(render) {
                        let renderedChildren;
                        if(children) {
                            renderedChildren = [];
                            for(const child of children) {
                                const childBlock = blocks.get(child);
                                if (childBlock) {
                                    renderedChildren.push(await renderToHTML(childBlock));
                                }
                            }
                        }
                        const newValue = {
                            ...value ?? {},
                            children: renderedChildren
                        }
                        const html = await render(newValue);
                        return html;
                    } else {
                        return '<p>No render function provided</p>';
                    }
                }

                const filteredBlocks = blocksValue.filter(block => !block.parentID);

                // Render the HTML
                for (const b of filteredBlocks) {
                    newRenderedHTML += await renderToHTML(b);
                }

                // Render the JSON
                const newRenderedJSON = filteredBlocks.map(editorBlock => renderBlocksToJSONRecursive(editorBlock));
                return {
                    HTMLValue: newRenderedHTML,
                    JSONValue: newRenderedJSON
                }
            }

            // set the updated values and trigger change callback
            updateValuesAsync().then(({ HTMLValue, JSONValue }) => {
                renderedRef.current.JSONValue = JSONValue;
                renderedRef.current.HTMLValue = HTMLValue;
                onChange?.(JSONValue);
                setIsDirty(false);
            });

        }
    }, [blocks, isDirty, onChange]);

    useEffect(() => {
        renderedRef.current.JSONValue = data ?? [];
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
                    value: type in availableBlocks ? availableBlocks[type]?.defaultValue : undefined,
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
