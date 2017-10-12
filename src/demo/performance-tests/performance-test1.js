
import { createElement as h, RenderEngine } from 'js-surface';

const
    iterationCount = 200000,
    contentContainer = document.getElementById('main-content'),
    tests = [];

let createElement;

switch (RenderEngine.name) {
case 'react-dom':
    createElement = RenderEngine.api.React.createElement;
    break;

case 'inferno':
    createElement = RenderEngine.api.Inferno.createElement;
    break;

default:
    throw Error('Not implemented yet');
}

contentContainer.innerHTML = 'Please wait - performance stests are running ...';
let report = '';


tests.push({
    displayName: `Using '${RenderEngine.name}'`,

    run() {
        for (let i = 0; i < iterationCount; ++i) {
            createElement('div',
                { class: 'my-class', id: 'my-id' },
                createElement('div', { class: 'my-class2', id: 'my-id2'}, 'my-div'));    
        }
    }
});

tests.push({
    displayName: 'Using js-surface without hyperscript',

    run() {
        for (let i = 0; i < iterationCount; ++i) {
        //    let x = h('div.my-class#my-id > div.my-class2#my-id2', 'my-div');
            h('div',
                { class: 'my-class', id: 'my-id' },
                h('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
        }
    }
});

tests.push({
    displayName: 'Using surface with hyperscript',

    run() {
        for (let i = 0; i < iterationCount; ++i) {
        //    let x = h('div.my-class#my-id > div.my-class2#my-id2', 'my-div');
            h('div#my-id.my-class',
                null,
                h('div#my-id2.my-class2', null,  'my-div'));    
        }
    }
});

for (let i = 0; i < tests.length; ++i) {
    const
        test = tests[i],
        startTime = Date.now();
    
    test.run();

    const
        stopTime = Date.now(),
        duration = (stopTime - startTime) + ' ms';

    const message = `Run time for test '${test.displayName}': ${duration}`;

    if (i == 0) {
        report = message;
    } else {
        report += '<br/>' + message;
    }
}

report += '<br/><br/>All tests finished.';
contentContainer.innerHTML = report;
