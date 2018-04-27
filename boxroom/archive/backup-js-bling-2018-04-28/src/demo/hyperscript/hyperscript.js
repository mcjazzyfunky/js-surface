import { createElement as h, defineComponent, mount } from 'js-bling';

const HyperscriptDemo = defineComponent({
    displayName:  'HyperscriptDemo',

    render() {
        return (
            h('#my-id.my-class.my-other-class > .some-class > #some-id',
                h('span', 'This is rendered by '),
                h('b', 'hyperscript'))
        );
    }
});

const
    container = document.getElementById('main-content'),
    div = document.createElement('div');

mount(HyperscriptDemo(), div);

const htmlText = div.innerHTML;

container.appendChild(div);
container.appendChild(document.createElement('hr'));
container.appendChild(document.createTextNode(htmlText));



