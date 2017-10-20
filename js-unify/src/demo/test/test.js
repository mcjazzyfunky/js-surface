import {
    hyperscript as h,
    defineFunctionalComponent,
    mount 
} from 'js-unity';

import PropTypes from 'prop-types';

const HelloWorld = defineFunctionalComponent({
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            defaultValue: 'World'
        }
    },

    render({ name }) {
        return (
            h('div',
                { style: { display: 'block' } },
                `Hello ${name}!`));
    }
});

function HelloWorld2({ name }) {
    return (
        h('div',
            { style: { display: 'block' } },
            `Hello ${name}!`));
}


HelloWorld2.displayName = 'HelloW';

HelloWorld2.propTypes = {
    name: PropTypes.string
};

const HelloWorld3 = defineFunctionalComponent(HelloWorld2); 


mount(HelloWorld3({  }), 'main-content');
