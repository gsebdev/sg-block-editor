import React, { KeyboardEvent, useRef, useState } from "react";

type SpacingToolState = {
    left?: string,
    right?: string
    bottom?: string
    top?: string
}

type SpacingToolProps = {
    value?: SpacingToolState,
    onChange?: (value: SpacingToolState) => void,
}

const SpacingTool: React.FC<SpacingToolProps> = ({ value, onChange }) => {

    const [spacings, setSpacings] = useState<SpacingToolState>(value ?? {});
    const directions = [
        'left',
        'right',
        'bottom',
        'top'
    ]

    const spacingToolRef = useRef<HTMLDivElement>(null);

    const handleChange = (direction: typeof directions[number], value: string) => {
        const newSpacings = {
            ...spacings, [direction]: value
        }
        setSpacings(newSpacings);
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        console.log(e.key)
        if (e.key === "Enter") {
            spacingToolRef.current?.querySelectorAll('input').forEach((el) => {
                el.blur();
            });
        }
    }

    return (
        <div className="sg-block__SpacingTool" ref={spacingToolRef}>
            {directions.map((direction) => {
                return (
                    <div
                        key={direction}
                        className={`sg-block__SpacingTool__${direction}`}
                    >
                        <input
                            type="text"
                            onChange={(e) => handleChange(direction, e.target.value)}
                            onBlur={() => onChange?.(spacings)}
                            onKeyDown={(e) => handleKeyDown(e)}
                            value={spacings[direction] ?? '0px'}
                        />
                    </div>
                )
            })
            }
            <div className="sg-block__SpacingTool__center" />
        </div>
    )
}

export default SpacingTool;