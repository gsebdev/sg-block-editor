import clsx from "clsx";
import React, { createContext, Dispatch, MouseEventHandler, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { addBlockMenuProps, EditorParsedBlock } from "./definitions";
import { useEditor } from "./context";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Resizable, ResizableProps } from "re-resizable";

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

}

export const AddBlockContextMenu: React.FC<addBlockMenuProps> = ({ className, children, args }) => {
    const { addBlock, availableBlocks } = useEditor();

    return (
        <div className={clsx(
            className
        )}>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    {children}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                    sideOffset={0}
                    align="center"
                    className="sg-block__addMenu__content"
                >
                    <DropdownMenu.Label
                        className="sg-block__addMenu__label"
                    >
                        Choisir un type
                    </DropdownMenu.Label>
                    {
                        Object.values(availableBlocks).map((block) => {
                            const Icon = block.icon;
                            return (
                                <DropdownMenu.Item
                                    key={block.type}
                                    onClick={() => addBlock(block.type, args)}
                                    className="sg-block__addMenu__item"
                                >
                                    <Icon style={{ marginRight: '4px' }} />
                                    {block.name}
                                </DropdownMenu.Item>
                            )
                        })
                    }
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    )
}

const toolbarContext = createContext<[
    ReactNode,
    Dispatch<React.SetStateAction<React.ReactNode>>
]>([
    null,
    () => {
        throw new Error("Toolbar must be wrapped in context provider")
    }
]);

const BlockToolbarProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [toolbar, setToolbar] = useState<ReactNode>(null);
    return (
        <toolbarContext.Provider value={[toolbar, setToolbar]}>
            {children}
        </toolbarContext.Provider>
    )
}

const BlockToolbarRenderer: React.FC<{ position: 'top' | 'bottom' }> = ({ position }) => {
    const [toolbar] = useContext(toolbarContext);

    if (!toolbar) return null;

    return (
        <div className={`sg-block__block__toolbar${position === 'top' ? ' sg-block__block__toolbar--top' : ''}`}>
            {toolbar}
        </div>
    )
}

const ResizableWrapper: React.FC<PropsWithChildren<{ isResizable: boolean } & ResizableProps>> = ({ isResizable, children, ...props }) => {

    if (!isResizable) return (
        <div
            className={props.className}
            style={{
                width: props.size?.width || '100%',
                height: props.size?.height || 'auto',
                maxWidth: '100%',
                ...props.style,
            }}
        >
            {children}
        </div>
    );

    return (
        <Resizable
            className={props.className}
            maxWidth={`100%`}
            handleClasses={{
                right: 'sg-block__block__resizeHandle sg-block__block__resizeHandle--right',
                left: 'sg-block__block__resizeHandle sg-block__block__resizeHandle--left',
                top: 'sg-block__block__resizeHandle sg-block__block__resizeHandle--top',
                bottom: 'sg-block__block__resizeHandle sg-block__block__resizeHandle--bottom',

            }}
            size={{
                width: props.size?.width || '100%',
                height: props.size?.height || 'auto',
            }}
            style={props.style}
            onResizeStop={props.onResizeStop}
            onResize={props.onResize}
            onResizeStart={props.onResizeStart}
            enable={props.enable}

        >
            {children}
        </Resizable>
    )
}

export const BlockToolbar: React.FC<PropsWithChildren> = ({ children }) => {
    const [, setToolbar] = useContext(toolbarContext);

    useEffect(() => {
        setToolbar(children);

        return () => {
            setToolbar(null);
        };
    }, [children]);

    return null;
}

export const BlockToolbarColumn: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="sg-block__block__toolbar__column">
            {children}
        </div>
    )
}

