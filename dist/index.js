"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BlockEditor: () => BlockEditor_default,
  Definitions: () => definitions_exports,
  ImageBlock: () => ImageBlock_default,
  RowBlock: () => GroupBlock_default,
  TextBlock: () => TextBlock_default,
  defaultBlocks: () => default_blocks_default,
  useEditor: () => useEditor
});
module.exports = __toCommonJS(src_exports);

// src/BlockEditor.tsx
var import_react21 = require("react");

// src/context.tsx
var import_react = require("react");

// src/helpers.ts
var genBlockID = () => "_" + Math.random().toString(36).substr(2, 9);

// src/context.tsx
var import_jsx_runtime = require("react/jsx-runtime");
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
var blockEditorContext = (0, import_react.createContext)(initialContext);
var BlocksEditorContextProvider = (0, import_react.forwardRef)(({ children, data, onChange, availableBlocks }, ref) => {
  const [blocks, setBlocks] = (0, import_react.useState)(/* @__PURE__ */ new Map());
  const [isDirty, setIsDirty] = (0, import_react.useState)(false);
  const [activeBlock, setActiveBlock] = (0, import_react.useState)(null);
  const renderedRef = (0, import_react.useRef)({
    JSONValue: data != null ? data : [],
    HTMLValue: "",
    getJSONValue() {
      return this.JSONValue;
    },
    getHTMLValue() {
      return this.HTMLValue;
    }
  });
  (0, import_react.useImperativeHandle)(ref, () => renderedRef.current);
  (0, import_react.useEffect)(() => {
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
        var _a;
        const blocksValue = Array.from(blocks.values());
        let newRenderedHTML = "";
        for (const b of blocksValue) {
          const { type, value } = b;
          const { render } = (_a = availableBlocks[type]) != null ? _a : {};
          if (render) {
            const next = yield render(value);
            newRenderedHTML += next;
          } else {
            newRenderedHTML += "<p>No render function provided</p>";
          }
        }
        const newRenderedJSON = blocksValue.filter((block) => !block.parentID).map((editorBlock) => renderBlocksToJSONRecursive(editorBlock));
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
  (0, import_react.useEffect)(() => {
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
  const updateBlock = (0, import_react.useCallback)((blockID, updatedData, shouldNotDirty) => {
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
  (0, import_react.useEffect)(() => {
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
  const addBlock = (0, import_react.useCallback)((type, args) => {
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
  const deleteBlock = (0, import_react.useCallback)((blockID) => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(blockEditorContext.Provider, { value: {
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
var useEditor = () => (0, import_react.useContext)(blockEditorContext);

// src/blocks/ImageBlock.tsx
var import_react4 = require("react");
var import_md = require("react-icons/md");

// src/components/Button.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Button = ({ children, className, variant, onClick, ariaLabel, title }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_clsx = __toESM(require("clsx"));
var import_react3 = require("react");
var import_fa6 = require("react-icons/fa6");
var import_ri = require("react-icons/ri");
var DropdownMenu = __toESM(require("@radix-ui/react-dropdown-menu"));
var import_re_resizable = require("re-resizable");

// src/components/SpacingTool.tsx
var import_react2 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var SpacingTool = ({ value, onChange }) => {
  const [spacings, setSpacings] = (0, import_react2.useState)(value != null ? value : {});
  const directions = [
    "left",
    "right",
    "bottom",
    "top"
  ];
  const spacingToolRef = (0, import_react2.useRef)(null);
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: "Marges" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sg-block__SpacingTool", ref: spacingToolRef, children: [
      directions.map((direction) => {
        var _a;
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: `sg-block__SpacingTool__${direction}`,
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "sg-block__SpacingTool__center" })
    ] })
  ] });
};
var SpacingTool_default = SpacingTool;

// src/Block.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: (0, import_clsx.default)(
    className
  ), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(DropdownMenu.Root, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(DropdownMenu.Trigger, { asChild: true, children }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      DropdownMenu.Content,
      {
        sideOffset: 0,
        align: "center",
        className: "sg-block__addMenu__content",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            DropdownMenu.Label,
            {
              className: "sg-block__addMenu__label",
              children: "Choisir un type"
            }
          ),
          Object.values(availableBlocks).map((block) => {
            const Icon = block.icon;
            return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              DropdownMenu.Item,
              {
                onClick: () => addBlock(block.type, args),
                className: "sg-block__addMenu__item",
                children: [
                  !!Icon && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { style: { marginRight: "4px" } }),
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
var toolbarContext = (0, import_react3.createContext)([
  null,
  () => {
    throw new Error("Toolbar must be wrapped in context provider");
  }
]);
var BlockToolbarProvider = ({ children }) => {
  const [toolbar, setToolbar] = (0, import_react3.useState)(null);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(toolbarContext.Provider, { value: [toolbar, setToolbar], children });
};
var BlockToolbarRenderer = ({ position, hasSpacingOptions, block }) => {
  const [toolbar] = (0, import_react3.useContext)(toolbarContext);
  const { updateBlock } = useEditor();
  const handleChangeSpacings = (0, import_react3.useCallback)((spacingsValue) => {
    updateBlock(blockID, {
      value: {
        spacings: spacingsValue
      }
    });
  }, [updateBlock, block.blockID]);
  const { value, blockID } = block;
  const { spacings } = value != null ? value : {};
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: `sg-block__block__toolbar${position === "top" ? " sg-block__block__toolbar--top" : ""}`, children: [
    toolbar != null ? toolbar : null,
    hasSpacingOptions && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SpacingTool_default, { value: spacings, onChange: handleChangeSpacings })
  ] });
};
var ResizableWrapper = (_a) => {
  var _b = _a, { isResizable, children } = _b, props = __objRest(_b, ["isResizable", "children"]);
  var _a2, _b2;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_re_resizable.Resizable,
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
  const [, setToolbar] = (0, import_react3.useContext)(toolbarContext);
  (0, import_react3.useEffect)(() => {
    setToolbar(children);
    return () => {
      setToolbar(null);
    };
  }, [children]);
  return null;
};
var BlockToolbarColumn = ({ children, title }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "sg-block__block__toolbar__column__title", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("b", { children: title }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "sg-block__block__toolbar__column", children })
  ] });
};
var Block = ({ block, className, horizontalFlow }) => {
  var _a, _b, _c, _d, _e;
  const [toolbarPosition, setToolbarPosition] = (0, import_react3.useState)("bottom");
  const { blocks, activeBlock, setActiveBlock, deleteBlock, availableBlocks, updateBlock } = useEditor();
  const blockRef = (0, import_react3.useRef)(null);
  const { blockID, hasFocusWithin, parentID, type, value } = block != null ? block : {};
  const isActive = blockID === activeBlock;
  const { isResizable, hasSpacingOptions, BlockEditorElement } = (0, import_react3.useMemo)(() => {
    var _a2, _b2, _c2;
    if (!type) return {};
    return {
      isResizable: ((_a2 = availableBlocks[type]) == null ? void 0 : _a2.isResizable) || false,
      hasSpacingOptions: !!((_b2 = availableBlocks[type]) == null ? void 0 : _b2.hasSpacingOptions),
      BlockEditorElement: (_c2 = availableBlocks[type]) == null ? void 0 : _c2.editor
    };
  }, [availableBlocks, parentID]);
  const scrollHandler = (0, import_react3.useCallback)(() => {
    var _a2, _b2;
    const { top, bottom } = (_b2 = (_a2 = blockRef.current) == null ? void 0 : _a2.getBoundingClientRect()) != null ? _b2 : {};
    if (bottom !== void 0 && top !== void 0) {
      setToolbarPosition(window.innerHeight - bottom > top ? "bottom" : "top");
    }
  }, [blockRef, setToolbarPosition]);
  (0, import_react3.useEffect)(() => {
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
  const handleClickCapture = (0, import_react3.useCallback)((e) => {
    if (activeBlock !== blockID && !hasFocusWithin) {
      e.preventDefault();
      e.stopPropagation();
      setActiveBlock(blockID != null ? blockID : null);
    }
  }, [activeBlock, hasFocusWithin, blockID, setActiveBlock]);
  if (!block) return null;
  if (!blockID) return null;
  if (!BlockEditorElement) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BlockToolbarProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "div",
    {
      ref: blockRef,
      style: {
        display: "contents"
      },
      onClickCapture: handleClickCapture,
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
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
          className: (0, import_clsx.default)(
            "sg-block__block",
            !hasFocusWithin && !activeBlock && (!parentID || ((_e = blocks.get(parentID)) == null ? void 0 : _e.hasFocusWithin)) ? "sg-block__block--hover" : "",
            isActive ? "sg-block__block--active" : "",
            !hasFocusWithin && !isActive && activeBlock && "sg-block__block--inactive",
            className
          ),
          children: [
            isActive && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              AddBlockContextMenu,
              {
                args: { position: "before", reference: blockID, parentID },
                className: "sg-block__contextMenu",
                children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  "button",
                  {
                    title: "Ajouter un \xE9l\xE9ment avant le bloc actif",
                    "aria-label": "Ajotuer un \xE9l\xE9ment avant le bloc actif",
                    className: `sg-block__btn__addBlock sg-block__btn__addBlock--${horizontalFlow ? "left" : "top"}`,
                    children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_fa6.FaPlus, {})
                  }
                )
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BlockEditorElement, { block, isActive }),
            isActive && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BlockToolbarRenderer, { position: toolbarPosition, hasSpacingOptions, block }),
            isActive && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "button",
                {
                  className: "sg-block__btn sg-block__btn--square sg-block__btn__deleteBlock",
                  onClick: () => deleteBlock(blockID),
                  "aria-label": "Supprimer le block actif: " + type,
                  title: "Supprimer le block actif: " + type,
                  children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_ri.RiDeleteBin5Line, {})
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                AddBlockContextMenu,
                {
                  args: { position: "after", reference: blockID, parentID },
                  className: "sg-block__contextMenu",
                  children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                    "button",
                    {
                      title: "Ajouter un \xE9l\xE9ment apr\xE8s le bloc actif",
                      "aria-label": "Ajouter un \xE9l\xE9ment apr\xE8s le bloc actif",
                      className: `sg-block__btn__addBlock sg-block__btn__addBlock--${horizontalFlow ? "right" : "bottom"}`,
                      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_fa6.FaPlus, {})
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
var import_fa62 = require("react-icons/fa6");
var import_jsx_runtime5 = require("react/jsx-runtime");
var DefaultImageSelector = ({ children, value, onSelect, className }) => {
  const [currentImage, setCurrentImage] = (0, import_react4.useState)(value);
  const inputRef = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className, onClick: handleImageclick, children: [
    children,
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { type: "file", hidden: true, ref: inputRef, accept: ".jpg, .jpeg, .png", onChange: handleFileChange })
  ] });
};
var ImageSelectorWrapper = ({
  children,
  ImageSelector,
  value,
  onSelect,
  className
}) => {
  if (ImageSelector) return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    ImageSelector,
    {
      value,
      onSelect,
      className,
      children
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_jsx_runtime5.Fragment, { children: src ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  ) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "sg-block__blockImage__placeholder", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_fa62.FaImage, {}) }) });
};
var ImageBlock = ({ block, ImageSelector }) => {
  var _a, _b;
  const [imagePreview, setImagePreview] = (0, import_react4.useState)((_b = (_a = block.value) == null ? void 0 : _a.image) == null ? void 0 : _b.src);
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
  (0, import_react4.useEffect)(() => {
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
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_md.MdAlignHorizontalLeft, {}, "alignLeft"),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_md.MdAlignHorizontalCenter, {}, "alignCenter"),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_md.MdAlignHorizontalRight, {}, "alignRight")
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(BlockToolbar, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        BlockToolbarColumn,
        {
          title: "Aspect",
          children: aspects.map((value2, index) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        BlockToolbarColumn,
        {
          title: "Alignement",
          children: aligns.map((value2, index) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      ImageSelectorWrapper,
      {
        className: "sg-block__blockImage__selectorWrapper",
        value: image,
        onSelect: handleImageSelection,
        ImageSelector,
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ImagePreview, { src: imagePreview, align, aspect })
      }
    )
  ] });
};
var ImageBlock_default = ImageBlock;

// src/default-blocks.tsx
var import_fa64 = require("react-icons/fa6");
var import_fa65 = require("react-icons/fa6");
var import_rx = require("react-icons/rx");

// src/blocks/TextBlock.tsx
var import_clsx2 = __toESM(require("clsx"));
var import_react19 = require("react");

// lib/text-module/component/src/components/TextIgniter/TextIgniter.jsx
var import_react18 = __toESM(require("react"));

// lib/text-module/component/src/contexts/editorContext.jsx
var import_react9 = __toESM(require("react"));

// lib/text-module/component/src/hooks/useEditorFormatting.jsx
var import_react5 = require("react");
var useEditorFormatting = (editorRef) => {
  const [activeStyles, setActiveStyles] = (0, import_react5.useState)(["justifyLeft"]);
  const updateDataAttributes = (0, import_react5.useCallback)((element) => {
    const styles = window.getComputedStyle(element);
    const dataType = [];
    if (styles.fontWeight === "bold" || parseInt(styles.fontWeight) >= 600)
      dataType.push("bold");
    if (styles.fontStyle === "italic") dataType.push("italic");
    if (styles.textDecoration.includes("underline")) dataType.push("underline");
    if (styles.textAlign === "left") dataType.push("justifyLeft");
    if (styles.textAlign === "center") dataType.push("justifyCenter");
    if (styles.textAlign === "right") dataType.push("justifyRight");
    element.setAttribute("data-type", dataType.join("-") || "normal");
  }, []);
  const updateActiveStyles = (0, import_react5.useCallback)(() => {
    const editor = editorRef.current;
    if (editor) {
      const styles = /* @__PURE__ */ new Set();
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer;
        const computedStyle = window.getComputedStyle(parentElement);
        const fontWeight = computedStyle.fontWeight;
        const fontStyle = computedStyle.fontStyle;
        const textDecoration = computedStyle.textDecoration;
        console.log(textDecoration);
        if (fontWeight === "700") styles.add("bold");
        if (fontStyle === "italic") styles.add("italic");
        if (textDecoration.indexOf("underline") !== -1) styles.add("underline");
        console.log(styles);
        let node = parentElement;
        while (node && node !== document) {
          if (node.tagName === "OL") {
            styles.add("orderedList");
          }
          if (node.tagName === "UL") {
            styles.add("unorderedList");
          }
          if (node.tagName === "SUP") {
            styles.add("superscript");
          }
          if (node.tagName === "SUB") {
            styles.add("subscript");
          }
          node = node.parentNode;
        }
        const textAlign = computedStyle.textAlign;
        if (textAlign === "left" || textAlign === "start") {
          styles.add("justifyLeft");
        } else if (textAlign === "center") {
          styles.add("justifyCenter");
        } else if (textAlign === "right") {
          styles.add("justifyRight");
        }
      }
      setActiveStyles(Array.from(styles));
    }
  }, [editorRef]);
  const formatText = (0, import_react5.useCallback)(
    (command, value = null) => {
      const editor = editorRef.current;
      if (editor) {
        if (command.startsWith("justify")) {
          ["justifyLeft", "justifyCenter", "justifyRight"].forEach((style) => {
            if (style !== command) {
              document.execCommand(style, false, null);
            }
          });
        } else if (command === "insertOrderedList" || command === "insertUnorderedList") {
          const otherListCommand = command === "insertOrderedList" ? "insertUnorderedList" : "insertOrderedList";
          if (document.queryCommandState(otherListCommand)) {
            document.execCommand(otherListCommand, false, null);
          }
        } else if (command === "superscript" || command === "subscript") {
          const otherScriptCommand = command === "superscript" ? "subscript" : "superscript";
          if (document.queryCommandState(otherScriptCommand)) {
            document.execCommand(otherScriptCommand, false, null);
          }
        }
        document.execCommand(command, false, value);
        updateActiveStyles();
        editor.dispatchEvent(new Event("change"));
      }
    },
    [editorRef, updateActiveStyles]
  );
  const addImageOrVideo = (0, import_react5.useCallback)(
    (file, fileUrl) => {
      const editor = editorRef.current;
      if (editor) {
        let element;
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (file.type.startsWith("image/")) {
              element = document.createElement("img");
              element.src = e.target.result;
              element.alt = file.name;
            } else if (file.type.startsWith("video/")) {
              element = document.createElement("video");
              element.src = e.target.result;
              element.controls = true;
            }
            editor.appendChild(element);
            editor.appendChild(document.createElement("br"));
            updateActiveStyles();
          };
          reader.readAsDataURL(file);
        } else if (fileUrl) {
          if (fileUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
            element = document.createElement("img");
            element.src = fileUrl;
            element.alt = "Inserted image";
          } else if (fileUrl.match(/\.(mp4|webm|ogg)$/)) {
            element = document.createElement("video");
            element.src = fileUrl;
            element.controls = true;
          }
          editor.appendChild(element);
          editor.appendChild(document.createElement("br"));
          updateActiveStyles();
        }
      }
    },
    [editorRef, updateActiveStyles]
  );
  const addLink = (0, import_react5.useCallback)(
    (linkText, linkUrl, range = null) => {
      const editor = editorRef.current;
      const selection = window.getSelection();
      if (editor) {
        editor.focus();
        const linkElement = document.createElement("a");
        linkElement.textContent = linkText;
        linkElement.href = linkUrl;
        linkElement.rel = "noopener noreferrer";
        linkElement.className = "sg-link";
        if (range) {
          range.deleteContents();
          range.insertNode(linkElement);
          range.setStartAfter(linkElement);
          range.setEndAfter(linkElement);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          editor.appendChild(linkElement);
        }
        updateActiveStyles();
      }
    },
    [editorRef, updateActiveStyles]
  );
  const applyHeading = (0, import_react5.useCallback)(
    (heading) => {
      const editor = editorRef.current;
      if (editor) {
        document.execCommand("formatBlock", false, heading);
        updateActiveStyles();
      }
    },
    [editorRef, updateActiveStyles]
  );
  (0, import_react5.useEffect)(() => {
    const editor = editorRef.current;
    if (editor) {
      const handleLinkClick = (e) => {
        const target = e.target;
        if (target.tagName === "A") {
          e.preventDefault();
          window.open(target.href, "_blank", "noopener,noreferrer");
        }
      };
      editor.addEventListener("keyup", updateActiveStyles);
      editor.addEventListener("mouseup", updateActiveStyles);
      editor.addEventListener("click", handleLinkClick);
      return () => {
        editor.removeEventListener("keyup", updateActiveStyles);
        editor.removeEventListener("mouseup", updateActiveStyles);
        editor.removeEventListener("click", handleLinkClick);
      };
    }
  }, [editorRef, updateActiveStyles]);
  return {
    formatText,
    updateDataAttributes,
    addImageOrVideo,
    addLink,
    applyHeading,
    activeStyles
  };
};

