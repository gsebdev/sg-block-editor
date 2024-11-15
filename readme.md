# SG-Block-Editor | React WYSIWYG blocs editor

This is a simple, easy to use, WYSIWYG blocs editor to let user create HTML content.
The data can be saved in database as a JSON object or directly in html (need to set up render functions for each block).

This editor comes with 3 default blocks : **Image**, **Text**, **Group**.
You can add some more extraBlocks easyli or customize existing ones.

**[Live Demo](https://gsebdev.github.io/sg-block-editor/)**

## Installation

```bash
npm install
git submodule init
git submodule update
npm run dev
```


## Usage

```javascript

import { useRef } from "react";
import { BlockEditor } from "sg-block-editor";

const Editor = ({ defaultContent }) => {

    const editorRef = useRef(null);

    const handleEditorChange = () => {
        console.log("HTML Content", editorRef.current?.getHTMLValue());
        console.log("JSON Content", editorRef.current?.getJSONValue());
    };
    
    return (

        <BlockEditor 
            onChange={ handleEditorChange }
            data={ defaultContent }
            ref={ editorRef }
            extraBlocks={/* add an object that define extra blocks and it will be added/remplaced to default blocks */}
        />
    )
}

```
	

TODO :
write on readme how to default block or even add some
write on readme how to change default imageselector on ImageBlock


## Props

| Prop Name         | Type     | Description                                                                                     |
|-------------------|----------|-------------------------------------------------------------------------------------------------|
| `data`            | `BlockType[]` \| `null` \| `undefined`    | Initial content to populate the editor, in JSON format.                              |
| `onChange`        | `(data: BlockType[]) => void` \| `undefined` | Callback function that is called whenever the content of the editor changes.                   |
| `ref`             | `RefObject` \| `undefined`  | Reference to access editor methods like `getHTMLValue()` and `getJSONValue()`.                 |
| `extraBlocks`     | `Record<string, EditorBlock>` \| `undefined`   | An object defining additional custom blocks or modifications to existing blocks.               |

## Customization
### Adding Custom Blocks

To add custom blocks, pass an `extraBlocks` object to the `BlockEditor` component.

```javascript

import ImageIcon from 'icons';
import { useEditor } from 'sg-block-editor';

// example of a really simple render fn
const renderHTMLCustomBlock = (val) => val.html;

// example of a custom html block
const CustomBlock = ({ isActive, block}) => {
    
    const { updateBlock } = useEditor;
    const { value, blockID } = block;

    return (
        <div className="sg-block__customBlock">
            <pre>
                <code 
                    contenteditable="true"
                    onInput={ (e) => updateBlock(blockID, { value: html: e.target.innerHTML }) }
                >
                    {value.html}
                </code>
            </pre>
        </div>
    )
}

// Example of the extra blocks object to define the newly created custom block

const extraBlocks = {
    customBlock: {
        name: 'Custom Block',
        type: 'customBlock',
        icon: ImageIcon,
        render: renderHTMLCustomBlock,
        editor: CustomBlock,
        isResizable: false,
        hasSpacingOptions: true,
        defaultValue: {
            html: '<p>Default content</p>',
        },
        acceptChildren: false
    },
};

```

### Modifying the Default Image Selector

You can customize the default image selector used in the `ImageBlock` by providing your own selector function.

```javascript

import ImageBlock from 'sg-block-editor';
import defaultBlocks from 'sg-block-editor';

const CustomImageSelector = ({ children, value, onSelect, className }) => {

    const [currentImage, setCurrentImage] = useState(value);

    useEffect(() => {
        if (onSelect && currentImage && currentImage.src !== value?.src) onSelect(currentImage);
    }, [currentImage])

    const handleImageclick = () => {
        // Do some logic to open an image selector and set currentImage on selection
    }

    return (
        <div className={className} onClick={handleImageclick}>
            {children}
        </div>
    )
}

const CustomImageBlock = ({isActive, block}) => {
    return (
        <ImageBlock
            isActive={isActive}
            block={block}
            ImageSelector={CustomImageSelector}
        />
    )
};

const extraBlocks = {
    image: {
        ...defaultBlocks.image,
        editor: CustomImageBlock
    },
};

```

This customization allows you to integrate your own image selection logic, such as connecting to a third-party service or file uploader.


## Todo

- [ ] Add HTML Render functions on default blocks
- [ ] Add Tests