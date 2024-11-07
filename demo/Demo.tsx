import { useState } from "react";
import { BlockType } from "../src/definitions";
import { BlockEditor } from "../src";
import defaultDemoContent from "./default-demo-content.json";

import "../src/sg-block-editor-default-theme.scss";

const Demo: React.FC = () => {

    const [content, setContent] = useState<BlockType[]>(defaultDemoContent);
    const [ rightOpen, setRightOpen] = useState<boolean>(false);

    const codeReplacerFn = (_: string, value: any) => {

        if (typeof value === "string" && value.length > 26) {
            return value.slice(0, 25) + '...';
        }
        return value;
    }

    const handleClick = () => {
        setRightOpen(!rightOpen);
    }

    return <div>
        <main>
            <header>
                <h1>Simple HTML WYSIWYG blocs editor 1.0.0</h1>
                <p>
                    By <b><a href="https://github.com/gsebdev" target="_blank">gsebdev</a></b>
                </p>
                <p>
                    <a href="https://github.com/gsebdev/sg-block-editor" target="_blank">https://github.com/gsebdev/sg-block-editor</a>
                </p>
            </header>
            <div className="editor">
                <BlockEditor onChange={(value) => setContent(value)} data={defaultDemoContent} />
            </div>
            <button className="codeOpener" onClick={handleClick}>{rightOpen ? 'Close' : 'See JSON Result'}</button>
            <div className={`rightPanel${rightOpen ? ' rightPanel--open' : ''}`}>
              
                <h2>JSON Result</h2>
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
