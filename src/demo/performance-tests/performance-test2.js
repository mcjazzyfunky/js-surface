import {
    defineClassComponent,
    defineFunctionalComponent,
    hyperscript as h,
    mount,
    ComponentSystem 
}  from 'js-surface';

import { Spec } from 'js-spec';

ComponentSystem.config.validateProps = false;

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

switch (ComponentSystem.adapter.name) {
case 'inferno':
    htm = ComponentSystem.adapter.api.Inferno.createElement;
    break;

case 'react-dom':
    htm = ComponentSystem.adapter.api.React.createElement;
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
        disposal.unmount();
        disposal = null;
    }

    switch (testName) {
    case 'surface-functional':
        disposal = mount(SpeedTest({ type: 'functional', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    case 'surface-standard':
        disposal = mount(SpeedTest({ type: 'standard', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    case 'original-functional':
        disposal = mount(SpeedTestDirect({ type: 'functional', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    case 'original-standard':
        disposal = mount(SpeedTestDirect({ type: 'standard', columnCount, rowCount, tileWidth }), 'speed-test');
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
        <option value="original-functional">Speed test (${ComponentSystem.adapter.name} functional)</option>
        <option value="original-standard">Speed test (${ComponentSystem.adapter.name} standard)</option>
    </select>

    <br/>
    <br/>
    <div id="speed-test">
    </div>
`;

mainContent.querySelector('select').addEventListener('change', onSelectTest);