// lib/text-module/component/src/hooks/useEditorState.jsx
var import_react6 = require("react");
var initialState = { wordCount: 0, charCount: 0, html: null };
var reducer = (state, action) => {
  switch (action.type) {
    case "SET_COUNTS":
      return __spreadProps(__spreadValues({}, state), {
        wordCount: action.wordCount,
        charCount: action.charCount
      });
    case "UPDATE_HTML":
      return __spreadProps(__spreadValues({}, state), {
        html: action.html
      });
    default:
      return state;
  }
};
var useEditorState = (editorRef, updateDataAttributes) => {
  const [state, dispatch] = (0, import_react6.useReducer)(reducer, initialState);
  (0, import_react6.useEffect)(() => {
    const editor = editorRef.current;
    let editorChangedHtml = state.html;
    const handleInput = () => {
      const text = editor.innerText || "";
      const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
      dispatch({
        type: "SET_COUNTS",
        wordCount: words.length,
        charCount: text.length
      });
      updateDataAttributes(editor);
      handleChange();
    };
    const handleChange = () => {
      const newHtml = editor.innerHTML || "";
      if (editorChangedHtml !== newHtml) {
        editorChangedHtml = newHtml;
        dispatch({
          type: "UPDATE_HTML",
          html: newHtml
        });
      }
    };
    editor.addEventListener("input", handleInput);
    editor.addEventListener("change", handleChange);
    return () => {
      editor.removeEventListener("input", handleInput);
      editor.removeEventListener("change", handleChange);
    };
  }, [editorRef, updateDataAttributes]);
  return state;
};

