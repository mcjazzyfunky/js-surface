import {
    defineComponent,
    createElement as h,
    render,
    Component,
}  from 'js-surface';

const COLORS = ['red', 'yellow', 'orange'];

const Tile = defineComponent({
    displayName:  'Tile',
    
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

const TileRow = defineComponent(({
    displayName:  'TileRow',
    
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
           
            tiles.push(Tile({ width: tileWidth, color, key: x }));
        }
       
        return h('div', { style: { clear: 'both' }}, tiles);
    }
}));

class SpeedTestComponent extends Component {
    static get displayName() {
        return 'SpeedTest';
    }

    static get properties() {    
        return {
            columnCount: {
                type: Number
            },
            rowCount: {
                type: Number
            },
            tileWidth: {
                type: Number,
                defaultValue: 3
            }
        };
    }
        
    constructor(props) {
        super(props);
    }
    
    onDidMount() {
        this.intervalID = setInterval(() => {
            this.refresh();
        }, 20);
    }
    
    onWillUnmount() {
        clearInterval(this.intervalID);
    }
    
    render() {
        const
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
            h('div',
                h('div',
                    `Rows: ${this.props.rowCount}, columns: ${this.props.columnCount}`,
                    h('div',
                        { style },
                        rows)))
        );
    }
}

const SpeedTest = defineComponent(SpeedTestComponent);

render(SpeedTest({ columnCount: 20, rowCount: 20, tileWidth: 5 }), 'main-content');
