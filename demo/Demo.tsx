import React, { useRef, useState } from "react";
import { BlockType, EditorRefObject } from "../src/definitions";
import { BlockEditor } from "../src";
import defaultDemoContent from "./default-demo-content.json";
import packageJson from "../package.json";

import "../src/sg-block-editor-default-theme.scss";

const Demo: React.FC = () => {

    const [content, setContent] = useState<BlockType[]>(defaultDemoContent);
    const [rightOpen, setRightOpen] = useState<string|null>(null);

    const editorRef = useRef<EditorRefObject>(null);

    const codeReplacerFn = (_: string, value: string | number | object) => {

        if (typeof value === "string" && value.length > 26) {
            return value.slice(0, 25) + '...';
        }
        return value;
    }

    const handleClick = (type: string) => {
        const value  = type === rightOpen ? null : type;
        setRightOpen(value);
    }

    return <div>
        <main>
            <header>
                <h1>Simple HTML WYSIWYG blocs editor {packageJson.version}</h1>
                <p>
                    By <b><a href="https://github.com/gsebdev" target="_blank" rel="noreferrer">gsebdev</a></b>
                </p>
                <p>
                    <a href="https://github.com/gsebdev/sg-block-editor" target="_blank" rel="noreferrer">https://github.com/gsebdev/sg-block-editor</a>
                </p>
            </header>
            <div className="editor">
                <BlockEditor onChange={(value) => setContent(value)} data={defaultDemoContent} ref={editorRef} />
            </div>
            <div className="codeOpener">
                {rightOpen !== "json" && <button onClick={() => handleClick('json')}>{'See JSON Result'}</button>}
                {rightOpen !== "html" && <button onClick={() => handleClick('html')}>{'See HTML Result'}</button> }
                {!!rightOpen && <button onClick={() => handleClick(rightOpen)}>{'Close'}</button> }
            </div>

            <div className={`rightPanel${rightOpen ? ' rightPanel--open' : ''}`}>

                <h2>{rightOpen?.toUpperCase()} Result</h2>
                <pre>
                    <code>
                        { rightOpen === 'json' && JSON.stringify(content, codeReplacerFn, 2) }
                        { rightOpen === 'html' && editorRef.current?.getHTMLValue() }
                    </code>
                </pre>


            </div>
        </main>
    </div>
}

export default Demo;
