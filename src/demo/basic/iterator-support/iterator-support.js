import {
    createElement as h,
    defineComponent,
    mount 
} from 'js-surface';

const helloWorldContent = {
    [Symbol.iterator]: function * () {
        yield 'H';
        yield 'e';

        yield {
            [Symbol.iterator]: function * () {
                yield 'l';
                yield 'l';
            }
        };

        yield 'o';
        yield ' ';
        yield ['W', 'o', 'r', 'l', {
            [Symbol.iterator]: function * () {
                yield 'd';
                yield '!';
            }
        }];
    }
};

const HelloWorld = defineComponent({
    displayName:  'HelloWorld',

    render() {
        return (
            h('div',
                { style: { display: 'block' } },
                helloWorldContent));
    }
});

mount(HelloWorld(), 'main-content');
