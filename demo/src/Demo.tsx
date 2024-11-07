import { useState } from "react";
import { BlockType } from "../../src/definitions";
import { BlockEditor } from "../../src";
import defaultDemoContent from "./default-demo-content.json";

import "../../src/sg-block-editor-default-theme.scss";

const Demo: React.FC = () => {

    const [content, setContent] = useState<BlockType[]>(defaultDemoContent);

    const codeReplacerFn = (_: string, value: any) => {
        
        if (typeof value === "string" && value.length > 26) {
            return value.slice(0, 25) + '...';
        }
        return value;
    }

    return <div>
        <h1>Editeur de Blocs 1.0.0</h1>
        <main>
            <div className="leftPanel">
                <BlockEditor onChange={(value) => setContent(value)} data={defaultDemoContent}/>
            </div>

            <div className="rightPanel">
                <pre>
                    <code>
                        {JSON.stringify(content, codeReplacerFn, 2)}
                    </code>
                </pre>
                
                    
            </div>
        </main>
    </div>
}

export default Demo;
