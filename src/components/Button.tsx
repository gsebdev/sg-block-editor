import { MouseEventHandler, PropsWithChildren } from "react"

type ButtonProps = PropsWithChildren<{
    className?: string,
    variant?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    title?: string,
    ariaLabel?: string, 
}>;

const Button: React.FC<ButtonProps> = ({ children, className, variant, onClick, ariaLabel, title }) => {
    return (
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            title={title}
            className={`sg-block__btn${variant ? ' sg-block__btn--' + variant : ''}${className ? ' ' + className : ''}`}
        >
            {children}
        </button>
    )
}

export default Button;