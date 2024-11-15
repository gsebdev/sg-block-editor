import clsx from "clsx";
import React, { createContext, Dispatch, MouseEventHandler, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { addBlockMenuProps, EditorParsedBlock } from "./definitions";
import { useEditor } from "./context";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Resizable, ResizableProps } from "re-resizable";
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
                                    {!!Icon && <Icon style={{ marginRight: '4px' }} />}
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

const BlockToolbarRenderer: React.FC<{ position: 'top' | 'bottom', hasSpacingOptions?: boolean, block: EditorParsedBlock }> = ({ position, hasSpacingOptions, block }) => {
    const [toolbar] = useContext(toolbarContext);

    const { updateBlock } = useEditor();

    const handleChangeSpacings = useCallback((spacingsValue: Record<string, string>) => {
        updateBlock(blockID, {
            value: {
                spacings: spacingsValue
            }
        });
    }, [updateBlock, block.blockID]);

    const { value, blockID } = block;
    const { spacings } = value ?? {};


    return (
        <div className={`sg-block__block__toolbar${position === 'top' ? ' sg-block__block__toolbar--top' : ''}`}>
            {toolbar ?? null}
            {hasSpacingOptions && <SpacingTool value={spacings} onChange={handleChangeSpacings} />}
        </div>
    )
}

const ResizableWrapper: React.FC<PropsWithChildren<{ isResizable: boolean } & ResizableProps>> = ({ isResizable, children, ...props }) => {
    return (
        <Resizable
            enable={props.enable || (isResizable ? undefined : false)}
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

export const BlockToolbarColumn: React.FC<PropsWithChildren<{ title: string }>> = ({ children, title }) => {
    return (
        <div>
            <p className="sg-block__block__toolbar__column__title"><b>{title}</b></p>
            <div className="sg-block__block__toolbar__column">
                {children}
            </div>
        </div>

    )
}

const Block: React.FC<{ block: EditorParsedBlock | undefined, className?: string, horizontalFlow?: boolean }> = ({ block, className, horizontalFlow }) => {
    const [toolbarPosition, setToolbarPosition] = useState<'bottom' | 'top'>('bottom');

    const { blocks, activeBlock, setActiveBlock, deleteBlock, availableBlocks, updateBlock } = useEditor();

    const blockRef = useRef<HTMLDivElement | null>(null);

    const { blockID, hasFocusWithin, parentID, type, value } = block ?? {};

    const isActive = blockID === activeBlock;

    const { isResizable, hasSpacingOptions, BlockEditorElement } = useMemo(() => {
        if(!type) return {}
        return {
            isResizable: availableBlocks[type]?.isResizable || false,
            hasSpacingOptions: !!availableBlocks[type]?.hasSpacingOptions,
            BlockEditorElement: availableBlocks[type]?.editor
        }
    }, [availableBlocks, parentID]);

    const scrollHandler = useCallback(() => {
        const { top, bottom } = blockRef.current?.getBoundingClientRect() ?? {};
        if (bottom !== undefined && top !== undefined) {
            setToolbarPosition(window.innerHeight - bottom > top ? 'bottom' : 'top');
        }
    }, [blockRef, setToolbarPosition])

    useEffect(() => {
        if (blockRef.current) {
            if (isActive) {
                scrollHandler();
                window.addEventListener('scroll', scrollHandler, true);
                blockRef.current.focus();
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

    if (!blockID) return null;

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
                    isResizable={!!isResizable && isActive}
                    size={{
                        width: isResizable && value?.width ? value?.width : '100%',
                        height: isResizable && value?.height ? value?.height : 'auto',
                    }}
                    enable={
                        isActive && typeof isResizable === 'object' ? isResizable : undefined
                    }

                    onResizeStop={(e, dir, ref, d) => {
                        const containerWidth = ref.parentElement?.parentElement?.clientWidth;
                        const newWidth = ref.offsetWidth;
                        const newHeight = ref.offsetHeight;

                        updateBlock(blockID, {
                            value: {
                                width: newWidth === containerWidth ? '100%' : d.width !== 0 ? newWidth + 'px' : value?.width,
                                height: d.height !== 0 ? newHeight + 'px' : value?.height,
                            }
                        });
                    }}

                    style={{
                        alignSelf: !!value?.align && (alignStyles.alignSelf as any)[value.align as string],
                        margin: !!value?.align && (alignStyles.margin as any)[value.align as string],
                        paddingTop: value?.spacings?.top,
                        paddingBottom: value?.spacings?.bottom,
                        paddingLeft: value?.spacings?.left,
                        paddingRight: value?.spacings?.right
                    }}
                    className={clsx(
                        'sg-block__block',
                        !hasFocusWithin && !activeBlock && (!parentID || blocks.get(parentID)?.hasFocusWithin) ? 'sg-block__block--hover' : '',
                        isActive ? 'sg-block__block--active' : '',
                        (!hasFocusWithin && !isActive && activeBlock) && 'sg-block__block--inactive',
                        className
                    )}


                >
                    {isActive &&
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
                    {isActive && <BlockToolbarRenderer position={toolbarPosition} hasSpacingOptions={hasSpacingOptions} block={block} />}

                    {isActive &&
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