import {
    defineClassComponent,
    defineFunctionalComponent,
    createElement as h,
    render,
    RenderEngine
}  from 'js-surface';

import { Spec } from 'js-spec';

const framesPerSecond = 240;

const COLORS = ['red', 'yellow', 'orange'];

const TileFunctional = defineFunctionalComponent({
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

const TileRowFunctional = defineFunctionalComponent({
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
                colorIdx = Math.floor(Math.random() * COLORS.length),           
                color = COLORS[colorIdx];
           
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
                colorIdx = Math.floor(Math.random() * COLORS.length),           
                color = COLORS[colorIdx];
           
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
                h('div',
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
        disposal = render(SpeedTest({ type: 'functional', columnCount: 20, rowCount: 20, tileWidth: 5 }), 'speed-test');
        break;
    
    case 'surface-standard':
        disposal = render(SpeedTest({ type: 'standard', columnCount: 20, rowCount: 20, tileWidth: 5 }), 'speed-test');
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
