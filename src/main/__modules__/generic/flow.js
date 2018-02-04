import { createElement as h } from 'js-surface';

export {
    defineFlow
};


function defineFlow(config) {
    return {
        normalizeComponent(meta) {
            return (updateView, updateState) => {
                return {
                    setProps() {
                        updateView(h('div', null, 'Juhu'));
                    },

                    close() {
                    }
                };
            };
        }
    };
}


