import { useState } from "react";
import { BlockType } from "../../src/definitions";
import { BlockEditor } from "../../src";
import "../../src/sg-block-editor-default-theme";
import { CodeBlock } from 'react-code-blocks';

const Demo: React.FC = () => {

    const [content, setContent] = useState<BlockType[]>([]);

    return <div>
        <h1>Editeur de Blocs 1.0.0</h1>
        <main>
            <div className="leftPanel">
                <BlockEditor onChange={(value) => setContent(value)} />
            </div>

            <div className="rightPanel">
                <CodeBlock
                    text={JSON.stringify(content).replace(/,/g, ',\n ').replace(/{/g, '{\n ').replace(/}/g, '\n }')}
                    language={'javascript'}
                    showLineNumbers={true}
                />
            </div>
        </main>
    </div>
}

export default Demo;
