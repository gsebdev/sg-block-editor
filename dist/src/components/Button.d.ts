import { MouseEventHandler, PropsWithChildren } from "react";
type ButtonProps = PropsWithChildren<{
    className?: string;
    variant?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    title?: string;
    ariaLabel?: string;
}>;
declare const Button: React.FC<ButtonProps>;
export default Button;
