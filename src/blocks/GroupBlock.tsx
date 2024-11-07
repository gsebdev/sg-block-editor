import React from "react";
import clsx from "clsx";
import Block, { AddBlockContextMenu, BlockToolbar, BlockToolbarColumn } from "../Block";
import { BsArrowsExpand, BsArrowsExpandVertical } from "react-icons/bs";
import { BlockType, EditorParsedBlock } from "../definitions";
import { useEditor } from "../context";
import Button from "../components/Button";
import { MdCenterFocusStrong } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

type GroupBlockType = BlockType<{
    flow: 'horizontal' | 'vertical'
}>
export interface RowBlockProps { 
    block: EditorParsedBlock<GroupBlockType>, 
    isActive?: boolean 
}

const RowBlock: React.FC<RowBlockProps> = ({ block, isActive }) => {
    const { blocks, setActiveBlock, updateBlock } = useEditor();

    const { blockID, hasFocusWithin, value, children } = block;

    const { flow, height } = value ?? {};

    return (
        <>
            <BlockToolbar>
                <BlockToolbarColumn>
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
            <div className={clsx(
                "sg-block__blockGroup",
                block.hasFocusWithin && 'sg-block__blockGroup--focusWithin',
                flow === "vertical" ? 'sg-block__blockGroup--vertical' : 'sg-block__blockGroup--horizontal',
                height && (typeof height === 'number' || height.indexOf('px') !== -1) ? 'sg-block__blockGroup--fixedHeight' : ''
            )}>
                {!!children &&
                    block.children.map(childID => (
                        <Block
                            horizontalFlow={flow !== 'vertical'}
                            key={childID}
                            block={blocks.get(childID)}
                        />
                    ))
                }
                {!children?.length &&
                    <div className="sg-block__blockGroup__placeholder" />
                }
                {!!isActive &&
                    <AddBlockContextMenu
                        args={{ parentID: blockID }}
                    >
                        <button
                            title="Ajouter des blocs à l'intérieur du groupe"
                            aria-label="Ajouter des blocs à l'intérieur du groupe"
                            className="sg-block__btn sg-block__btn--square sg-block__blockGroup__addChild"><FaPlus /></button>
                    </AddBlockContextMenu>
                }

                {(hasFocusWithin && !isActive) &&
                    <Button
                        className="sg-block__btn sg-block__btn--square sg-block__blockGroup__focusParent"
                        onClick={() => setActiveBlock(blockID)}
                        title="Sélectionner le groupe parent"
                        ariaLabel="Sélectionner le groupe parent"
                    >
                        <MdCenterFocusStrong />
                    </Button>
                }
            </div>
        </>

    )
}

export default RowBlock;