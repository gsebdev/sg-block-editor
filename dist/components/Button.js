import { jsx as _jsx } from "react/jsx-runtime";
const Button = ({ children, className, variant, onClick, ariaLabel, title }) => {
    return (_jsx("button", { onClick: onClick, "aria-label": ariaLabel, title: title, className: `sg-block__btn${variant ? ' sg-block__btn--' + variant : ''}${className ? ' ' + className : ''}`, children: children }));
};
export default Button;
