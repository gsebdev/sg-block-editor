import ImageBlock from "./blocks/ImageBlock";
import { FaRegImage } from "react-icons/fa6";
import { FaAlignJustify } from "react-icons/fa6";
import { RxGroup } from "react-icons/rx";
import TextBlock from "./blocks/TextBlock";
import RowBlock from "./blocks/GroupBlock";
export default {
    text: {
        name: 'Text',
        type: 'text',
        icon: FaAlignJustify,
        render: undefined,
        editor: TextBlock,
        defaultValue: {
            htmlContent: '<p>Nouveau Bloc de Texte</p>'
        },
        isResizable: true,
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
        autoChildrenSizing: true,
        isResizable: true,
        defaultValue: {
            flow: 'horizontal',
            height: '280px'
        },
        hasSpacingOptions: true
    }
};