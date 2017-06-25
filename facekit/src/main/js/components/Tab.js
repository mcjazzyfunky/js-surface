import {
    defineFunctionalComponent,
    createElement as dom
} from 'js-surface';


export default defineFunctionalComponent({
    displayName: 'FKTab',

    properties: {
        caption: {
            type: String,
            preset: ''
        },
        
        id: {
            type: String,
            preset: null
        }
        /*
        children: {
            type: Types.oneOfType(Types.array, Types.object),
            preset: []
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