// lib/text-module/component/src/hooks/useTableOperation.jsx
var import_react7 = require("react");
var useTableOperations = (editorRef) => {
  const insertTable = (0, import_react7.useCallback)(
    (rows = 2, cols = 2) => {
      const editor = editorRef.current;
      if (editor) {
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.border = "1px solid #ccc";
        table.style.borderCollapse = "collapse";
        for (let i = 0; i < rows; i++) {
          const row = table.insertRow();
          for (let j = 0; j < cols; j++) {
            const cell = row.insertCell();
            cell.style.border = "1px solid #ccc";
            cell.style.padding = "5px";
            cell.style.height = "30px";
            cell.style.width = `${100 / cols}%`;
            cell.contentEditable = true;
          }
        }
        editor.appendChild(table);
        editor.appendChild(document.createElement("br"));
        editor.dispatchEvent(new Event("change"));
      }
    },
    [editorRef]
  );
  const addTableRow = (0, import_react7.useCallback)(() => {
    const editor = editorRef.current;
    if (editor) {
      const table = editor.querySelector("table");
      if (table) {
        const newRow = table.insertRow();
        const cellCount = table.rows[0].cells.length;
        for (let i = 0; i < cellCount; i++) {
          const cell = newRow.insertCell();
          cell.style.border = "1px solid #ccc";
          cell.style.padding = "5px";
          cell.style.height = "30px";
          cell.contentEditable = true;
        }
      }
      editor.dispatchEvent(new Event("change"));
    }
  }, [editorRef]);
  const addTableColumn = (0, import_react7.useCallback)(() => {
    const editor = editorRef.current;
    if (editor) {
      const table = editor.querySelector("table");
      if (table) {
        const rowCount = table.rows.length;
        for (let i = 0; i < rowCount; i++) {
          const cell = table.rows[i].insertCell();
          cell.style.border = "1px solid #ccc";
          cell.style.padding = "5px";
          cell.style.height = "30px";
          cell.contentEditable = true;
        }
        const cellCount = table.rows[0].cells.length;
        for (let i = 0; i < rowCount; i++) {
          for (let j = 0; j < cellCount; j++) {
            table.rows[i].cells[j].style.width = `${100 / cellCount}%`;
          }
        }
      }
      editor.dispatchEvent(new Event("change"));
    }
  }, [editorRef]);
  const insertLayout = (0, import_react7.useCallback)(
    (columns) => {
      const editor = editorRef.current;
      if (editor) {
        const table = document.createElement("table");
        table.className = "layout-table";
        table.style.width = "100%";
        table.style.border = "1px solid #ccc";
        table.style.borderCollapse = "collapse";
        const row = table.insertRow();
        columns.forEach((colWidth) => {
          const cell = row.insertCell();
          cell.style.border = "1px solid #ccc";
          cell.style.padding = "5px";
          cell.style.height = "30px";
          cell.style.width = `${colWidth}%`;
          cell.contentEditable = true;
        });
        editor.appendChild(table);
        editor.appendChild(document.createElement("br"));
        editor.dispatchEvent(new Event("change"));
      }
    },
    [editorRef]
  );
  return { insertTable, addTableRow, addTableColumn, insertLayout };
};

