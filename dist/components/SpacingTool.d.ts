import React from "react";
type SpacingToolState = {
    [key: string]: any;
    left?: string;
    right?: string;
    bottom?: string;
    top?: string;
};
type SpacingToolProps = {
    value?: SpacingToolState;
    onChange?: (value: SpacingToolState) => void;
};
declare const SpacingTool: React.FC<SpacingToolProps>;
export default SpacingTool;
