import 'babel-polyfill';
import { createElement as h, defineComponent, mount } from '../main/js-surface';
import demos from './available-demos';

const DemoSelector = defineComponent({
  displayName: 'DemoSelector',

  main: {
    type: 'advanced',

    init(getProps, getState, updateState, forceUpdate) {
      let currDemoIdx = Math.floor(document.location.href.replace(/^.*idx=/, '')) || 0;

      function startDemo(idx) {
        currDemoIdx = idx;
        document.location.href = document.location.href.replace(/\#.*$/, '') + '#idx=' + currDemoIdx;
        forceUpdate();
      }

      return {
        render() {
          const options = [];

          for (let i = 0; i < demos.length; ++i) {
            const demo = demos[i];
            
            options.push(h('option', { key: i, value: i }, demo.title));
          }

          return (
            h('div',
              h('div',
                h('label',
                  'Select demo: ',
                  h('select', { onChange: ev => startDemo(ev.target.value), value: currDemoIdx }, options))),
              h('br'),
              h('div', demos[currDemoIdx].content))
          );
        }
      };
    }
  }
});


const Demo = defineComponent({
  displayName: 'Demo',

  main: {
    type: 'basic',

    render() {
      return h('div', h('div', DemoSelector()));
    }
  }
});

mount(Demo(), 'main-content');