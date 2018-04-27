import { createElement as h, Adapter } from 'js-bling';

const
    iterationCount = 100000,
    contentContainer = document.getElementById('main-content'),
    adapterName = Adapter.name,
    tests = [];

let createElement = null;

switch (adapterName) {
case 'react':
    createElement = Adapter.api.React.createElement;
    break;

case 'preact':
    createElement = Adapter.api.Preact.h;
    break;

case 'dio':
    createElement = Adapter.api.Dio.createElement;
    break;
}

contentContainer.innerHTML = 'Please wait - performance stests are running ...';
let report = '';

if (adapterName !== 'vue') {
    tests.push({
        displayName: `Using '${Adapter.name}'`,

        run() {
            for (let i = 0; i < iterationCount; ++i) {
                createElement('div',
                    { className: 'my-class', id: 'my-id' },
                    createElement('div', { className: 'my-class2', id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5));
            }
        }
    });
}

tests.push({
    displayName: 'Using js-bling with hyperscript (optimal)',

    run() {
        for (let i = 0; i < iterationCount; ++i) {
            h('div',
                { className: 'my-class', id: 'my-id' },
                h('div', { className: 'my-class2', id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5)); 
        }
    }
});

tests.push({
    displayName: 'Using js-bling with hyperscript (normal)',

    run() {
        for (let i = 0; i < iterationCount; ++i) {
            h('div.my-class#my-id',
                h('div.my-class2#my-id2', 'my-div', 1, 2, 3, 4, 5));
        }
    }
});

tests.push({
    displayName: 'Using js-bling with hyperscript (with merging)',

    run() {
        for (let i = 0; i < iterationCount; ++i) {
            h('div.my-class', { id: 'my-id '},
                h('div.my-class2', { id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5)); 
        }
    }
});

tests.push({
    displayName: 'Using js-bling with hyperscript (with nesting)',

    run() {
        for (let i = 0; i < iterationCount; ++i) {
            h('div.my-class#my-id > div.my-class2#my-id2', 'my-div', 1, 2, 3, 4, 5); 
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
