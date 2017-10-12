import {
    defineClassComponent,
    defineFunctionalComponent,
    createElement as h,
    render,
    RenderEngine
}  from 'js-surface';

import { Spec } from 'js-spec';
/*
const
    framesPerSecond = 240,
    colors = ['red', 'yellow', 'orange'],
    tileWidth = 5,
    columnCount = 20,
    rowCount = 20;

const TileFunctional = defineFunctionalComponent({
    displayName:  'TileFunctional',
    
    properties: ['color', 'width'],
    
    // properties: {
    //     color: {
    //         type: String,
    //         defaultValue: 'white'
    //     },
    //     width: {
    //         type: Number,
    //         defaultValue: 3
    //     }
    // },
    
    render(props) {
        const  
            { width, color } = props,
        
            style = {
                float: 'left',
                width: width + 'px',
                height: width + 'px',
                backgroundColor: color
            };
        
        return (
            h('div',
                { style })
        );    
    }
});

const TileRowFunctional = defineFunctionalComponent({
    displayName:  'TileRowFunctional',
    
    properties: ['tileWidth', 'columnCount'],

    // properties: {
    //     tileWidth: {
    //         type: Number,
    //         defaultValue: 3
    //     },
    //     columnCount: {
    //         type: Number
    //     }
    // },
    
    render(props) {
        const
            { tileWidth, columnCount } = props, 
            tiles = [];
       
        for (let x = 0; x < columnCount; ++x) {
            const
                colorIdx = Math.floor(Math.random() * colors.length),           
                color = colors[colorIdx];
           
            tiles.push(TileFunctional({ width: tileWidth, color, key: x }));
        }
       
        return h('div', { style: { clear: 'both' }}, tiles);
    }
});

const TileStandard = defineClassComponent({
    displayName:  'TileStandard',
    
    properties: {
        color: {
            type: String,
            defaultValue: 'white'
        },
        width: {
            type: Number,
            defaultValue: 3
        }
    },
    
    render() {
        const
            { width, color } = this.props,
        
            style = {
                float: 'left',
                width: width + 'px',
                height: width + 'px',
                backgroundColor: color
            };
        
        return (
            h('div',
                { style })
        );    
    }
});

const TileRowStandard = defineClassComponent({
    displayName:  'TileRowStandard',
    
    properties: {
        tileWidth: {
            type: Number,
            defaultValue: 3
        },
        columnCount: {
            type: Number
        }
    },
    
    render() {
        const
            { tileWidth, columnCount } = this.props, 
            tiles = [];
       
        for (let x = 0; x < columnCount; ++x) {
            const
                colorIdx = Math.floor(Math.random() * colors.length),           
                color = colors[colorIdx];
           
            tiles.push(TileStandard({ width: tileWidth, color, key: x }));
        }
       
        return h('div', { style: { clear: 'both' }}, tiles);
    }
});

const SpeedTest = defineClassComponent({
    displayName: 'SpeedTest',

    properties: {
        columnCount: {
            type: Number
        },
        rowCount: {
            type: Number
        },
        tileWidth: {
            type: Number,
            defaultValue: 3
        },
        type: {
            type: String,
            constraint: Spec.oneOf('functional', 'standard')
        }
    },
        
    constructor() {
        this.__startTime = null;
        this.__frameCount = 0;
        this.__actualFramesPerSecond = '0';
    },
    
    onDidMount() {
        this.__startTime = Date.now();

        this.intervalID = setInterval(() => {
            ++this.__frameCount;
            this.forceUpdate();

            if (this.__frameCount % 10 === 0) {
                this.__actualFramesPerSecond =
                    (this.__frameCount * 1000.0 /
                        (Date.now() - this.__startTime)).toFixed(2);
            }
        }, 1000 / framesPerSecond);
    },
    
    onWillUnmount() {
        clearInterval(this.intervalID);
        this.__startTime = null;
        this.__frameCount = 0;
    },
    
    render() {
        const
            tileRowFactory = this.props.type === 'functional'
                ? TileRowFunctional
                : TileRowStandard,

            rows = [],
            
            style = {
                marginTop: 40,
                marginLeft: 40
            };

        

        for (let y = 0; y < this.props.rowCount; ++y) {
            rows.push(
                tileRowFactory({
                    tileWidth: this.props.tileWidth,
                    columnCount: this.props.columnCount,
                    key: y
                }));
        }
        
        return (
            h('div',
                null,
                h('div',
                    null,
                    `Rows: ${this.props.rowCount}, columns: ${this.props.columnCount}`,
                    h('div',
                        { style },
                        rows)),
                h('p',
                    { style: { clear: 'both' } },
                   `(actual frames per second: ${this.__actualFramesPerSecond})`))
        );
    }
});

// ------------------------------------------------------

let htm = null;

switch (RenderEngine.name) {
case 'inferno':
    htm = RenderEngine.api.Inferno.createElement;
    break;

case 'react-dom':
    htm = RenderEngine.api.React.createElement;
    break;
}


function TileFunctionalDirect(props) {
    const  
        { width, color } = props,
    
        style = {
            float: 'left',
            width: width + 'px',
            height: width + 'px',
            backgroundColor: color
        };
    
    return (
        htm('div',
            { style })
    );    
}

TileFunctionalDirect.displayName = 'TileFunctionalDirect';

function TileRowFunctionalDirect(props) {
    const
        { tileWidth, columnCount } = props, 
        tiles = [];

    for (let x = 0; x < columnCount; ++x) {
        const
            colorIdx = Math.floor(Math.random() * colors.length),           
            color = colors[colorIdx];
    
        tiles.push(TileFunctionalDirect({ width: tileWidth, color, key: x }));
    }

    return htm('div', { style: { clear: 'both' }}, tiles);
}

TileRowFunctionalDirect.displayName = 'TileRowFunctionalDirect';

const TileStandardDirect = defineClassComponent({
    displayName:  'TileStardardDirect',
    
    properties: {
        color: {
            type: String,
            defaultValue: 'white'
        },
        width: {
            type: Number,
            defaultValue: 3
        }
    },
    
    render() {
        const
            { width, color } = this.props,
        
            style = {
                float: 'left',
                width: width + 'px',
                height: width + 'px',
                backgroundColor: color
            };
        
        return (
            htm('div',
                { style })
        );    
    }
});

const TileRowStardardDirect = defineClassComponent({
    displayName:  'TileRowStardardDirect',
    
    properties: {
        tileWidth: {
            type: Number,
            defaultValue: 3
        },
        columnCount: {
            type: Number
        }
    },
    
    render() {
        const
            { tileWidth, columnCount } = this.props, 
            tiles = [];
       
        for (let x = 0; x < columnCount; ++x) {
            const
                colorIdx = Math.floor(Math.random() * colors.length),           
                color = colors[colorIdx];
           
            tiles.push(TileStandardDirect({ width: tileWidth, color, key: x }));
        }
       
        return htm('div', { style: { clear: 'both' }}, tiles);
    }
});

const SpeedTestDirect = defineClassComponent({
    displayName: 'SpeedTestDirect',

    properties: {
        columnCount: {
            type: Number
        },
        rowCount: {
            type: Number
        },
        tileWidth: {
            type: Number,
            defaultValue: 3
        },
        type: {
            type: String,
            constraint: Spec.oneOf('functional', 'standard')
        }
    },
        
    constructor() {
        this.__startTime = null;
        this.__frameCount = 0;
        this.__actualFramesPerSecond = '0';
    },
    
    onDidMount() {
        this.__startTime = Date.now();

        this.intervalID = setInterval(() => {
            ++this.__frameCount;
            this.forceUpdate();

            if (this.__frameCount % 10 === 0) {
                this.__actualFramesPerSecond =
                    (this.__frameCount * 1000.0 /
                        (Date.now() - this.__startTime)).toFixed(2);
            }
        }, 1000 / framesPerSecond);
    },
    
    onWillUnmount() {
        clearInterval(this.intervalID);
        this.__startTime = null;
        this.__frameCount = 0;
    },
    
    render() {
        const
            tileRowFactory = this.props.type === 'functional'
                ? TileRowFunctionalDirect
                : TileRowStardardDirect,

            rows = [],
            
            style = {
                marginTop: 40,
                marginLeft: 40
            };

        for (let y = 0; y < this.props.rowCount; ++y) {
            rows.push(
                tileRowFactory({
                    tileWidth: this.props.tileWidth,
                    columnCount: this.props.columnCount,
                    key: y
                }));
        }
        
        return (
            htm('div',
                null,
                htm('div',
                    null,
                    `Rows: ${this.props.rowCount}, columns: ${this.props.columnCount}`,
                    h('div',
                        { style },
                        rows)),
                htm('p',
                    { style: { clear: 'both' } },
                   `(actual frames per second: ${this.__actualFramesPerSecond})`))
        );
    }
});


const mainContent = document.getElementById('main-content');

let disposal = null;

function onSelectTest(ev) {
    const testName = ev.target.value;

    if (disposal) {
        disposal.dispose();
        disposal = null;
    }

    switch (testName) {
    case 'surface-functional':
        disposal = render(SpeedTest({ type: 'functional', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    case 'surface-standard':
        disposal = render(SpeedTest({ type: 'standard', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    case 'original-functional':
        disposal = render(SpeedTestDirect({ type: 'functional', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    case 'original-standard':
        disposal = render(SpeedTestDirect({ type: 'standard', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    
    default:
        document.getElementById('speed-test').innerHTML = '';
    }
}

mainContent.innerHTML = `
    <label for="test-selector">Test:</label>
    <select id="test-selector">
        <option value="">Please select...</option>
        <option value="surface-functional">Speed test (js-surface functional)</option>
        <option value="surface-standard">Speed test (js-surface standard)</option>
        <option value="original-functional">Speed test (${RenderEngine.name} functional)</option>
        <option value="original-standard">Speed test (${RenderEngine.name} standard)</option>
    </select>

    <br/>
    <br/>
    <div id="speed-test">
    </div>
`;

mainContent.querySelector('select').addEventListener('change', onSelectTest);

*/

