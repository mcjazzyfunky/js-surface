import ComponentHelper from '../helpers/ComponentHelper.js';

import { defineComponent, createElement as htm, Types } from 'js-surface';
import { Seq, Strings } from 'js-prelude';


export default defineComponent({
    displayName: 'FKTab',

    properties: {
        caption: {
            type: Types.string,
            defaultValue: ''
        },
        
        id: {
            type: Types.string,
            defaultValue: null
        }
        /*
        children: {
            type: Types.oneOfType(Types.array, Types.object),
            defaultValue: []
        }
        */
    },
    
    render({ props }) {
        return (
            htm('div',
                {className: 'fk-tab'},
                props.caption,
                props.children
                ));
    }
});