// lib/text-module/component/src/hooks/useHeadingState.jsx
var import_react8 = require("react");
var useHeadingState = () => {
  const [currentHeading, setCurrentHeading] = (0, import_react8.useState)("p");
  const changeHeading = (0, import_react8.useCallback)((heading) => {
    setCurrentHeading(heading);
    document.execCommand("formatBlock", false, heading);
  }, []);
  return { currentHeading, changeHeading };
};

// lib/text-module/component/src/contexts/editorContext.jsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var EditorContext = (0, import_react9.createContext)();
var EditorProvider = ({ children }) => {
  const editorRef = (0, import_react9.useRef)(null);
  const {
    formatText,
    updateDataAttributes,
    addImageOrVideo,
    addLink,
    activeStyles,
    applyHeading
  } = useEditorFormatting(editorRef);
  const state = useEditorState(editorRef, updateDataAttributes);
  const { insertTable, addTableRow, addTableColumn, insertLayout } = useTableOperations(editorRef);
  const headingState = useHeadingState();
  const getHtml = (0, import_react9.useCallback)(() => {
    return editorRef.current ? editorRef.current.innerHTML : "";
  }, [editorRef]);
  const getJson = (0, import_react9.useCallback)(() => {
    if (!editorRef.current) return null;
    const parseNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      const result = {
        type: node.nodeName.toLowerCase(),
        attributes: {},
        children: []
      };
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        result.attributes[attr.name] = attr.value;
      }
      node.childNodes.forEach((child) => {
        result.children.push(parseNode(child));
      });
      return result;
    };
    return parseNode(editorRef.current);
  }, []);
  const editorValue = __spreadProps(__spreadValues(__spreadValues({}, state), headingState), {
    applyHeading,
    formatText,
    editorRef,
    addImageOrVideo,
    addLink,
    insertTable,
    addTableRow,
    addTableColumn,
    insertLayout,
    activeStyles,
    getHtml,
    getJson
  });
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(EditorContext.Provider, { value: editorValue, children });
};
var useEditor2 = () => (0, import_react9.useContext)(EditorContext);

// lib/text-module/component/src/components/TextIgniter/Toolbar.jsx
var import_react16 = __toESM(require("react"));

