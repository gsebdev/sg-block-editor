var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/BlockEditor.tsx
import { forwardRef as forwardRef2, useCallback as useCallback5, useEffect as useEffect6, useRef as useRef7 } from "react";

// src/context.tsx
import { createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";

// src/helpers.ts
var genBlockID = () => "_" + Math.random().toString(36).substr(2, 9);

// src/context.tsx
import { jsx } from "react/jsx-runtime";
var initialContext = {
  isDirty: false,
  setIsDirty: () => {
  },
  blocks: /* @__PURE__ */ new Map(),
  setBlocks: () => {
  },
  addBlock: () => {
  },
  updateBlock: () => {
  },
  deleteBlock: () => {
  },
  activeBlock: null,
  setActiveBlock: () => {
  },
  availableBlocks: {}
};
var blockEditorContext = createContext(initialContext);
var BlocksEditorContextProvider = forwardRef(({ children, data, onChange, availableBlocks }, ref) => {
  const [blocks, setBlocks] = useState(/* @__PURE__ */ new Map());
  const [isDirty, setIsDirty] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);
  const renderedRef = useRef({
    JSONValue: data != null ? data : [],
    HTMLValue: "",
    getJSONValue() {
      return this.JSONValue;
    },
    getHTMLValue() {
      return this.HTMLValue;
    }
  });
  useImperativeHandle(ref, () => renderedRef.current);
  useEffect(() => {
    if (isDirty) {
      const renderBlocksToJSONRecursive = (b) => {
        if (b.children && Array.isArray(b.children)) {
          return {
            type: b.type,
            value: b.value,
            children: b.children.map((child) => {
              const childBlock = blocks.get(child);
              if (childBlock) {
                return renderBlocksToJSONRecursive(childBlock);
              }
              return {
                type: "text",
                value: {
                  htmlContent: "<p>[ERROR] Block not found</p>"
                }
              };
            })
          };
        }
        return {
          type: b.type,
          value: b.value
        };
      };
      const updateValuesAsync = () => __async(void 0, null, function* () {
        const blocksValue = Array.from(blocks.values());
        let newRenderedHTML = "";
        const renderToHTML = (b) => __async(void 0, null, function* () {
          var _a;
          const { type, value, children: children2 } = b;
          const { render } = (_a = availableBlocks[type]) != null ? _a : {};
          if (render) {
            let renderedChildren;
            if (children2) {
              renderedChildren = [];
              for (const child of children2) {
                const childBlock = blocks.get(child);
                if (childBlock) {
                  renderedChildren.push(yield renderToHTML(childBlock));
                }
              }
            }
            const newValue = __spreadProps(__spreadValues({}, value != null ? value : {}), {
              children: renderedChildren
            });
            const html = yield render(newValue);
            return html;
          } else {
            return "<p>No render function provided</p>";
          }
        });
        const filteredBlocks = blocksValue.filter((block) => !block.parentID);
        for (const b of filteredBlocks) {
          newRenderedHTML += yield renderToHTML(b);
        }
        const newRenderedJSON = filteredBlocks.map((editorBlock) => renderBlocksToJSONRecursive(editorBlock));
        return {
          HTMLValue: newRenderedHTML,
          JSONValue: newRenderedJSON
        };
      });
      updateValuesAsync().then(({ HTMLValue, JSONValue }) => {
        renderedRef.current.JSONValue = JSONValue;
        renderedRef.current.HTMLValue = HTMLValue;
        onChange == null ? void 0 : onChange(JSONValue);
        setIsDirty(false);
      });
    }
  }, [blocks, isDirty, onChange]);
  useEffect(() => {
    renderedRef.current.JSONValue = data != null ? data : [];
    if (data) {
      const initialBlocks = /* @__PURE__ */ new Map();
      const parseBlocks = (b, parentID) => {
        const blockID = genBlockID();
        if (b.children && Array.isArray(b.children)) {
          const parsed = __spreadProps(__spreadValues({}, b), { blockID, parentID, children: [] });
          parsed.children = b.children.map((child) => parseBlocks(child, blockID));
          initialBlocks.set(blockID, parsed);
        } else {
          initialBlocks.set(blockID, __spreadProps(__spreadValues({}, b), {
            blockID,
            parentID,
            children: void 0
          }));
        }
        return blockID;
      };
      data.forEach((b) => parseBlocks(b));
      setBlocks(initialBlocks);
    }
  }, [data]);
  const updateBlock = useCallback((blockID, updatedData, shouldNotDirty) => {
    setBlocks((prevBlocks) => {
      var _a, _b;
      const newBlocks = new Map(prevBlocks);
      const blockToUpdate = newBlocks.get(blockID);
      if (!blockToUpdate) return prevBlocks;
      const newBlock = __spreadProps(__spreadValues(__spreadValues({}, blockToUpdate), updatedData), {
        value: __spreadValues(__spreadValues({}, (_a = blockToUpdate.value) != null ? _a : {}), (_b = updatedData.value) != null ? _b : {})
      });
      newBlocks.set(blockID, newBlock);
      return newBlocks;
    });
    if (!shouldNotDirty) setIsDirty(true);
  }, [setBlocks]);
  useEffect(() => {
    var _a;
    const blocksThatShouldHaveFocusWithin = [];
    if (activeBlock) {
      const activeBlockParent = (_a = blocks.get(activeBlock)) == null ? void 0 : _a.parentID;
      let nParentBlock = activeBlockParent ? blocks.get(activeBlockParent) : void 0;
      while (nParentBlock) {
        blocksThatShouldHaveFocusWithin.push(nParentBlock.blockID);
        nParentBlock = nParentBlock.parentID ? blocks.get(nParentBlock.parentID) : void 0;
      }
    }
    blocks.forEach((block) => {
      if (blocksThatShouldHaveFocusWithin.includes(block.blockID)) {
        if (!block.hasFocusWithin) updateBlock(block.blockID, { hasFocusWithin: true }, true);
      } else {
        if (block.hasFocusWithin) updateBlock(block.blockID, { hasFocusWithin: false }, true);
      }
    });
  }, [blocks, activeBlock, updateBlock]);
  const addBlock = useCallback((type, args) => {
    const blockID = genBlockID();
    const { parentID, position, reference } = args != null ? args : {};
    setBlocks((prevBlocks) => {
      var _a, _b, _c;
      const newBlocksArray = Array.from(prevBlocks);
      let insertIndex = newBlocksArray.length;
      if (reference) {
        insertIndex = newBlocksArray.findIndex(([id]) => id === reference);
        if (position === "after") insertIndex += 1;
      }
      newBlocksArray.splice(insertIndex, 0, [
        blockID,
        {
          type,
          value: type in availableBlocks ? (_a = availableBlocks[type]) == null ? void 0 : _a.defaultValue : void 0,
          blockID,
          parentID,
          children: ((_b = availableBlocks[type]) == null ? void 0 : _b.acceptChildren) ? [] : void 0
        }
      ]);
      if (parentID) {
        const parentBlock = (_c = newBlocksArray.find(([id]) => id === parentID)) == null ? void 0 : _c[1];
        if (parentBlock && Array.isArray(parentBlock.children)) {
          if (!parentBlock.children.includes(blockID)) {
            let childrenInsertIndex = parentBlock.children.length;
            if (reference) {
              childrenInsertIndex = parentBlock.children.findIndex((id) => id === reference);
              if (position === "after") childrenInsertIndex += 1;
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
  const deleteBlock = useCallback((blockID) => {
    let newSelectedBlock = null;
    setBlocks((prevBlock) => {
      const newBlocks = new Map(prevBlock);
      const blockToDelete = newBlocks.get(blockID);
      if (!blockToDelete) return newBlocks;
      if (blockToDelete == null ? void 0 : blockToDelete.parentID) newSelectedBlock = blockToDelete.parentID;
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
            parentBlock.children = parentBlock.children.filter((childID) => childID !== blockID);
          }
        }
      };
      const deleteBlockWithchildren = () => {
        getChildrenIDsRecursive(blockID);
        deleteInParentChildren();
        IDsToDelete.forEach((ID) => newBlocks.delete(ID));
      };
      deleteBlockWithchildren();
      return newBlocks;
    });
    setActiveBlock(newSelectedBlock);
    setIsDirty(true);
  }, []);
  return /* @__PURE__ */ jsx(blockEditorContext.Provider, { value: {
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
  }, children });
});
BlocksEditorContextProvider.displayName = "BlocksEditorContextProvider";
var useEditor = () => useContext(blockEditorContext);

// src/blocks/ImageBlock.tsx
import { useEffect as useEffect3, useRef as useRef4, useState as useState4 } from "react";
import { MdAlignHorizontalLeft, MdAlignHorizontalRight, MdAlignHorizontalCenter } from "react-icons/md";

// src/components/Button.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var Button = ({ children, className, variant, onClick, ariaLabel, title }) => {
  return /* @__PURE__ */ jsx2(
    "button",
    {
      onClick: (e) => {
        e.preventDefault();
        onClick == null ? void 0 : onClick(e);
      },
      "aria-label": ariaLabel,
      title,
      className: `sg-block__btn${variant ? " sg-block__btn--" + variant : ""}${className ? " " + className : ""}`,
      children
    }
  );
};
var Button_default = Button;

// src/Block.tsx
import clsx from "clsx";
import { createContext as createContext2, useCallback as useCallback2, useContext as useContext2, useEffect as useEffect2, useMemo, useRef as useRef3, useState as useState3 } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Resizable } from "re-resizable";

// src/components/SpacingTool.tsx
import { useRef as useRef2, useState as useState2 } from "react";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var SpacingTool = ({ value, onChange }) => {
  const [spacings, setSpacings] = useState2(value != null ? value : {});
  const directions = [
    "left",
    "right",
    "bottom",
    "top"
  ];
  const spacingToolRef = useRef2(null);
  const handleChange = (direction, value2) => {
    const newSpacings = __spreadProps(__spreadValues({}, spacings), {
      [direction]: value2
    });
    setSpacings(newSpacings);
  };
  const handleKeyDown = (e) => {
    var _a;
    if (e.key === "Enter") {
      (_a = spacingToolRef.current) == null ? void 0 : _a.querySelectorAll("input").forEach((el) => {
        el.blur();
      });
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx3("p", { children: /* @__PURE__ */ jsx3("b", { children: "Marges" }) }),
    /* @__PURE__ */ jsxs("div", { className: "sg-block__SpacingTool", ref: spacingToolRef, children: [
      directions.map((direction) => {
        var _a;
        return /* @__PURE__ */ jsx3(
          "div",
          {
            className: `sg-block__SpacingTool__${direction}`,
            children: /* @__PURE__ */ jsx3(
              "input",
              {
                type: "text",
                onChange: (e) => handleChange(direction, e.target.value),
                onBlur: () => onChange == null ? void 0 : onChange(spacings),
                onKeyDown: (e) => handleKeyDown(e),
                value: (_a = spacings[direction]) != null ? _a : "0px"
              }
            )
          },
          direction
        );
      }),
      /* @__PURE__ */ jsx3("div", { className: "sg-block__SpacingTool__center" })
    ] })
  ] });
};
var SpacingTool_default = SpacingTool;

// src/Block.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var alignStyles = {
  alignSelf: {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  },
  margin: {
    center: "0 auto",
    right: "0 0 0 auto",
    left: "0 auto 0 0"
  }
};
var AddBlockContextMenu = ({ className, children, args }) => {
  const { addBlock, availableBlocks } = useEditor();
  return /* @__PURE__ */ jsx4("div", { className: clsx(
    className
  ), children: /* @__PURE__ */ jsxs2(DropdownMenu.Root, { children: [
    /* @__PURE__ */ jsx4(DropdownMenu.Trigger, { asChild: true, children }),
    /* @__PURE__ */ jsxs2(
      DropdownMenu.Content,
      {
        sideOffset: 0,
        align: "center",
        className: "sg-block__addMenu__content",
        children: [
          /* @__PURE__ */ jsx4(
            DropdownMenu.Label,
            {
              className: "sg-block__addMenu__label",
              children: "Choisir un type"
            }
          ),
          Object.values(availableBlocks).map((block) => {
            const Icon = block.icon;
            return /* @__PURE__ */ jsxs2(
              DropdownMenu.Item,
              {
                onClick: () => addBlock(block.type, args),
                className: "sg-block__addMenu__item",
                children: [
                  !!Icon && /* @__PURE__ */ jsx4(Icon, { style: { marginRight: "4px" } }),
                  block.name
                ]
              },
              block.type
            );
          })
        ]
      }
    )
  ] }) });
};
var toolbarContext = createContext2([
  null,
  () => {
    throw new Error("Toolbar must be wrapped in context provider");
  }
]);
var BlockToolbarProvider = ({ children }) => {
  const [toolbar, setToolbar] = useState3(null);
  return /* @__PURE__ */ jsx4(toolbarContext.Provider, { value: [toolbar, setToolbar], children });
};
var BlockToolbarRenderer = ({ position, hasSpacingOptions, block }) => {
  const [toolbar] = useContext2(toolbarContext);
  const { updateBlock } = useEditor();
  const handleChangeSpacings = useCallback2((spacingsValue) => {
    updateBlock(blockID, {
      value: {
        spacings: spacingsValue
      }
    });
  }, [updateBlock, block.blockID]);
  const { value, blockID } = block;
  const { spacings } = value != null ? value : {};
  return /* @__PURE__ */ jsxs2("div", { className: `sg-block__block__toolbar${position === "top" ? " sg-block__block__toolbar--top" : ""}`, children: [
    toolbar != null ? toolbar : null,
    hasSpacingOptions && /* @__PURE__ */ jsx4(SpacingTool_default, { value: spacings, onChange: handleChangeSpacings })
  ] });
};
var ResizableWrapper = (_a) => {
  var _b = _a, { isResizable, children } = _b, props = __objRest(_b, ["isResizable", "children"]);
  var _a2, _b2;
  return /* @__PURE__ */ jsx4(
    Resizable,
    {
      enable: props.enable || (isResizable ? void 0 : false),
      className: props.className,
      maxWidth: `100%`,
      handleClasses: {
        right: "sg-block__block__resizeHandle sg-block__block__resizeHandle--right",
        left: "sg-block__block__resizeHandle sg-block__block__resizeHandle--left",
        top: "sg-block__block__resizeHandle sg-block__block__resizeHandle--top",
        bottom: "sg-block__block__resizeHandle sg-block__block__resizeHandle--bottom"
      },
      size: {
        width: ((_a2 = props.size) == null ? void 0 : _a2.width) || "100%",
        height: ((_b2 = props.size) == null ? void 0 : _b2.height) || "auto"
      },
      style: props.style,
      onResizeStop: props.onResizeStop,
      onResize: props.onResize,
      onResizeStart: props.onResizeStart,
      children
    }
  );
};
var BlockToolbar = ({ children }) => {
  const [, setToolbar] = useContext2(toolbarContext);
  useEffect2(() => {
    setToolbar(children);
    return () => {
      setToolbar(null);
    };
  }, [children]);
  return null;
};
var BlockToolbarColumn = ({ children, title }) => {
  return /* @__PURE__ */ jsxs2("div", { children: [
    /* @__PURE__ */ jsx4("p", { className: "sg-block__block__toolbar__column__title", children: /* @__PURE__ */ jsx4("b", { children: title }) }),
    /* @__PURE__ */ jsx4("div", { className: "sg-block__block__toolbar__column", children })
  ] });
};
var Block = ({ block, className, horizontalFlow }) => {
  var _a, _b, _c, _d, _e;
  const [toolbarPosition, setToolbarPosition] = useState3("bottom");
  const { blocks, activeBlock, setActiveBlock, deleteBlock, availableBlocks, updateBlock } = useEditor();
  const blockRef = useRef3(null);
  const { blockID, hasFocusWithin, parentID, type, value } = block != null ? block : {};
  const isActive = blockID === activeBlock;
  const { isResizable, hasSpacingOptions, BlockEditorElement } = useMemo(() => {
    var _a2, _b2, _c2;
    if (!type) return {};
    return {
      isResizable: ((_a2 = availableBlocks[type]) == null ? void 0 : _a2.isResizable) || false,
      hasSpacingOptions: !!((_b2 = availableBlocks[type]) == null ? void 0 : _b2.hasSpacingOptions),
      BlockEditorElement: (_c2 = availableBlocks[type]) == null ? void 0 : _c2.editor
    };
  }, [availableBlocks, parentID]);
  const scrollHandler = useCallback2(() => {
    var _a2, _b2;
    const { top, bottom } = (_b2 = (_a2 = blockRef.current) == null ? void 0 : _a2.getBoundingClientRect()) != null ? _b2 : {};
    if (bottom !== void 0 && top !== void 0) {
      setToolbarPosition(window.innerHeight - bottom > top ? "bottom" : "top");
    }
  }, [blockRef, setToolbarPosition]);
  useEffect2(() => {
    if (blockRef.current) {
      if (isActive) {
        scrollHandler();
        window.addEventListener("scroll", scrollHandler, true);
        blockRef.current.focus();
      } else {
        window.removeEventListener("scroll", scrollHandler, true);
      }
    }
    return () => window.removeEventListener("scroll", scrollHandler, true);
  }, [isActive, blockRef]);
  const handleClickCapture = useCallback2((e) => {
    if (activeBlock !== blockID && !hasFocusWithin) {
      e.preventDefault();
      e.stopPropagation();
      setActiveBlock(blockID != null ? blockID : null);
    }
  }, [activeBlock, hasFocusWithin, blockID, setActiveBlock]);
  if (!block) return null;
  if (!blockID) return null;
  if (!BlockEditorElement) return null;
  return /* @__PURE__ */ jsx4(BlockToolbarProvider, { children: /* @__PURE__ */ jsx4(
    "div",
    {
      ref: blockRef,
      style: {
        display: "contents"
      },
      onClickCapture: handleClickCapture,
      children: /* @__PURE__ */ jsxs2(
        ResizableWrapper,
        {
          isResizable: !!isResizable && isActive,
          size: {
            width: isResizable && (value == null ? void 0 : value.width) ? value == null ? void 0 : value.width : "100%",
            height: isResizable && (value == null ? void 0 : value.height) ? value == null ? void 0 : value.height : "auto"
          },
          enable: isActive && typeof isResizable === "object" ? isResizable : void 0,
          onResizeStop: (e, dir, ref, d) => {
            var _a2, _b2;
            const containerWidth = (_b2 = (_a2 = ref.parentElement) == null ? void 0 : _a2.parentElement) == null ? void 0 : _b2.clientWidth;
            const newWidth = ref.offsetWidth;
            const newHeight = ref.offsetHeight;
            updateBlock(blockID, {
              value: {
                width: newWidth === containerWidth ? "100%" : d.width !== 0 ? newWidth + "px" : value == null ? void 0 : value.width,
                height: d.height !== 0 ? newHeight + "px" : value == null ? void 0 : value.height
              }
            });
          },
          style: {
            alignSelf: (value == null ? void 0 : value.align) ? alignStyles.alignSelf[value.align] : void 0,
            margin: (value == null ? void 0 : value.align) ? alignStyles.margin[value.align] : void 0,
            paddingTop: (_a = value == null ? void 0 : value.spacings) == null ? void 0 : _a.top,
            paddingBottom: (_b = value == null ? void 0 : value.spacings) == null ? void 0 : _b.bottom,
            paddingLeft: (_c = value == null ? void 0 : value.spacings) == null ? void 0 : _c.left,
            paddingRight: (_d = value == null ? void 0 : value.spacings) == null ? void 0 : _d.right
          },
          className: clsx(
            "sg-block__block",
            !hasFocusWithin && !activeBlock && (!parentID || ((_e = blocks.get(parentID)) == null ? void 0 : _e.hasFocusWithin)) ? "sg-block__block--hover" : "",
            isActive ? "sg-block__block--active" : "",
            !hasFocusWithin && !isActive && activeBlock && "sg-block__block--inactive",
            className
          ),
          children: [
            isActive && /* @__PURE__ */ jsx4(Fragment, { children: /* @__PURE__ */ jsx4(
              AddBlockContextMenu,
              {
                args: { position: "before", reference: blockID, parentID },
                className: "sg-block__contextMenu",
                children: /* @__PURE__ */ jsx4(
                  "button",
                  {
                    title: "Ajouter un \xE9l\xE9ment avant le bloc actif",
                    "aria-label": "Ajotuer un \xE9l\xE9ment avant le bloc actif",
                    className: `sg-block__btn__addBlock sg-block__btn__addBlock--${horizontalFlow ? "left" : "top"}`,
                    children: /* @__PURE__ */ jsx4(FaPlus, {})
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsx4(BlockEditorElement, { block, isActive }),
            isActive && /* @__PURE__ */ jsx4(BlockToolbarRenderer, { position: toolbarPosition, hasSpacingOptions, block }),
            isActive && /* @__PURE__ */ jsxs2(Fragment, { children: [
              /* @__PURE__ */ jsx4(
                "button",
                {
                  className: "sg-block__btn sg-block__btn--square sg-block__btn__deleteBlock",
                  onClick: () => deleteBlock(blockID),
                  "aria-label": "Supprimer le block actif: " + type,
                  title: "Supprimer le block actif: " + type,
                  children: /* @__PURE__ */ jsx4(RiDeleteBin5Line, {})
                }
              ),
              /* @__PURE__ */ jsx4(
                AddBlockContextMenu,
                {
                  args: { position: "after", reference: blockID, parentID },
                  className: "sg-block__contextMenu",
                  children: /* @__PURE__ */ jsx4(
                    "button",
                    {
                      title: "Ajouter un \xE9l\xE9ment apr\xE8s le bloc actif",
                      "aria-label": "Ajouter un \xE9l\xE9ment apr\xE8s le bloc actif",
                      className: `sg-block__btn__addBlock sg-block__btn__addBlock--${horizontalFlow ? "right" : "bottom"}`,
                      children: /* @__PURE__ */ jsx4(FaPlus, {})
                    }
                  )
                }
              )
            ] })
          ]
        }
      )
    }
  ) });
};
var Block_default = Block;

// src/blocks/ImageBlock.tsx
import { FaImage } from "react-icons/fa6";
import { Fragment as Fragment2, jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
var DefaultImageSelector = ({ children, value, onSelect, className }) => {
  const [currentImage, setCurrentImage] = useState4(value);
  const inputRef = useRef4(null);
  useEffect3(() => {
    if (onSelect && currentImage && currentImage.src !== (value == null ? void 0 : value.src)) onSelect(currentImage);
  }, [currentImage]);
  const handleImageclick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e2) {
        var _a2;
        if ((_a2 = e2.target) == null ? void 0 : _a2.result) {
          const dataUrl = e2.target.result.toString();
          setCurrentImage({ src: dataUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  return /* @__PURE__ */ jsxs3("div", { className, onClick: handleImageclick, children: [
    children,
    /* @__PURE__ */ jsx5("input", { type: "file", hidden: true, ref: inputRef, accept: ".jpg, .jpeg, .png", onChange: handleFileChange })
  ] });
};
var ImageSelectorWrapper = ({
  children,
  ImageSelector,
  value,
  onSelect,
  className
}) => {
  if (ImageSelector) return /* @__PURE__ */ jsx5(
    ImageSelector,
    {
      value,
      onSelect,
      className,
      children
    }
  );
  return /* @__PURE__ */ jsx5(
    DefaultImageSelector,
    {
      value,
      onSelect,
      className,
      children
    }
  );
};
var ImagePreview = ({ src, aspect, align }) => {
  return /* @__PURE__ */ jsx5(Fragment2, { children: src ? /* @__PURE__ */ jsx5(
    "img",
    {
      className: "sg-block__blockImage__img",
      src,
      style: {
        aspectRatio: aspect,
        textAlign: align
      },
      alt: "Selected Image"
    }
  ) : /* @__PURE__ */ jsx5("div", { className: "sg-block__blockImage__placeholder", children: /* @__PURE__ */ jsx5(FaImage, {}) }) });
};
var ImageBlock = ({ block, ImageSelector }) => {
  var _a, _b;
  const [imagePreview, setImagePreview] = useState4((_b = (_a = block.value) == null ? void 0 : _a.image) == null ? void 0 : _b.src);
  const { updateBlock } = useEditor();
  const { blockID, value } = block;
  const { image, aspect, height, align } = value != null ? value : {};
  const updateImageBlock = (newValue) => {
    updateBlock(blockID, {
      value: __spreadValues(__spreadValues({}, value), newValue)
    });
  };
  const handleImageSelection = (newValue, imagePreviewSrc = void 0) => {
    if (newValue) {
      updateImageBlock({
        image: {
          id: newValue.id,
          src: newValue.src
        }
      });
      setImagePreview(imagePreviewSrc != null ? imagePreviewSrc : newValue.src);
    }
  };
  useEffect3(() => {
    if (aspect && height !== "auto") {
      updateImageBlock({
        aspect: void 0
      });
    }
  }, [height]);
  const aspects = ["auto", "fill", 4 / 3, 3 / 2, 16 / 9, 1];
  const aspectsLabels = ["original", "Remplir", "4:3", "3:2", "16:9", "1:1"];
  const aligns = ["left", "center", "right"];
  const alignsIcons = [
    /* @__PURE__ */ jsx5(MdAlignHorizontalLeft, {}, "alignLeft"),
    /* @__PURE__ */ jsx5(MdAlignHorizontalCenter, {}, "alignCenter"),
    /* @__PURE__ */ jsx5(MdAlignHorizontalRight, {}, "alignRight")
  ];
  return /* @__PURE__ */ jsxs3(Fragment2, { children: [
    /* @__PURE__ */ jsxs3(BlockToolbar, { children: [
      /* @__PURE__ */ jsx5(
        BlockToolbarColumn,
        {
          title: "Aspect",
          children: aspects.map((value2, index) => /* @__PURE__ */ jsx5(
            Button_default,
            {
              variant: aspect === value2 || value2 === "fill" && height === "100%" ? "selected" : void 0,
              onClick: () => updateImageBlock({
                aspect: aspect === value2 || value2 === "fill" ? void 0 : value2,
                height: value2 === "fill" ? "100%" : "auto"
              }),
              children: aspectsLabels[index]
            },
            value2
          ))
        }
      ),
      /* @__PURE__ */ jsx5(
        BlockToolbarColumn,
        {
          title: "Alignement",
          children: aligns.map((value2, index) => /* @__PURE__ */ jsx5(
            Button_default,
            {
              variant: align === value2 ? "selected" : "",
              onClick: () => updateImageBlock({ align: align === value2 ? void 0 : value2 }),
              children: alignsIcons[index]
            },
            value2
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsx5(
      ImageSelectorWrapper,
      {
        className: "sg-block__blockImage__selectorWrapper",
        value: image,
        onSelect: handleImageSelection,
        ImageSelector,
        children: /* @__PURE__ */ jsx5(ImagePreview, { src: imagePreview, align, aspect })
      }
    )
  ] });
};
var ImageBlock_default = ImageBlock;

// src/default-blocks.tsx
import { FaRegImage } from "react-icons/fa6";
import { FaAlignJustify } from "react-icons/fa6";
import { RxGroup } from "react-icons/rx";

// src/blocks/TextBlock.tsx
import { useMemo as useMemo2 } from "react";
import clsx2 from "clsx";
import { useCallback as useCallback3, useEffect as useEffect4, useRef as useRef5 } from "react";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { ContentState, convertToRaw } from "draft-js";
import { Fragment as Fragment3, jsx as jsx6 } from "react/jsx-runtime";
var TextBlock = ({ block, isActive, toolbarOptions = textBlockToolbarOptions }) => {
  const { updateBlock } = useEditor();
  const { blockID, value } = block;
  const editorRef = useRef5(null);
  const initialEditorState = useMemo2(() => {
    var _a;
    const html = "<p>Nouveau bloc de <strong>Texte</strong> \u{1F600}</p>";
    const contentBlock = htmlToDraft((_a = value == null ? void 0 : value.htmlContent) != null ? _a : html);
    return convertToRaw(ContentState.createFromBlockArray(contentBlock.contentBlocks));
  }, []);
  useEffect4(() => {
    if (editorRef.current && isActive) {
      editorRef.current.focusEditor();
    }
  }, [isActive]);
  const handleChange = useCallback3((state) => {
    updateBlock(blockID, {
      value: {
        htmlContent: draftToHtml(convertToRaw(state.getCurrentContent()))
      }
    });
  }, [blockID, updateBlock]);
  return /* @__PURE__ */ jsx6(Fragment3, { children: /* @__PURE__ */ jsx6("div", { className: clsx2(
    "sg-block__blockText",
    isActive && "sg-block__blockText--active"
  ), children: /* @__PURE__ */ jsx6(
    Editor,
    {
      ref: editorRef,
      onEditorStateChange: handleChange,
      initialContentState: initialEditorState,
      toolbarOnFocus: true,
      wrapperClassName: "sg-text__editor-container",
      toolbarClassName: "sg-text__toolbar",
      toolbar: toolbarOptions
    }
  ) }) });
};
var textBlockToolbarOptions = {
  options: [
    "inline",
    "blockType",
    "fontSize",
    "list",
    "textAlign",
    "colorPicker",
    "link",
    "emoji",
    "history"
  ],
  inline: {
    inDropdown: false,
    options: ["bold", "italic", "underline"]
  },
  list: {
    inDropdown: false,
    options: ["unordered", "ordered"],
    title: "Liste"
  },
  textAlign: {
    inDropdown: true,
    options: ["left", "center", "right"],
    title: "Alignement"
  },
  link: { inDropdown: false },
  history: { inDropdown: false },
  embedded: {},
  fontFamily: {},
  fontSize: {
    options: [
      "14px",
      "16px",
      "18px",
      "20px"
    ],
    title: "Taille de police"
  },
  blockType: {
    options: [
      "Normal",
      "H1",
      "H2",
      "H3",
      "H4",
      "Blockquote"
    ],
    title: "Format"
  }
};
var TextBlock_default = TextBlock;

// src/blocks/GroupBlock.tsx
import { useCallback as useCallback4, useEffect as useEffect5, useRef as useRef6, useState as useState5 } from "react";
import clsx3 from "clsx";
import { BsArrowsExpand, BsArrowsExpandVertical } from "react-icons/bs";
import { MdCenterFocusStrong } from "react-icons/md";
import { FaPlus as FaPlus2 } from "react-icons/fa6";
import { Fragment as Fragment4, jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
var RowBlock = ({ block, isActive }) => {
  var _a;
  const minChildWidth = 320;
  const { blockID, hasFocusWithin, value, children } = block;
  const { flow, height, template } = value != null ? value : {};
  const [groupWidth, setGroupWidth] = useState5(null);
  const [currentTemplate, setCurrentTemplate] = useState5(template || []);
  const [isResizing, setIsResizing] = useState5(null);
  const groupRef = useRef6(null);
  const { blocks, setActiveBlock, updateBlock } = useEditor();
  const prevXRef = useRef6(null);
  const isResizable = !!(children == null ? void 0 : children.length) && groupWidth ? groupWidth > minChildWidth * (children == null ? void 0 : children.length) : false;
  const handleResizeStart = useCallback4((e, indexEl) => {
    if (isResizable) {
      setIsResizing(indexEl);
      prevXRef.current = e.clientX;
      document.body.style.userSelect = "none";
    }
  }, [prevXRef, setIsResizing, groupWidth, minChildWidth, isResizable]);
  useEffect5(() => {
    if (children && (children == null ? void 0 : children.length) !== currentTemplate.length) {
      const newTemplate = Array(children.length).fill(100 / (children == null ? void 0 : children.length));
      updateBlock(blockID, {
        value: {
          template: newTemplate
        }
      });
    }
  }, [children == null ? void 0 : children.length]);
  useEffect5(() => {
    if (isResizing !== null) {
      const currentTemplateRef = { current: null };
      const handleResize = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const deltaX = prevXRef.current ? e.clientX - prevXRef.current : 0;
        const deltaPercentage = groupWidth ? deltaX / groupWidth * 100 : 0;
        if (groupWidth)
          setCurrentTemplate((prevTemplate) => {
            const newTemplate = [...prevTemplate];
            newTemplate[isResizing] += deltaPercentage;
            newTemplate[isResizing + 1] -= deltaPercentage;
            if (newTemplate[isResizing] / 100 * groupWidth < minChildWidth || newTemplate[isResizing + 1] / 100 * groupWidth < minChildWidth) {
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
        document.body.style.userSelect = "";
        if (currentTemplateRef.current) {
          updateBlock(blockID, {
            value: {
              template: currentTemplateRef.current.map((val) => Math.floor(val))
            }
          });
        }
      };
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);
      return () => {
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, groupWidth]);
  useEffect5(() => {
    setCurrentTemplate(template || []);
  }, [template]);
  useEffect5(() => {
    var _a2;
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
    setGroupWidth(((_a2 = groupRef.current) == null ? void 0 : _a2.getBoundingClientRect().width) || null);
    return () => {
      if (groupRef.current) {
        resizeObserver.unobserve(groupRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);
  useEffect5(() => {
    if (children)
      updateBlock(blockID, {
        value: {
          template: children.map(() => 100 / children.length)
        }
      });
  }, [children]);
  return /* @__PURE__ */ jsxs4(Fragment4, { children: [
    /* @__PURE__ */ jsx7(BlockToolbar, { children: /* @__PURE__ */ jsxs4(
      BlockToolbarColumn,
      {
        title: "Direction",
        children: [
          /* @__PURE__ */ jsx7(
            Button_default,
            {
              variant: flow === "vertical" ? void 0 : "selected",
              onClick: () => updateBlock(blockID, {
                value: {
                  flow: "horizontal"
                }
              }),
              title: "Empiler les blocs horizontalement",
              ariaLabel: "Empiler les blocs horizontalement",
              children: /* @__PURE__ */ jsx7(BsArrowsExpandVertical, {})
            }
          ),
          /* @__PURE__ */ jsx7(
            Button_default,
            {
              variant: flow !== "vertical" ? void 0 : "selected",
              onClick: () => updateBlock(blockID, {
                value: {
                  flow: "vertical"
                }
              }),
              title: "Empiler les blocs verticalement",
              ariaLabel: "Empiler les blocs verticalement",
              children: /* @__PURE__ */ jsx7(BsArrowsExpand, {})
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs4(
      "div",
      {
        className: clsx3(
          "sg-block__blockGroup",
          block.hasFocusWithin && "sg-block__blockGroup--focusWithin",
          flow === "vertical" ? "sg-block__blockGroup--vertical" : "sg-block__blockGroup--horizontal",
          height && (typeof height === "number" || height.indexOf("px") !== -1) ? "sg-block__blockGroup--fixedHeight" : ""
        ),
        ref: groupRef,
        children: [
          !!children && ((_a = block.children) == null ? void 0 : _a.map((childID, indexEl) => /* @__PURE__ */ jsxs4(
            "div",
            {
              className: "sg-block__blockGroup__childContainer",
              style: {
                flex: (currentTemplate == null ? void 0 : currentTemplate[indexEl]) + "% 1 0",
                minWidth: minChildWidth + "px"
              },
              children: [
                /* @__PURE__ */ jsx7(
                  Block_default,
                  {
                    horizontalFlow: flow !== "vertical",
                    block: blocks.get(childID)
                  }
                ),
                isActive && indexEl !== children.length - 1 && /* @__PURE__ */ jsx7(
                  "div",
                  {
                    className: clsx3(
                      "sg-block__blockGroup__resizeHandle",
                      (!isResizable || flow === "vertical") && "sg-block__blockGroup__resizeHandle--disabled"
                    ),
                    onMouseDown: (e) => handleResizeStart(e, indexEl)
                  }
                )
              ]
            },
            childID
          ))),
          !(children == null ? void 0 : children.length) && /* @__PURE__ */ jsx7("div", { className: "sg-block__blockGroup__placeholder" }),
          !!isActive && /* @__PURE__ */ jsx7(
            AddBlockContextMenu,
            {
              args: { parentID: blockID },
              className: "sg-block__blockGroup__addChild",
              children: /* @__PURE__ */ jsx7(
                "button",
                {
                  title: "Ajouter des blocs \xE0 l'int\xE9rieur du groupe",
                  "aria-label": "Ajouter des blocs \xE0 l'int\xE9rieur du groupe",
                  className: "sg-block__btn sg-block__btn--square",
                  children: /* @__PURE__ */ jsx7(FaPlus2, {})
                }
              )
            }
          ),
          hasFocusWithin && !isActive && /* @__PURE__ */ jsx7(
            Button_default,
            {
              className: "sg-block__btn sg-block__btn--square sg-block__blockGroup__focusParent",
              onClick: (e) => {
                e.stopPropagation();
                setActiveBlock(blockID);
              },
              title: "S\xE9lectionner le groupe parent",
              ariaLabel: "S\xE9lectionner le groupe parent",
              children: /* @__PURE__ */ jsx7(MdCenterFocusStrong, {})
            }
          )
        ]
      }
    )
  ] });
};
var GroupBlock_default = RowBlock;

// src/default-blocks.tsx
var default_blocks_default = {
  text: {
    name: "Text",
    type: "text",
    icon: FaAlignJustify,
    render: (value) => {
      return value.htmlContent;
    },
    editor: TextBlock_default,
    defaultValue: {
      htmlContent: "<p>Nouveau Bloc de Texte</p>"
    },
    isResizable: {
      right: true,
      left: true,
      top: false,
      bottom: false,
      bottomLeft: false,
      bottomRight: false,
      topLeft: false,
      topRight: false
    },
    hasSpacingOptions: true
  },
  image: {
    name: "Image",
    type: "image",
    icon: FaRegImage,
    render: void 0,
    editor: ImageBlock_default,
    isResizable: true,
    hasSpacingOptions: true
  },
  group: {
    name: "Group",
    type: "group",
    icon: RxGroup,
    render: void 0,
    editor: GroupBlock_default,
    acceptChildren: true,
    isResizable: false,
    defaultValue: {
      flow: "horizontal"
    },
    hasSpacingOptions: true
  }
};

// src/BlockEditor.tsx
import { FaPlus as FaPlus3 } from "react-icons/fa6";
import clsx4 from "clsx";
import { jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
var BlockEditorContent = () => {
  const { blocks, setActiveBlock } = useEditor();
  const editorRef = useRef7(null);
  const handleClickOutside = useCallback5((e) => {
    if (editorRef.current && !editorRef.current.contains(e.target)) {
      setActiveBlock(null);
    }
  }, [setActiveBlock]);
  useEffect6(() => {
    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);
  return /* @__PURE__ */ jsx8("div", { ref: editorRef, className: clsx4(
    "sg-block__editor__content",
    blocks.size === 0 ? "sg-block__editor__content--empty" : ""
  ), children: /* @__PURE__ */ jsxs5("div", { children: [
    !!blocks && Array.from(blocks.values()).filter((block) => !block.parentID).map((block) => /* @__PURE__ */ jsx8(Block_default, { block }, block.blockID)),
    blocks.size === 0 && /* @__PURE__ */ jsx8(AddBlockContextMenu, { children: /* @__PURE__ */ jsxs5("button", { className: "sg-block__btn", children: [
      /* @__PURE__ */ jsx8(FaPlus3, { style: { marginRight: 4 } }),
      "Ajouter du contenu"
    ] }) })
  ] }) });
};
var BlockEditor_default = forwardRef2(function BlocksEditor({ data, onChange, extraBlocks }, ref) {
  const blocks = __spreadValues(__spreadValues({}, default_blocks_default), extraBlocks);
  return /* @__PURE__ */ jsx8(BlocksEditorContextProvider, { data, onChange, ref, availableBlocks: blocks, children: /* @__PURE__ */ jsx8(BlockEditorContent, {}) });
});

// src/definitions.tsx
var definitions_exports = {};
export {
  BlockEditor_default as BlockEditor,
  definitions_exports as Definitions,
  ImageBlock_default as ImageBlock,
  GroupBlock_default as RowBlock,
  TextBlock_default as TextBlock,
  default_blocks_default as defaultBlocks,
  useEditor
};
//# sourceMappingURL=index.mjs.map