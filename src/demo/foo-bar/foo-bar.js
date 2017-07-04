import {
    createElement as h,
    defineClassComponent,
    render,
    Component
} from 'js-surface';

const App = defineClassComponent(class extends Component {
    static get displayName() {
        return 'App';
    }

    constructor() {
        super();
        this.interval = null;
        this.showFoo = false;
    }

    onDidMount() {
        this.interval = setInterval(() => this.refresh(), 1000);
    }
   
    onWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        this.showFoo = !this.showFoo;

        return this.showFoo
            ? h('header', { ref: this.callback.bind(this, 'Foo') }, 'Foo')
            : h('header', { ref: this.callback.bind(this, 'Bar') }, 'Bar');
    }

    callback(type, ref, previous) {
        console.log(`Callback function invoked - ${type} "ref":`, ref, previous);
    }
});

render(App(), document.getElementById('main-content'));