const Block: React.FC<{ block: EditorParsedBlock | undefined, className?: string, horizontalFlow?: boolean, isResizable?: boolean }> = ({ block, className, horizontalFlow, isResizable = true }) => {
    const [toolbarPosition, setToolbarPosition] = useState<'bottom' | 'top'>('bottom');

    const { blocks, activeBlock, setActiveBlock, deleteBlock, availableBlocks, updateBlock } = useEditor();

    const blockRef = useRef<HTMLDivElement | null>(null);

    const { blockID, hasFocusWithin, parentID, type, value } = block ?? {};
    const isActive = activeBlock === blockID;

    const scrollHandler = useCallback(() => {
        const { top, bottom } = blockRef.current?.getBoundingClientRect();
        setToolbarPosition(window.innerHeight - bottom > top ? 'bottom' : 'top');
    }, [blockRef, setToolbarPosition])

    useEffect(() => {

        if (blockRef.current) {
            if (isActive) {
                scrollHandler();
                window.addEventListener('scroll', scrollHandler, true);
            } else {
                window.removeEventListener('scroll', scrollHandler, true);
            }
        }

        return () => window.removeEventListener('scroll', scrollHandler, true);

    }, [isActive, blockRef]);

    const handleClickCapture: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        if (activeBlock !== blockID && !hasFocusWithin) {
            e.preventDefault();
            e.stopPropagation();

            setActiveBlock(blockID ?? null);
        }
    }, [activeBlock, hasFocusWithin, blockID, setActiveBlock]);

    if (!block) return null;

    const BlockEditorElement = availableBlocks[block.type].editor;

    if (!BlockEditorElement) return null;



    return (
        <BlockToolbarProvider>
            <div
                ref={blockRef}
                style={{
                    display: 'contents'
                }}

                onClickCapture={handleClickCapture}
            >

                <ResizableWrapper
                    isResizable={isResizable && isActive}
                    size={{
                        width: value?.width || '100%',
                        height: (block.children && value?.flow !== 'vertical') ? 'auto' : value?.height,
                    }}
                    enable={
                        !!parentID && horizontalFlow ? {
                            top: false,
                            right: true,
                            bottom: false,
                            left: true,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false
                        } : !!parentID && !horizontalFlow ? {
                            top: true,
                            right: false,
                            bottom: true,
                            left: false,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false
                        } : undefined
                    }

                    onResizeStop={(e, dir, ref, d) => {
                        const containerWidth = ref.parentElement.parentElement.clientWidth;
                        const newWidth = ref.offsetWidth;
                        const newHeight = ref.offsetHeight;

                        // handle flex width when current block is a child block
                        if (parentID && horizontalFlow) {
                            updateBlock(blockID, {
                                value: {
                                    width: d.width !== 0 ? ref.style.width : value?.width,
                                    height: value?.height,
                                }
                            });
                        } else if (parentID && !horizontalFlow) {
  
                            const containerHeight = ref.parentElement.parentElement.clientHeight
                            updateBlock(blockID, {
                                value: {
                                    width: value?.width,
                                    height: d.height !== 0 ? (newHeight / containerHeight * 100) + '%' : value?.height
                                }
                            });
                        } else {
                            updateBlock(blockID, {
                                value: {
                                    width: newWidth === containerWidth ? '100%' : d.width !== 0 ? newWidth + 'px' : value?.width,
                                    height: d.height !== 0 ? newHeight + 'px' : value?.height,
                                }
                            });
                        }
                        

                        if(!!block.children) {

                            // case resizing height of a parent element
                            if(value?.flow !== 'vertical' && d.height) {
                                block.children.forEach((childID) => {
                                    const child = blocks.get(childID)
                                    updateBlock(child.blockID, {
                                        value: {
                                            height: ref.clientHeight + 'px',
                                        }
                                    })
                                })
                            }
                        }


                    }}

                    style={{
                        alignSelf: value?.align && alignStyles.alignSelf[value.align],
                        margin: value?.align && alignStyles.margin[value.align],
                        flexShrink: 1,
                    }}
                    className={clsx(
                        'sg-block__block',
                        !hasFocusWithin && !activeBlock && (!parentID || blocks.get(parentID)?.hasFocusWithin) ? 'sg-block__block--hover' : '',
                        activeBlock === blockID ? 'sg-block__block--active' : '',
                        (!hasFocusWithin && !isActive && activeBlock) && 'sg-block__block--inactive',
                        className
                    )}


                >
                    {!!isActive &&
                        <>
                            <AddBlockContextMenu
                                args={{ position: 'before', reference: blockID, parentID }}
                                className="sg-block__contextMenu"
                            >
                                <button
                                    title="Ajouter un élément avant le bloc actif"
                                    aria-label="Ajotuer un élément avant le bloc actif"
                                    className={`sg-block__btn__addBlock sg-block__btn__addBlock--${horizontalFlow ? 'left' : 'top'}`}
                                >
                                    <FaPlus />
                                </button>
                            </AddBlockContextMenu>


                        </>
                    }

                    <BlockEditorElement block={block} isActive={isActive} />
                    {!!isActive && <BlockToolbarRenderer position={toolbarPosition} />}

                    {!!isActive &&
                        <>
                            <button
                                className="sg-block__btn sg-block__btn--square sg-block__btn__deleteBlock"
                                onClick={() => deleteBlock(blockID)}
                                aria-label={"Supprimer le block actif: " + type}
                                title={"Supprimer le block actif: " + type}
                            >
                                <RiDeleteBin5Line />
                            </button>
                            <AddBlockContextMenu
                                args={{ position: 'after', reference: blockID, parentID }}
                                className="sg-block__contextMenu"
                            >
                                <button
                                    title="Ajouter un élément après le bloc actif"
                                    aria-label="Ajouter un élément après le bloc actif"
                                    className={`sg-block__btn__addBlock sg-block__btn__addBlock--${horizontalFlow ? 'right' : 'bottom'}`}
                                >
                                    <FaPlus />
                                </button>
                            </AddBlockContextMenu>
                        </>
                    }
                </ResizableWrapper>
            </div>
        </BlockToolbarProvider>
    )
}

export default Block;