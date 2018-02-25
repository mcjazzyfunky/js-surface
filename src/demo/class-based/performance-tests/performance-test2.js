import Surface from 'js-surface';
import { Html as HtmlReact } from 'js-dom-factories/react';
import { Html as HtmlDio } from 'js-dom-factories/dio';
import { Html as HtmlUniversal } from 'js-dom-factories/universal';

const Html =
    Surface.Adapter.name === 'react'
        ? HtmlReact
        : (Surface.Adapter.name === 'dio' ? HtmlDio : HtmlUniversal);

const
    iterationCount = 200000,
    contentContainer = document.getElementById('main-content'),
    adapterName = Surface.Adapter.name,
    tests = [];

let createElement = null;

switch (adapterName) {
case 'react':
    createElement = Surface.Adapter.api.React.createElement;
    break;

case 'dio':
    createElement = Surface.Adapter.api.Dio.createElement;
    break;

case 'surface':
    createElement = Surface.Adapter.api.Surface.createElement;
    break;
}

contentContainer.innerHTML = 'Please wait - performance stests are running ...';
let report = '';

if (adapterName !== 'vue') {
    tests.push({
        displayName: `Using '${Surface.Adapter.name}'`,

        run() {
            for (let i = 0; i < iterationCount; ++i) {
                createElement('div',
                    { className: 'my-class', id: 'my-id' },
                    createElement('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
            }
        }
    });
}

tests.push({
    displayName: 'Using js-surface with createElement',

    run() {
        for (let i = 0; i < iterationCount; ++i) {
            Surface.createElement('div',
                { className: 'my-class', id: 'my-id' },
                Surface.createElement('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
        }
    }
});

tests.push({
    displayName: 'Using surface with HTML builder',

    run() {
        for (let i = 0; i < iterationCount; ++i) {
            Html.div({ className: 'my-class', id: 'my-id' },
                Html.div({ className: 'my-class2', id: 'my-id2'}, 'my-div'));     
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