// lib/text-module/component/src/assets/icon.jsx
var import_react10 = __toESM(require("react"));
var import_jsx_runtime7 = require("react/jsx-runtime");
var CloseIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z" })
  }
);
var BoldIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M17.061 11.22A4.46 4.46 0 0 0 18 8.5C18 6.019 15.981 4 13.5 4H6v15h8c2.481 0 4.5-2.019 4.5-4.5a4.48 4.48 0 0 0-1.439-3.28zM13.5 7c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5H9V7h4.5zm.5 9H9v-3h5c.827 0 1.5.673 1.5 1.5S14.827 16 14 16z" })
  }
);
var ItalicIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M19 7V4H9v3h2.868L9.012 17H5v3h10v-3h-2.868l2.856-10z" })
  }
);
var UnderlineIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M5 18h14v2H5zM6 4v6c0 3.309 2.691 6 6 6s6-2.691 6-6V4h-2v6c0 2.206-1.794 4-4 4s-4-1.794-4-4V4H6z" })
  }
);
var AlignLeftIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "path",
      {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6ZM3 12C3 11.4477 3.44772 11 4 11H14C14.5523 11 15 11.4477 15 12C15 12.5523 14.5523 13 14 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H18C18.5523 17 19 17.4477 19 18C19 18.5523 18.5523 19 18 19H4C3.44772 19 3 18.5523 3 18Z"
      }
    )
  }
);
var AlignCenterIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6ZM7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12ZM5 18C5 17.4477 5.44772 17 6 17H18C18.5523 17 19 17.4477 19 18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18Z"
        }
      ),
      " "
    ]
  }
);
var AlignRightIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6ZM9 12C9 11.4477 9.44772 11 10 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H10C9.44772 13 9 12.5523 9 12ZM5 18C5 17.4477 5.44772 17 6 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H6C5.44772 19 5 18.5523 5 18Z"
        }
      ),
      " "
    ]
  }
);
var UnOrderedListIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M4 6h2v2H4zm0 5h2v2H4zm0 5h2v2H4zm16-8V6H8.023v2H18.8zM8 11h12v2H8zm0 5h12v2H8z" })
  }
);
var OrderedListIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M5.282 12.064c-.428.328-.72.609-.875.851-.155.24-.249.498-.279.768h2.679v-.748H5.413c.081-.081.152-.151.212-.201.062-.05.182-.142.361-.27.303-.218.511-.42.626-.604.116-.186.173-.375.173-.578a.898.898 0 0 0-.151-.512.892.892 0 0 0-.412-.341c-.174-.076-.419-.111-.733-.111-.3 0-.537.038-.706.114a.889.889 0 0 0-.396.338c-.094.143-.159.346-.194.604l.894.076c.025-.188.074-.317.147-.394a.375.375 0 0 1 .279-.108c.11 0 .2.035.272.108a.344.344 0 0 1 .108.258.55.55 0 0 1-.108.297c-.074.102-.241.254-.503.453zm.055 6.386a.398.398 0 0 1-.282-.105c-.074-.07-.128-.195-.162-.378L4 18.085c.059.204.142.372.251.506.109.133.248.235.417.306.168.069.399.103.692.103.3 0 .541-.047.725-.14a1 1 0 0 0 .424-.403c.098-.175.146-.354.146-.544a.823.823 0 0 0-.088-.393.708.708 0 0 0-.249-.261 1.015 1.015 0 0 0-.286-.11.943.943 0 0 0 .345-.299.673.673 0 0 0 .113-.383.747.747 0 0 0-.281-.596c-.187-.159-.49-.238-.909-.238-.365 0-.648.072-.847.219-.2.143-.334.353-.404.626l.844.151c.023-.162.067-.274.133-.338s.151-.098.257-.098a.33.33 0 0 1 .241.089c.059.06.087.139.087.238 0 .104-.038.193-.117.27s-.177.112-.293.112a.907.907 0 0 1-.116-.011l-.045.649a1.13 1.13 0 0 1 .289-.056c.132 0 .237.041.313.126.077.082.115.199.115.352 0 .146-.04.266-.119.354a.394.394 0 0 1-.301.134zm.948-10.083V5h-.739a1.47 1.47 0 0 1-.394.523c-.168.142-.404.262-.708.365v.754a2.595 2.595 0 0 0 .937-.48v2.206h.904zM9 6h11v2H9zm0 5h11v2H9zm0 5h11v2H9z" })
  }
);
var ImageIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "path",
      {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5 7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V12.5858L18.7071 12.2929L18.6934 12.2794C18.091 11.6998 17.3358 11.3301 16.5 11.3301C15.6642 11.3301 14.909 11.6998 14.3066 12.2794L14.2929 12.2929L14 12.5858L11.7071 10.2929L11.6934 10.2794C11.091 9.6998 10.3358 9.33014 9.5 9.33014C8.66419 9.33014 7.909 9.6998 7.30662 10.2794L7.29289 10.2929L5 12.5858V7ZM15.4142 14L15.6997 13.7146C16.0069 13.4213 16.2841 13.3301 16.5 13.3301C16.7159 13.3301 16.9931 13.4213 17.3003 13.7146L19 15.4142V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V15.4142L8.69966 11.7146C9.0069 11.4213 9.28406 11.3301 9.5 11.3301C9.71594 11.3301 9.9931 11.4213 10.3003 11.7146L13.2929 14.7071L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.4142 14ZM21 15.001V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V15.0002V14.9998V7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7V14.999C21 14.9997 21 15.0003 21 15.001ZM15 7C14.4477 7 14 7.44772 14 8C14 8.55228 14.4477 9 15 9H15.01C15.5623 9 16.01 8.55228 16.01 8C16.01 7.44772 15.5623 7 15.01 7H15Z"
      }
    )
  }
);
var LinkIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z" })
    ]
  }
);
var SubScriptIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "path",
      {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4.7433 5.33104C4.37384 4.92053 3.74155 4.88726 3.33104 5.25671C2.92053 5.62617 2.88726 6.25846 3.25671 6.66897L7.15465 11L3.25671 15.331C2.88726 15.7416 2.92053 16.3738 3.33104 16.7433C3.74155 17.1128 4.37384 17.0795 4.7433 16.669L8.50001 12.4949L12.2567 16.669C12.6262 17.0795 13.2585 17.1128 13.669 16.7433C14.0795 16.3738 14.1128 15.7416 13.7433 15.331L9.84537 11L13.7433 6.66897C14.1128 6.25846 14.0795 5.62617 13.669 5.25671C13.2585 4.88726 12.6262 4.92053 12.2567 5.33104L8.50001 9.50516L4.7433 5.33104ZM17.3181 14.0484C17.6174 13.7595 18.1021 13.7977 18.3524 14.13C18.5536 14.3971 18.5353 14.7698 18.3088 15.0158L15.2643 18.3227C14.9955 18.6147 14.9248 19.0382 15.0842 19.4017C15.2437 19.7652 15.6031 20 16 20H20C20.5523 20 21 19.5523 21 19C21 18.4477 20.5523 18 20 18H18.2799L19.7802 16.3704C20.6607 15.414 20.7321 13.965 19.95 12.9267C18.9769 11.6348 17.0925 11.4862 15.929 12.6096L15.3054 13.2116C14.9081 13.5953 14.897 14.2283 15.2806 14.6256C15.6642 15.023 16.2973 15.0341 16.6946 14.6505L17.3181 14.0484Z",
        fill: "#000000"
      }
    )
  }
);
var SuperScriptIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "path",
      {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M17.3181 6.04842C17.6174 5.75945 18.1021 5.79767 18.3524 6.12997C18.5536 6.39707 18.5353 6.76978 18.3088 7.01579L15.2643 10.3227C14.9955 10.6147 14.9248 11.0382 15.0842 11.4017C15.2437 11.7652 15.6031 12 16 12H20C20.5523 12 21 11.5523 21 11C21 10.4477 20.5523 10 20 10H18.2799L19.7802 8.37041C20.6607 7.41399 20.7321 5.96504 19.95 4.92665C18.9769 3.63478 17.0925 3.48621 15.929 4.60962L15.3054 5.21165C14.9081 5.59526 14.897 6.22833 15.2806 6.62564C15.6642 7.02296 16.2973 7.03406 16.6946 6.65045L17.3181 6.04842ZM4.7433 8.33104C4.37384 7.92053 3.74155 7.88725 3.33104 8.25671C2.92053 8.62616 2.88726 9.25845 3.25671 9.66896L7.15465 14L3.25671 18.331C2.88726 18.7415 2.92053 19.3738 3.33104 19.7433C3.74155 20.1128 4.37384 20.0795 4.7433 19.669L8.50001 15.4948L12.2567 19.669C12.6262 20.0795 13.2585 20.1128 13.669 19.7433C14.0795 19.3738 14.1128 18.7415 13.7433 18.331L9.84537 14L13.7433 9.66896C14.1128 9.25845 14.0795 8.62616 13.669 8.25671C13.2585 7.88725 12.6262 7.92053 12.2567 8.33104L8.50001 12.5052L4.7433 8.33104Z",
        fill: "#000000"
      }
    )
  }
);
var TableIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "path",
      {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5 4C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V9H9V4H5ZM5 2C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7957 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7957 22 19V5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7957 2 19 2H5ZM11 4V9H20V5C20 4.73478 19.8946 4.48043 19.7071 4.29289C19.5196 4.10536 19.2652 4 19 4H11ZM20 11H11V20H19C19.2652 20 19.5196 19.8946 19.7071 19.7071C19.8946 19.5196 20 19.2652 20 19V11ZM9 20V11H4V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H9Z"
      }
    )
  }
);
var LayoutIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "20",
    viewBox: "0 0 24 20",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H20C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V4C2 3.46957 2.21071 2.96086 2.58579 2.58579ZM13 20H20V4H13V20ZM11 4V20H4V4H11Z"
        }
      ),
      " "
    ]
  }
);
var HeadingIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "24",
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M18 20V4h-3v6H9V4H6v16h3v-7h6v7z" })
  }
);

// lib/text-module/component/src/components/ui/Button.jsx
var import_react12 = __toESM(require("react"));

// lib/text-module/component/src/components/ui/ToolTip.jsx
var import_react11 = __toESM(require("react"));
var import_jsx_runtime8 = require("react/jsx-runtime");
var Tooltip = ({ text, children }) => {
  return text ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "sg-text__tooltip-container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "sg-text__tooltip", children: text }),
    children
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_jsx_runtime8.Fragment, {});
};
var ToolTip_default = Tooltip;

// lib/text-module/component/src/components/ui/Button.jsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var AppButton = ({
  type = "primary",
  children,
  onClick,
  disabled = false
}) => {
  const className = `sg-text__button sg-text__button-${type}`;
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { className, onClick: handleClick, disabled, children });
};
var IconButton = ({ children, onClick, id, toolTip, isActive }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ToolTip_default, { text: toolTip, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: `sg-text__toolbarBtnDiv ${isActive ? "active" : ""}`, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { className: "sg-text__toolbarBtn", onClick: handleClick, id, children }) }) });
};

