import { defineClassComponent, Component } from 'js-surface';
import { Spec } from 'js-spec';

export default defineClassComponent(class extends Component {
    static get displayName() {
        return 'SurfaceReduxProvider';
    }

    static get properties() {
        return {
            storage: {
                type: Object,
                constraint: Spec.shape({
                    subscribe: Spec.func,
                    dispatch: Spec.func
                })
            },

            children: {
                type: Array,
                defaultValue: []
            }
        };
    }

    static get childInjection() {
        return {
            keys: 'store',

            get(props) {
                return { store: props.store };
            }        
        };
    }

    render() {
        return this.props.children[0] || null; 
    }
});