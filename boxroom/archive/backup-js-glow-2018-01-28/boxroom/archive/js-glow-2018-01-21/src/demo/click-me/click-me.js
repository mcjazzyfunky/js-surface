import {
    createElement as h,
    defineClassComponent,
    mount,
    Component
} from 'js-glow';

const meta = {
    displayName: 'ClickMe',

    properties: {
        text: {
            type: String,
            defaultValue: ''
        },
        onClick: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    }
};

class CustomComponent extends Component {
    onClick() {
        alert(`You've clicked on "${this.props.text}"`);
    }

    render() {
        return (
            h('button',
                { onClick: () => this.onClick() },
                this.props.text)
        );
    }
}

Object.assign(CustomComponent, meta);

const ClickMe = defineClassComponent(CustomComponent);

mount(ClickMe({ text: 'Click me!' }), 'main-content');