// lib/text-module/component/src/components/ui/Dialog.jsx
var import_react13 = __toESM(require("react"));
var import_jsx_runtime10 = require("react/jsx-runtime");
var ImageUploadSelectionDialog = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children
}) => {
  const [file, setFile] = (0, import_react13.useState)(null);
  const [imageUrl, setImageUrl] = (0, import_react13.useState)("");
  const [error, setError] = (0, import_react13.useState)("");
  const validImageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const validVideoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm"];
  (0, import_react13.useEffect)(() => {
    if (isOpen) {
      resetToDefault();
    }
  }, [isOpen]);
  const closeDialog = () => {
    resetToDefault();
    onClose();
  };
  const resetToDefault = () => {
    setImageUrl("");
    setFile(null);
    setError("");
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (validImageExtensions.includes(fileExtension) || validVideoExtensions.includes(fileExtension)) {
        setFile(selectedFile);
        setError("");
      } else {
        setFile(null);
        setError("Invalid file type. Please select an image or video file.");
      }
    }
  };
  const handleSubmit = () => {
    if (file || imageUrl) {
      onSubmit({ file, imageUrl });
      onClose();
    } else {
      setError("Please select a file or image url");
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "sg-text__dialog-overlay", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sg-text__dialog-container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sg-text__dialog-header", children: [
      title,
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(IconButton, { onClick: onClose, id: "dialogClose", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CloseIcon, {}) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "sg-text__dialog-body", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sg-text__container", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { htmlFor: "file-input", className: "sg-text__custom-file-input", children: !file ? "Select file" : "Reselect file" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "input",
        {
          type: "file",
          id: "file-input",
          accept: "image/*,video/*",
          onChange: handleFileChange
        }
      ),
      file && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sg-text__file-info", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { children: [
          "Selected file: ",
          file.name,
          " "
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { children: [
          "File size: ",
          (file.size / 1024).toFixed(2),
          " KB"
        ] })
      ] }),
      error && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "sg-text__error", children: error })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sg-text__dialog-footer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(AppButton, { type: "cancel", onClick: closeDialog, children: "Cancel" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(AppButton, { onClick: handleSubmit, children: "Submit" })
    ] })
  ] }) });
};
var FileUrlDialog = ({
  isOpen,
  onClose,
  onSubmit,
  linkText,
  link,
  children
}) => {
  const [url, setUrl] = (0, import_react13.useState)(link || "");
  const [text, setText] = (0, import_react13.useState)(linkText || "");
  const [error, setError] = (0, import_react13.useState)("");
  const range = (0, import_react13.useRef)(null);
  (0, import_react13.useEffect)(() => {
    if (isOpen) {
      resetToDefault();
      const selection = window.getSelection();
      range.current = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    }
  }, [isOpen, link, linkText]);
  const closeDialog = () => {
    resetToDefault();
    onClose();
  };
  const resetToDefault = () => {
    const selection = window.getSelection().rangeCount > 0 ? window.getSelection().toString() : null;
    setUrl(link || selection || "");
    setText(linkText || selection || "");
    setError("");
  };
  const handleLinkUrl = (event) => {
    setUrl(event.target.value);
  };
  const handleLinkText = (event) => {
    setText(event.target.value);
  };
  const handleSubmit = () => {
    let errorMessage = "";
    if (!url) {
      errorMessage += "Please provide an URL.";
    }
    if (!text) {
      errorMessage += "Please provide a text for the link.";
    }
    if (errorMessage) {
      setError(errorMessage);
    } else {
      onSubmit({ text, url }, range.current);
      onClose();
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "sg-text__dialog-overlay", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sg-text__dialog-container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sg-text__dialog-header", children: [
      "Enter Title",
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(IconButton, { onClick: onClose, id: "dialogClose", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CloseIcon, {}) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sg-text__dialog-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "sg-text__container", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "input",
        {
          type: "text",
          className: "sg-text__image-url-input",
          placeholder: "Texte du lien",
          value: text,
          onChange: handleLinkText
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sg-text__container", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "input",
          {
            type: "text",
            className: "sg-text__image-url-input",
            placeholder: "URL du lien",
            value: url,
            onChange: handleLinkUrl
          }
        ),
        error && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "sg-text__error", children: error })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sg-text__dialog-footer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(AppButton, { type: "cancel", onClick: closeDialog, children: "Annuler" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(AppButton, { onClick: handleSubmit, children: "Valider" })
    ] })
  ] }) });
};