if (RenderEngine.name === 'react-dom' || RenderEngine.name === 'inferno') {
    const createElement =
        RenderEngine.name === 'react-dom'
            ? RenderEngine.api.React.createElement
            : RenderEngine.api.Inferno.createElement;

    const start = Date.now();

    for (let i = 0; i < 300000; ++i) {
        createElement('div',
            { class: 'my-class', id: 'my-id' },
            createElement('div', { class: 'my-class2', id: 'my-id2'}, 'my-div'));    
    }

    const end = Date.now();


    console.log('Duration:', (end - start) / 1000);

    const start2 = Date.now();
    //const h2 = (...args) => React.createElement(...args);
    for (let i = 0; i < 300000; ++i) {
    //    let x = h('div.my-class#my-id > div.my-class2#my-id2', 'my-div');
        h('div',
            { className: 'my-class', id: 'my-id' },
            h('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
    }

    const end2 = Date.now();

    console.log('Duration2:', (end2 - start2) / 1000);

    const start3 = Date.now();
    //const h2 = (...args) => React.createElement(...args);
    for (let i = 0; i < 300000; ++i) {
    //    let x = h('div.my-class#my-id > div.my-class2#my-id2', 'my-div');
        h('div#my-id.my-class',
            null,
            h('div#my-id2.my-class2', null,  'my-div'));    
    }

    const end3 = Date.now();

    console.log('Duration3:', (end3 - start3) / 1000);

    const start4 = Date.now();
    //const h2 = (...args) => React.createElement(...args);
    for (let i = 0; i < 300000; ++i) {
        h('div.my-class#my-id > div.my-class2#my-id2', 'my-div');
    }

    const end4 = Date.now();

    console.log('Duration4:', (end4 - start4) / 1000);
}