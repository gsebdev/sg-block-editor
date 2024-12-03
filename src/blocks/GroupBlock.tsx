import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Block, { AddBlockContextMenu, BlockToolbar, BlockToolbarColumn } from "../Block";
import { BsArrowsExpand, BsArrowsExpandVertical } from "react-icons/bs";
import { BlockType, EditorParsedBlock } from "../definitions";
import { useEditor } from "../context";
import Button from "../components/Button";
import { MdCenterFocusStrong } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

type GroupBlockType = BlockType<{
    flow: 'horizontal' | 'vertical',
    template?: number[],
}>
export interface RowBlockProps {
    block: EditorParsedBlock<GroupBlockType>,
    isActive?: boolean
}

const RowBlock: React.FC<RowBlockProps> = ({ block, isActive }) => {
    const minChildWidth = 320;
    const { blockID, hasFocusWithin, value, children } = block;
    const { flow, height, template } = value ?? {};

    const [groupWidth, setGroupWidth] = useState<number | null>(null);
    const [currentTemplate, setCurrentTemplate] = useState<number[]>(template || []);
    const [isResizing, setIsResizing] = useState<number | null>(null);

    const groupRef = useRef(null);
    const { blocks, setActiveBlock, updateBlock } = useEditor();

    const prevXRef = useRef<number | null>(null);

    const isResizable = !!children?.length && groupWidth ? groupWidth > (minChildWidth * children?.length) : false;

    //Resize Handlers

    const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>, indexEl: number) => {
        if (isResizable) {
            setIsResizing(indexEl);
            prevXRef.current = e.clientX;
            document.body.style.userSelect = 'none';
        }
    }, [prevXRef, setIsResizing, groupWidth, minChildWidth]);

    useEffect(() => {

        if (children && children?.length !== currentTemplate.length) {
            const newTemplate = Array(children.length).fill(100 / children?.length);
            setCurrentTemplate(newTemplate);
        }
    }, [children?.length]);


    useEffect(() => {
        if (isResizing !== null) {
            const currentTemplateRef: { current: number[] | null } = { current: null }

            const handleResize = (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();

                const deltaX = prevXRef.current ? e.clientX - prevXRef.current : 0;
                const deltaPercentage = groupWidth ? deltaX / groupWidth * 100 : 0;
                if (groupWidth)
                    setCurrentTemplate((prevTemplate) => {
                        const newTemplate = [...prevTemplate];
                        newTemplate[isResizing] += deltaPercentage;
                        newTemplate[isResizing + 1] -= deltaPercentage;
                        if (
                            newTemplate[isResizing] / 100 * groupWidth < minChildWidth ||
                            newTemplate[isResizing + 1] / 100 * groupWidth < minChildWidth
                        ) {
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
            }
        }
    }, [isResizing, groupWidth]);

    useEffect(() => {
        setCurrentTemplate(template || []);
    }, [template])

    //Observe Resize event on group div
    useEffect(() => {
        const handleResize = (entries: ResizeObserverEntry[]) => {
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

            })
    }, [children])

    return (
        <>
            <BlockToolbar>
                <BlockToolbarColumn
                    title={'Direction'}
                >
                    <Button
                        variant={flow === "vertical" ? undefined : "selected"}
                        onClick={() => updateBlock(blockID, {
                            value: {
                                flow: "horizontal"
                            }
                        })}
                        title="Empiler les blocs horizontalement"
                        ariaLabel="Empiler les blocs horizontalement"
                    >
                        <BsArrowsExpandVertical />
                    </Button>
                    <Button
                        variant={flow !== "vertical" ? undefined : "selected"}
                        onClick={() => updateBlock(blockID, {
                            value: {
                                flow: "vertical"
                            }
                        })}
                        title="Empiler les blocs verticalement"
                        ariaLabel="Empiler les blocs verticalement"
                    >
                        <BsArrowsExpand />
                    </Button>
                </BlockToolbarColumn>
            </BlockToolbar>
            <div
                className={clsx(
                    "sg-block__blockGroup",
                    block.hasFocusWithin && 'sg-block__blockGroup--focusWithin',
                    flow === "vertical" ? 'sg-block__blockGroup--vertical' : 'sg-block__blockGroup--horizontal',
                    height && (typeof height === 'number' || height.indexOf('px') !== -1) ? 'sg-block__blockGroup--fixedHeight' : ''
                )}
                ref={groupRef}
            >
                {!!children &&
                    block.children?.map((childID, indexEl) => (
                        <div
                            key={childID}
                            className="sg-block__blockGroup__childContainer"
                            style={{
                                flex: currentTemplate?.[indexEl] + "% 1 0",
                                minWidth: minChildWidth + "px"
                            }}
                        >
                            <Block
                                horizontalFlow={flow !== 'vertical'}
                                block={blocks.get(childID)}
                            />
                            {isActive && (indexEl !== children.length - 1) &&
                                <div
                                    className={clsx(
                                        "sg-block__blockGroup__resizeHandle",
                                        (!isResizable || flow === 'vertical') && "sg-block__blockGroup__resizeHandle--disabled",
                                    )}
                                    onMouseDown={(e) => handleResizeStart(e, indexEl)}
                                />}
                        </div>
                    ))
                }
                {!children?.length &&
                    <div className="sg-block__blockGroup__placeholder" />
                }
                {!!isActive &&
                    <AddBlockContextMenu
                        args={{ parentID: blockID }}
                        className="sg-block__blockGroup__addChild"
                    >
                        <button
                            title="Ajouter des blocs à l'intérieur du groupe"
                            aria-label="Ajouter des blocs à l'intérieur du groupe"
                            className="sg-block__btn sg-block__btn--square"><FaPlus /></button>
                    </AddBlockContextMenu>
                }

                {(hasFocusWithin && !isActive) &&
                    <Button
                        className="sg-block__btn sg-block__btn--square sg-block__blockGroup__focusParent"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveBlock(blockID)
                        }}
                        title="Sélectionner le groupe parent"
                        ariaLabel="Sélectionner le groupe parent"
                    >
                        <MdCenterFocusStrong />
                    </Button>
                }
            </div >
        </>

    )
}

export default RowBlock;