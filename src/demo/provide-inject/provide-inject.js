import {
    createElement as dom,
    defineClassComponent,
    render,
    Component
} from 'js-surface';

const Parent = defineClassComponent(class extends Component {
    static get displayName() {
        return 'Parent';
    }

    static get properties() {
        return {
            value: {
                type: String
            }
        };
    }

    static provide() {
        
    }

    render() {
        return dom('div',
            dom('div', 'Provided value: ', this.props.value),
            dom('div',
                Child()));
    }
});

const Child = defineClassComponent(class extends Component {
    static get displayName() {
        return 'Child';
    }

    static get properties() {
        return {
            value: {
                type: String,
                inject: true,
                preset: 'default value'
            }
        };
    }

    render() {
        return dom('div', 'Child(', this.props.value, ')');
    }
});


render(Parent({ value: 'the-value' }), 'main-content');