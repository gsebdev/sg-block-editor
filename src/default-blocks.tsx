import ImageBlock from "./blocks/ImageBlock";
import { FaRegImage } from "react-icons/fa6";
import { FaAlignJustify } from "react-icons/fa6";
import { RxGroup } from "react-icons/rx";
import TextBlock from "./blocks/TextBlock";
import RowBlock from "./blocks/GroupBlock";
import { EditorBlock } from "./definitions";
import HtmlBlock from "./blocks/HtmlBlock";

export default {
    text: {
        name: 'Text',
        type: 'text',
        icon: FaAlignJustify,
        render: (value) => { return (value as { htmlContent: string }).htmlContent },
        editor: TextBlock,
        defaultValue: {
            htmlContent: '<p>Nouveau Bloc de Texte</p>'
        },
        isResizable: {
            right: true,
            left: true,
            top: false,
            bottom: false,
            bottomLeft: false,
            bottomRight: false,
            topLeft: false,
            topRight: false
        },
        hasSpacingOptions: true
    },
    image: {
        name: 'Image',
        type: 'image',
        icon: FaRegImage,
        render: undefined,
        editor: ImageBlock,
        isResizable: true,
        hasSpacingOptions: true
    },
    group: {
        name: 'Group',
        type: 'group',
        icon: RxGroup,
        render: undefined,
        editor: RowBlock,
        acceptChildren: true,
        isResizable: false,
        defaultValue: {
            flow: 'horizontal'
        },
        hasSpacingOptions: true
    },
    html: {
        name: 'HTML',
        type: 'html',
        icon: FaAlignJustify,
        render: async value => value?.htmlContent ?? '',
        editor: HtmlBlock,
        acceptChildren: false,
        isResizable: false,
        defaultValue: {
            htmlContent: '<div></div>'
        },
        hasSpacingOptions: false
    }
} as { [key: string]: EditorBlock }