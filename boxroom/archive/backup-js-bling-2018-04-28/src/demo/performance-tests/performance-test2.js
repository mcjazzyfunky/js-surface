import { createElement as h, defineComponent, mount } from 'js-bling';
import { defineMessages, defineStore } from 'js-messages';
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

    render({ props }) {
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

    render({ props }) {
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

    render({ props }) {
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

    render({ props }) {
        const
            { tileWidth, columnCount } = props, 
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
});

const
    createState = () => ({
        startTime: null,
        frameCount: 0,
        actualFramesPerSecond: 0,
        intervalId: null
    }),

    actions = defineMessages({
        setStartTime: value => ({
            update: state => ({ ...state, startTime: value })
        }),


        increaseFrameCount: () => {
            return {
                update: state => {
                    return ({ ...state, frameCount: state.frameCount + 1 });
                }
            };
        },
        
        setFrameCount: value => {
            return {
                update: state => ({ ...state, frameCount: value })
            };
        },

        setActualFramesPerSecond: value => ({
            update: state => ({ ...state, actualFramesPerSecond: value }),
        }),
        
        setIntervalId: value => ({
            update: state => ({ ...state, intervalId: value })
        }),

        start: () => ({        
            effect({ dispatch, getState }) {
                dispatch(actions.setStartTime(Date.now()));

                const intervalId = setInterval(() => {
                    dispatch(actions.increaseFrameCount());

                    const
                        state = getState(),
                        frameCount = state.frameCount;

                    if (frameCount % 10 === 0) {
                        const actualFramesPerSecond =
                            (frameCount * 1000.0 /
                                (Date.now() - state.startTime)).toFixed(2);

                        dispatch(actions.setActualFramesPerSecond(actualFramesPerSecond));
                    }
                }, 1000 / framesPerSecond);

                dispatch(actions.setIntervalId(intervalId));
            }
        }),

        stop: () => ({
            effect({ dispatch, getState }) {
                clearInterval(getState().interalId);
                dispatch(actions.setStartTime(null));
                dispatch(actions.setFrameCount(0));
                dispatch(actions.setIntervalId(null));
            }
        })
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

    init: defineStore(actions, createState),

    lifecycle: {
        didMount: actions.start(),
        willUnmount: actions.stop()
    },
 
    render({ props, state }) {
        const
            TileRow = props.type === 'functional'
                ? TileRowFunctional
                : TileRowClassBased,

            rows = [],
            
            style = {
                marginTop: 40,
                marginLeft: 40
            };

        for (let y = 0; y < props.rowCount; ++y) {
            rows.push(
                TileRow({
                    tileWidth: props.tileWidth,
                    columnCount: props.columnCount,
                    key: y
                }));
        }

        return (
            h('div',
                h('div',
                    `Rows: ${props.rowCount}, columns: ${props.columnCount}`,
                    h('div', { style },
                        rows)),
                h('div', { style: { clear: 'both' } },
                    `(actual frames per second: ${state.actualFramesPerSecond})`))
        );
    }
});

// ------------------------------------------------------

function onSelectTest(ev) {
    const testName = ev.target.value;
    
    mount(null, 'speed-test');

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
        <option value="functional">Speed test (js-bling functional)</option>
        <option value="class">Speed test (js-bling class-based)</option>
    </select>

    <br/>
    <br/>
    <div id="speed-test">
    </div>
`;

mainContent.querySelector('select').addEventListener('change', onSelectTest);
