import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
const SpacingTool = ({ value, onChange }) => {
    const [spacings, setSpacings] = useState(value !== null && value !== void 0 ? value : {});
    const directions = [
        'left',
        'right',
        'bottom',
        'top'
    ];
    const spacingToolRef = useRef(null);
    const handleChange = (direction, value) => {
        const newSpacings = Object.assign(Object.assign({}, spacings), { [direction]: value });
        setSpacings(newSpacings);
    };
    const handleKeyDown = (e) => {
        var _a;
        if (e.key === "Enter") {
            (_a = spacingToolRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll('input').forEach((el) => {
                el.blur();
            });
        }
    };
    return (_jsxs("div", { children: [_jsx("p", { children: _jsx("b", { children: "Marges" }) }), _jsxs("div", { className: "sg-block__SpacingTool", ref: spacingToolRef, children: [directions.map((direction) => {
                        var _a;
                        return (_jsx("div", { className: `sg-block__SpacingTool__${direction}`, children: _jsx("input", { type: "text", onChange: (e) => handleChange(direction, e.target.value), onBlur: () => onChange === null || onChange === void 0 ? void 0 : onChange(spacings), onKeyDown: (e) => handleKeyDown(e), value: (_a = spacings[direction]) !== null && _a !== void 0 ? _a : '0px' }) }, direction));
                    }), _jsx("div", { className: "sg-block__SpacingTool__center" })] })] }));
};
export default SpacingTool;
