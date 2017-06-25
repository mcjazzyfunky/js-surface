import {
    defineFunctionalComponent,
    createElement as dom
} from 'js-surface';


export default defineFunctionalComponent({
    displayName: 'FKTab',

    properties: {
        caption: {
            type: String,
            defaultValue: ''
        },
        
        id: {
            type: String,
            defaultValue: null
        }
        /*
        children: {
            type: Types.oneOfType(Types.array, Types.object),
            defaultValue: []
        }
        */
    },
    
    render(props) {
        return (
            dom('div.fk-tab',
                props.caption,
                props.children)
        );
    }
});