// lib/text-module/component/src/components/ui/Dropdown.jsx
var import_react14 = __toESM(require("react"));
var import_jsx_runtime11 = require("react/jsx-runtime");
var IconDropDown = ({ items, onChange, icon, id, openRight, toolTip }) => {
  const [isOpen, setIsOpen] = (0, import_react14.useState)(false);
  const handleButtonClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  const handleItemClick = (value, e) => {
    e.preventDefault();
    onChange(value);
    setIsOpen(false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: `sg-text__icon-dropdown ${openRight ? "open-right" : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ToolTip_default, { text: toolTip, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "button",
      {
        className: "sg-text__dropbtn",
        id,
        onMouseDown: handleButtonClick,
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        children: icon
      }
    ) }),
    isOpen && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "sg-text__icon-dropdown-content", children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
      "div",
      {
        className: "sg-text__dropdown-item",
        onMouseDown: (e) => handleItemClick(item.value, e),
        children: [
          item.icon && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "sg-text__dropdown-icon", children: item.icon }),
          item.label
        ]
      },
      index
    )) })
  ] });
};

// lib/text-module/component/src/hooks/usePreviewMode.jsx
var import_react15 = require("react");
var usePreviewMode = () => {
  const [isToolbarVisible, setToolbarVisibility] = (0, import_react15.useState)(false);
  const toggleToolbarVisibility = () => {
    setToolbarVisibility((prev) => !prev);
  };
  return { isToolbarVisible, toggleToolbarVisibility };
};

// lib/text-module/component/src/components/TextIgniter/Toolbar.jsx
var import_jsx_runtime12 = require("react/jsx-runtime");
var Toolbar = ({ features }) => {
  const {
    formatText,
    insertTable,
    addTableRow,
    addTableColumn,
    insertLayout,
    addImageOrVideo,
    addLink,
    activeStyles,
    changeHeading,
    applyHeading
  } = useEditor2();
  const { isToolbarVisible, toggleToolbarVisibility } = usePreviewMode();
  const [isImageDialogOpen, setImageDialogOpen] = (0, import_react16.useState)(false);
  const [isUrlDialogOpen, setUrlDialogOpen] = (0, import_react16.useState)(false);
  const handleImageSubmit = ({ file, fileUrl }) => {
    addImageOrVideo(file, fileUrl);
  };
  const handleHeadingChange = (e) => {
    const heading = e;
    changeHeading(heading);
    applyHeading(heading);
  };
  const handleTableOperation = (operation) => {
    switch (operation) {
      case "insert":
        insertTable(2, 2);
        break;
      case "addRow":
        addTableRow();
        break;
      case "addColumn":
        addTableColumn();
        break;
      default:
        break;
    }
  };
  const handleLayoutOperation = (layout) => {
    switch (layout) {
      case "single":
        insertLayout([100]);
        break;
      case "two-equal":
        insertLayout([50, 50]);
        break;
      case "three-equal":
        insertLayout([33.33, 33.33, 33.33]);
        break;
      case "40-60":
        insertLayout([40, 60]);
        break;
      case "60-40":
        insertLayout([60, 40]);
        break;
      default:
        break;
    }
  };
  const getIsActive = (style) => activeStyles.includes(style);
  const featureButtons = {
    bold: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconButton,
      {
        onClick: () => formatText("bold"),
        toolTip: "Bold",
        isActive: getIsActive("bold"),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(BoldIcon, {})
      }
    ),
    italic: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconButton,
      {
        onClick: () => formatText("italic"),
        toolTip: "Italic",
        isActive: getIsActive("italic"),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ItalicIcon, {})
      }
    ),
    underline: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconButton,
      {
        onClick: () => formatText("underline"),
        toolTip: "Underline",
        isActive: getIsActive("underline"),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(UnderlineIcon, {})
      }
    ),
    orderedList: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconButton,
      {
        onClick: () => formatText("insertOrderedList"),
        toolTip: "Ordered List",
        isActive: getIsActive("orderedList"),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(OrderedListIcon, {})
      }
    ),
    unorderedList: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconButton,
      {
        onClick: () => formatText("insertUnorderedList"),
        toolTip: "Unordered List",
        isActive: getIsActive("unorderedList"),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(UnOrderedListIcon, {})
      }
    ),
    justifyLeft: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconButton,
      {
        onClick: () => formatText("justifyLeft"),
        toolTip: "Justify Left",
        isActive: getIsActive("justifyLeft"),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(AlignLeftIcon, {})
      }
    ),
    justifyCenter: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconButton,
      {
        onClick: () => formatText("justifyCenter"),
        toolTip: "Justify Center",
        isActive: getIsActive("justifyCenter"),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(AlignCenterIcon, {})
      }
    ),
    justifyRight: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconButton,
      {
        onClick: () => formatText("justifyRight"),
        toolTip: "Justify Right",
        isActive: getIsActive("justifyRight"),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(AlignRightIcon, {})
      }
    ),
    createLink: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        IconButton,
        {
          onClick: () => setUrlDialogOpen(true),
          toolTip: "Create Link",
          isActive: getIsActive("createLink"),
          children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(LinkIcon, {})
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        FileUrlDialog,
        {
          isOpen: isUrlDialogOpen,
          onClose: () => setUrlDialogOpen(false),
          title: "Provide URL",
          linkText: "",
          link: "",
          onSubmit: (data, range) => addLink(data.text, data.url, range)
        }
      )
    ] }),
    insertImage: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        IconButton,
        {
          onClick: () => setImageDialogOpen(true),
          toolTip: "Insert Image/Video",
          isActive: getIsActive("insertImage"),
          children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ImageIcon, {})
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        ImageUploadSelectionDialog,
        {
          isOpen: isImageDialogOpen,
          onClose: () => setImageDialogOpen(false),
          title: "Select Image/Video file",
          onSubmit: handleImageSubmit
        }
      )
    ] }),
    superscript: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconButton,
      {
        onClick: () => formatText("superscript"),
        toolTip: "Superscript",
        isActive: getIsActive("superscript"),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SuperScriptIcon, {})
      }
    ),
    subscript: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconButton,
      {
        onClick: () => formatText("subscript"),
        toolTip: "Subscript",
        isActive: getIsActive("subscript"),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SubScriptIcon, {})
      }
    ),
    table: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconDropDown,
      {
        id: "tableDropdown",
        icon: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(TableIcon, {}),
        toolTip: "Table",
        items: [
          { value: "insert", label: "Insert Table" },
          { value: "addRow", label: "Add Row" },
          { value: "addColumn", label: "Add Column" }
        ],
        onChange: handleTableOperation
      }
    ),
    layout: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconDropDown,
      {
        id: "layoutDropdown",
        icon: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(LayoutIcon, {}),
        toolTip: "Layout",
        items: [
          { value: "single", label: "Single Column" },
          { value: "two-equal", label: "Two Equal Columns" },
          { value: "three-equal", label: "Three Equal Columns" },
          { value: "40-60", label: "40-60" },
          { value: "60-40", label: "60-40" }
        ],
        onChange: handleLayoutOperation
      }
    ),
    heading: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      IconDropDown,
      {
        icon: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(HeadingIcon, {}),
        items: [
          { value: "p", label: "Paragraph" },
          { value: "h1", label: "Heading 1" },
          { value: "h2", label: "Heading 2" },
          { value: "h3", label: "Heading 3" },
          { value: "h4", label: "Heading 4" },
          { value: "h5", label: "Heading 5" },
          { value: "h6", label: "Heading 6" }
        ],
        onChange: handleHeadingChange,
        toolTip: "Headings"
      }
    )
  };
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "sg-text__toolbar", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "sg-text__toolbar-switch", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("label", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "input",
        {
          type: "checkbox",
          checked: isToolbarVisible,
          onChange: toggleToolbarVisibility
        }
      ),
      !isToolbarVisible ? "Preview Mode" : "Edit Mode"
    ] }) }),
    !isToolbarVisible && features.map((feature, index) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react16.default.Fragment, { children: featureButtons[feature] }, index))
  ] });
};
var Toolbar_default = Toolbar;

// lib/text-module/component/src/components/TextIgniter/Editor.jsx
var import_react17 = __toESM(require("react"));
var import_jsx_runtime13 = require("react/jsx-runtime");
var placeCursorTextEnd = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};
var Editor = ({ height = "300px" }) => {
  const { editorRef, wordCount, charCount } = useEditor2();
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      "div",
      {
        ref: editorRef,
        contentEditable: true,
        className: "sg-text__editor-content",
        onFocus: () => placeCursorTextEnd(editorRef.current),
        style: {
          minHeight: height,
          padding: "10px",
          overflowY: "auto"
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "sg-text__editor-footer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { children: [
        "Words: ",
        wordCount
      ] }),
      " | ",
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { children: [
        "Chars: ",
        charCount
      ] })
    ] })
  ] });
};
var Editor_default = Editor;

// lib/text-module/component/src/components/TextIgniter/TextIgniter.jsx
var import_jsx_runtime14 = require("react/jsx-runtime");
var TextIgniterContent = (0, import_react18.forwardRef)(
  ({ features, height, onChange, defaultContent }, ref) => {
    const { getHtml, getJson, html, editorRef } = useEditor2();
    (0, import_react18.useImperativeHandle)(ref, () => ({
      getHtml,
      getJson,
      html,
      editorRef
    }));
    (0, import_react18.useEffect)(() => {
      if ((editorRef == null ? void 0 : editorRef.current) && !!defaultContent) {
        editorRef.current.innerHTML = defaultContent;
      }
    }, []);
    (0, import_react18.useEffect)(() => {
      html !== null && onChange && typeof onChange === "function" ? onChange(html) : void 0;
    }, [html, onChange]);
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "sg-text__editor-container", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Toolbar_default, { features }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Editor_default, { height })
    ] });
  }
);
var TextIgniter = (0, import_react18.forwardRef)((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(EditorProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(TextIgniterContent, __spreadProps(__spreadValues({}, props), { ref })) }));
var TextIgniter_default = TextIgniter;

// src/blocks/TextBlock.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var TextBlock = ({ block, isActive }) => {
  const features = [
    "heading",
    "bold",
    "italic",
    "underline",
    "unorderedList",
    "justifyLeft",
    "justifyCenter",
    "justifyRight",
    "createLink"
  ];
  const { updateBlock } = useEditor();
  const { blockID, value } = block;
  const { htmlContent } = value != null ? value : {};
  const editorRef = (0, import_react19.useRef)(null);
  (0, import_react19.useEffect)(() => {
    var _a, _b;
    if (((_b = (_a = editorRef.current) == null ? void 0 : _a.editorRef) == null ? void 0 : _b.current) && isActive) {
      editorRef.current.editorRef.current.focus();
    }
  }, [isActive]);
  (0, import_react19.useEffect)(() => {
    var _a, _b;
    if ((_b = (_a = editorRef.current) == null ? void 0 : _a.editorRef) == null ? void 0 : _b.current) {
      const preventDefault = (e) => e.preventDefault();
      editorRef.current.editorRef.current.addEventListener("dragover", preventDefault);
      editorRef.current.editorRef.current.addEventListener("drop", preventDefault);
      return () => {
        var _a2, _b2, _c, _d, _e, _f;
        (_c = (_b2 = (_a2 = editorRef.current) == null ? void 0 : _a2.editorRef) == null ? void 0 : _b2.current) == null ? void 0 : _c.removeEventListener("dragover", preventDefault);
        (_f = (_e = (_d = editorRef.current) == null ? void 0 : _d.editorRef) == null ? void 0 : _e.current) == null ? void 0 : _f.removeEventListener("drop", preventDefault);
      };
    }
  }, [editorRef.current]);
  const handleChange = (0, import_react19.useCallback)((val) => {
    updateBlock(blockID, {
      value: {
        htmlContent: val
      }
    });
  }, [blockID, updateBlock]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_jsx_runtime15.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: (0, import_clsx2.default)(
    "sg-block__blockText",
    isActive && "sg-block__blockText--active"
  ), children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    TextIgniter_default,
    {
      ref: editorRef,
      onChange: handleChange,
      defaultContent: htmlContent,
      features,
      height: "100%"
    }
  ) }) });
};
var TextBlock_default = TextBlock;

// src/blocks/GroupBlock.tsx
var import_react20 = require("react");
var import_clsx3 = __toESM(require("clsx"));
var import_bs = require("react-icons/bs");
var import_md2 = require("react-icons/md");
var import_fa63 = require("react-icons/fa6");
var import_jsx_runtime16 = require("react/jsx-runtime");
var RowBlock = ({ block, isActive }) => {
  var _a;
  const minChildWidth = 320;
  const { blockID, hasFocusWithin, value, children } = block;
  const { flow, height, template } = value != null ? value : {};
  const [groupWidth, setGroupWidth] = (0, import_react20.useState)(null);
  const [currentTemplate, setCurrentTemplate] = (0, import_react20.useState)(template || []);
  const [isResizing, setIsResizing] = (0, import_react20.useState)(null);
  const groupRef = (0, import_react20.useRef)(null);
  const { blocks, setActiveBlock, updateBlock } = useEditor();
  const prevXRef = (0, import_react20.useRef)(null);
  const isResizable = !!(children == null ? void 0 : children.length) && groupWidth ? groupWidth > minChildWidth * (children == null ? void 0 : children.length) : false;
  const handleResizeStart = (0, import_react20.useCallback)((e, indexEl) => {
    if (isResizable) {
      setIsResizing(indexEl);
      prevXRef.current = e.clientX;
      document.body.style.userSelect = "none";
    }
  }, [prevXRef, setIsResizing, groupWidth, minChildWidth, isResizable]);
  (0, import_react20.useEffect)(() => {
    if (children && (children == null ? void 0 : children.length) !== currentTemplate.length) {
      const newTemplate = Array(children.length).fill(100 / (children == null ? void 0 : children.length));
      updateBlock(blockID, {
        value: {
          template: newTemplate
        }
      });
    }
  }, [children == null ? void 0 : children.length]);
  (0, import_react20.useEffect)(() => {
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
  (0, import_react20.useEffect)(() => {
    setCurrentTemplate(template || []);
  }, [template]);
  (0, import_react20.useEffect)(() => {
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
  (0, import_react20.useEffect)(() => {
    if (children)
      updateBlock(blockID, {
        value: {
          template: children.map(() => 100 / children.length)
        }
      });
  }, [children]);
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(BlockToolbar, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
      BlockToolbarColumn,
      {
        title: "Direction",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
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
              children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_bs.BsArrowsExpandVertical, {})
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
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
              children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_bs.BsArrowsExpand, {})
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
      "div",
      {
        className: (0, import_clsx3.default)(
          "sg-block__blockGroup",
          block.hasFocusWithin && "sg-block__blockGroup--focusWithin",
          flow === "vertical" ? "sg-block__blockGroup--vertical" : "sg-block__blockGroup--horizontal",
          height && (typeof height === "number" || height.indexOf("px") !== -1) ? "sg-block__blockGroup--fixedHeight" : ""
        ),
        ref: groupRef,
        children: [
          !!children && ((_a = block.children) == null ? void 0 : _a.map((childID, indexEl) => /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
            "div",
            {
              className: "sg-block__blockGroup__childContainer",
              style: {
                flex: (currentTemplate == null ? void 0 : currentTemplate[indexEl]) + "% 1 0",
                minWidth: minChildWidth + "px"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
                  Block_default,
                  {
                    horizontalFlow: flow !== "vertical",
                    block: blocks.get(childID)
                  }
                ),
                isActive && indexEl !== children.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
                  "div",
                  {
                    className: (0, import_clsx3.default)(
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
          !(children == null ? void 0 : children.length) && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "sg-block__blockGroup__placeholder" }),
          !!isActive && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            AddBlockContextMenu,
            {
              args: { parentID: blockID },
              className: "sg-block__blockGroup__addChild",
              children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
                "button",
                {
                  title: "Ajouter des blocs \xE0 l'int\xE9rieur du groupe",
                  "aria-label": "Ajouter des blocs \xE0 l'int\xE9rieur du groupe",
                  className: "sg-block__btn sg-block__btn--square",
                  children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_fa63.FaPlus, {})
                }
              )
            }
          ),
          hasFocusWithin && !isActive && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            Button_default,
            {
              className: "sg-block__btn sg-block__btn--square sg-block__blockGroup__focusParent",
              onClick: (e) => {
                e.stopPropagation();
                setActiveBlock(blockID);
              },
              title: "S\xE9lectionner le groupe parent",
              ariaLabel: "S\xE9lectionner le groupe parent",
              children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_md2.MdCenterFocusStrong, {})
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
    icon: import_fa65.FaAlignJustify,
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
    icon: import_fa64.FaRegImage,
    render: void 0,
    editor: ImageBlock_default,
    isResizable: true,
    hasSpacingOptions: true
  },
  group: {
    name: "Group",
    type: "group",
    icon: import_rx.RxGroup,
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
var import_fa66 = require("react-icons/fa6");
var import_clsx4 = __toESM(require("clsx"));
var import_jsx_runtime17 = require("react/jsx-runtime");
var BlockEditorContent = () => {
  const { blocks, setActiveBlock } = useEditor();
  const editorRef = (0, import_react21.useRef)(null);
  const handleClickOutside = (0, import_react21.useCallback)((e) => {
    if (editorRef.current && !editorRef.current.contains(e.target)) {
      setActiveBlock(null);
    }
  }, [setActiveBlock]);
  (0, import_react21.useEffect)(() => {
    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { ref: editorRef, className: (0, import_clsx4.default)(
    "sg-block__editor__content",
    blocks.size === 0 ? "sg-block__editor__content--empty" : ""
  ), children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
    !!blocks && Array.from(blocks.values()).filter((block) => !block.parentID).map((block) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Block_default, { block }, block.blockID)),
    blocks.size === 0 && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(AddBlockContextMenu, { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("button", { className: "sg-block__btn", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_fa66.FaPlus, { style: { marginRight: 4 } }),
      "Ajouter du contenu"
    ] }) })
  ] }) });
};
var BlockEditor_default = (0, import_react21.forwardRef)(function BlocksEditor({ data, onChange, extraBlocks }, ref) {
  const blocks = __spreadValues(__spreadValues({}, default_blocks_default), extraBlocks);
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(BlocksEditorContextProvider, { data, onChange, ref, availableBlocks: blocks, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(BlockEditorContent, {}) });
});

// src/definitions.tsx
var definitions_exports = {};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockEditor,
  Definitions,
  ImageBlock,
  RowBlock,
  TextBlock,
  defaultBlocks,
  useEditor
});
//# sourceMappingURL=index.js.map