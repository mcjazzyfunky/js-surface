import { createElement as h, defineComponent }  from 'js-surface'
import { Component } from 'js-surface/classes'

const
  framesPerSecond = 240,
  colors = ['red', 'yellow', 'orange'],
  tileWidth = 5,
  columnCount = 20,
  rowCount = 20

const Tile = defineComponent({
  displayName: 'Tile',
  
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
        backgroundColor: color,
        padding: 0,
        margin: 0
      }
    
    return h('div', { style })
  }
})

const TileRow = defineComponent({
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
      tiles = []

    for (let x = 0; x < columnCount; ++x) {
      const
        colorIdx = Math.floor(Math.random() * colors.length),       
        color = colors[colorIdx]
    
      tiles.push(Tile({ width: tileWidth, color, key: x }))
    }
  
    return h('div', { style: { clear: 'both' }}, tiles)
  }
})

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
    }
  },
    
  main: class extends Component {
    constructor(props) {
      super(props)

      this.__intervalId = null
      this.__startTime = Date.now()
      this.__frameCount = 0
      this.__actualFramesPerSecond = '0'
    }

    render() {
      const
        rows = [],
        
        style = {
          marginTop: 40,
          marginLeft: 40
        }

      for (let y = 0; y < this.props.rowCount; ++y) {
        rows.push(
          TileRow({
            tileWidth: this.props.tileWidth,
            columnCount: this.props.columnCount,
            key: y
          }))
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
      )
    }

    componentDidMount() {
      this.intervalId = setInterval(() => {
        ++this.__frameCount
        this.forceUpdate()

        if (this.__frameCount % 10 === 0) {
          this.__actualFramesPerSecond =
            (this.__frameCount * 1000.0 /
              (Date.now() - this.__startTime)).toFixed(2)
        }
      }, 1000 / framesPerSecond)
    }

    componentWillUnmount() {
      clearInterval(this.intervalId)
    }
  },
})

export default SpeedTest({ tileWidth, columnCount, rowCount })