import {
    createElement as h,
    defineComponent,
    mount,
    unmount,
} from 'js-surface';

import { Component } from 'js-surface/addons';

import { Spec } from 'js-spec';

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
            h('div', { style })
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
        
            tiles.push(
                TileFunctional({
                    width: tileWidth,
                    color,
                    key: x
                }));
        }
    
        return h('div', { style: { clear: 'both' } }, tiles);
    }
});

const TileClassBased = defineComponent({
    displayName:  'TileClassBased',
    
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

    main: class extends Component {
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
                h('div', { style })
            );    
        }
    }
});


const TileRowClassBased = defineComponent({
    displayName:  'TileRowClassBased',
    
    properties: {
        tileWidth: {
            type: Number,
            defaultValue: 3
        },
        columnCount: {
            type: Number
        }
    },

    main: class extends Component {
        componentWillUnmount() {
        }
        
        render() {
            const
                { tileWidth, columnCount } = this.props, 
                tiles = [];
        
            for (let x = 0; x < columnCount; ++x) {
                const
                    colorIdx = Math.floor(Math.random() * colors.length),           
                    color = colors[colorIdx];
            
                tiles.push(
                    TileClassBased({
                        width: tileWidth,
                        color: color,
                        key: x
                    }));
            }

            return h('div', { style: { clear: 'both' } }, tiles);
        }
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
            constraint: Spec.oneOf('functional', 'class')
        }
    },

    main: class extends Component {
        constructor(props) { 
            super(props);
            this.__startTime = null;
            this.__frameCount = 0;
            this.__actualFramesPerSecond = '0';
        }
        
        componentDidMount() {
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
        }
        
        componentWillUnmount() {
            clearInterval(this.intervalID);
            this.__startTime = null;
            this.__frameCount = 0;
        }
        
        render() {
            const
                TileRow = this.props.type === 'functional'
                    ? TileRowFunctional
                    : TileRowClassBased,

                rows = [],
                
                style = {
                    marginTop: 40,
                    marginLeft: 40
                };

            

            for (let y = 0; y < this.props.rowCount; ++y) {
                rows.push(
                    TileRow({
                        tileWidth: this.props.tileWidth,
                        columnCount: this.props.columnCount,
                        key: y
                    }));
            }

            return (
                h('div', null,
                    h('div', null,
                        `Rows: ${this.props.rowCount}, columns: ${this.props.columnCount}`,
                        h('div', { style },
                            rows)),
                    h('p', { style: { clear: 'both' } },
                        `(actual frames per second: ${this.__actualFramesPerSecond}`))
            );
        }
    }
});

// ------------------------------------------------------

function onSelectTest(ev) {
    const testName = ev.target.value;
    
    unmount('speed-test');

    switch (testName) {
    case 'functional':
        mount(SpeedTest({ type: 'functional', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    
    case 'class':
        mount(SpeedTest({ type: 'class', columnCount, rowCount, tileWidth }), 'speed-test');
        break;
    }
}

const mainContent = document.getElementById('main-content');

mainContent.innerHTML = `
    <label for="test-selector">Test:</label>
    <select id="test-selector">
        <option value="">Please select...</option>
        <option value="functional">Speed test (js-glow functional)</option>
        <option value="class">Speed test (js-glow class-based)</option>
    </select>

    <br/>
    <br/>
    <div id="speed-test">
    </div>
`;

mainContent.querySelector('select').addEventListener('change', onSelectTest);
