import {
    createElement as h,
    defineComponent,
    mount,
    Adapter 
}  from 'js-surface';

import { Spec } from 'js-spec';

// Config.validateProps = false;

const
    framesPerSecond = 240,
    colors = ['red', 'yellow', 'orange'],
    tileWidth = 5,
    columnCount = 20,
    rowCount = 20;

const TileFunctional = defineComponent({
    displayName:  'TileFunctional',
    
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

const TileRowFunctional = defineComponent({
    displayName:  'TileRowFunctional',
   
    properties: {
        tileWidth: {
            type: Number,
            defaultValue: 3
        },
        columnCount: {
            type: Number
        }
    },
    
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

const TileStandard = defineComponent({
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
    
    main(updateView) {
        return {
            setProps(props) {
                const
                    { width, color } = props,
                
                    style = {
                        float: 'left',
                        width: width + 'px',
                        height: width + 'px',
                        backgroundColor: color
                    };
                
                updateView(h('div', { style }));
            }
        };
    }
});

const TileRowStandard = defineComponent({
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
    
    main(updateView) {
        return {
            setProps(props) {
                const
                    { tileWidth, columnCount } = props, 
                    tiles = [];
            
                for (let x = 0; x < columnCount; ++x) {
                    const
                        colorIdx = Math.floor(Math.random() * colors.length),           
                        color = colors[colorIdx];
                
                    tiles.push(TileStandard({ width: tileWidth, color, key: x }));
                }
            
                updateView(h('div', { style: { clear: 'both' }}, tiles));
            }
        };
    }
});

const SpeedTest = defineComponent({
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
        
    main(updateView) {
        let
            props = null,
            startTime = Date.now(),
            frameCount = 0,
            actualFramesPerSecond = '0',

            render = props => {
                const
                    tileRowFactory = props.type === 'functional'
                        ? TileRowFunctional
                        : TileRowStandard,

                    rows = [],
                    
                    style = {
                        marginTop: 40,
                        marginLeft: 40
                    };

                for (let y = 0; y < props.rowCount; ++y) {
                    rows.push(
                        tileRowFactory({
                            tileWidth: props.tileWidth,
                            columnCount: props.columnCount,
                            key: y
                        }));
                }
                
                return (
                    h('div',
                        null,
                        h('div',
                            null,
                            `Rows: ${props.rowCount}, columns: ${props.columnCount}`,
                            h('div',
                                { style },
                                rows)),
                        h('p',
                            { style: { clear: 'both' } },
                        `(actual frames per second: ${actualFramesPerSecond})`))
                );
            },

            intervalId = setInterval(() => {
                ++frameCount;
                updateView(render(props)); 

                if (frameCount % 10 === 0) {
                    actualFramesPerSecond =
                        (frameCount * 1000.0 /
                            (Date.now() - startTime)).toFixed(2);
                }
            }, 1000 / framesPerSecond);

        return {
            setProps(nextProps) {
                props = nextProps;
                updateView(render(props));
            },

            close() {
                clearInterval(intervalId);
                intervalId = null,
                startTime = null;
                frameCount = 0;
            }
        };
    },
});

// ------------------------------------------------------
/*
let htm = null;

switch (Adapter.name) {
case 'react':
    htm = Adapter.api.React.createElement;
    break;

case 'react-lite':
    htm = Adapter.api.createElement;
    break;

case 'preact':
    htm = Adapter.api.h;
    break;

case 'inferno':
    htm = Adapter.api.Inferno.createElement;
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

const TileStandardDirect = defineComponent({
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

const TileRowStardardDirect = defineComponent({
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

const SpeedTestDirect = defineComponent({
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

*/

const mainContent = document.getElementById('main-content');

function onSelectTest(ev) {
    const testName = ev.target.value;

    mount(null, 'main-content');

    switch (testName) {
    case 'surface-functional':
        mount(SpeedTest({ type: 'functional', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    case 'surface-standard':
        mount(SpeedTest({ type: 'standard', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    case 'original-functional':
        mount(SpeedTestDirect({ type: 'functional', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    case 'original-standard':
        mount(SpeedTestDirect({ type: 'standard', columnCount, rowCount, tileWidth }), 'speed-test');
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
        <!-- option value="original-functional">Speed test (${Adapter.name} functional)</option -->
        <!-- option value="original-standard">Speed test (${Adapter.name} standard)</option -->
    </select>

    <br/>
    <br/>
    <div id="speed-test">
    </div>
`;


mainContent.querySelector('select').addEventListener('change', onSelectTest);



