import { createElement as h, defineComponent } from 'js-surface'
import { view, Component } from 'js-surface/common'

const
  framesPerSecond = 240,
  colors = ['red', 'yellow', 'orange'],
  tileWidth = 5,
  columnCount = 20,
  rowCount = 20

let
  startTime = Date.now(),
  frameCount = 0,
  actualFramesPerSecond = '0'

const
  Tile = defineComponent({
    displayName: 'Tile',

    main: view(props => {
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
    })
  }),

  TileRow = defineComponent({
    displayName: 'TileRow',
    
    main: view(props => {
      const
        { tileWidth, columnCount } = props,
        tiles = []

      for (let x = 0; x < columnCount; ++x) {
        const
          colorIdx = Math.floor(Math.random() * colors.length),       
          color = colors[colorIdx]
        
        tiles.push(h(Tile, { width: tileWidth, color, key: x }))
      }
    
      return h('div', { style: { clear: 'both' }}, tiles)
    })
  }),

  SpeedTest = defineComponent({
    displayName: 'SpeedTest',

    main: view(() => {
      const
        rows = [],
      
        style = {
          marginTop: 40,
          marginLeft: 40
        }

      for (let y = 0; y < rowCount; ++y) {
        rows.push(
          h(TileRow, {
            tileWidth: tileWidth,
            columnCount: columnCount,
            key: y
          }))
      }
    
      return (
        h('div',
          null,
          h('div',
            null,
            `Rows: ${rowCount}, columns: ${columnCount}`,
            h('div',
             { style },
             rows)),
          h('p',
            { style: { clear: 'both' } },
           `(actual frames per second: ${actualFramesPerSecond})`))
      )
    })
  }),

  Main = defineComponent({
    displayName: 'Main',
    
    main: class extends Component {
      constructor(props) {
        super(props)

        this.intervalId = null
      }

      render() {
        return h(SpeedTest, { tileWidth, columnCount, rowCount })
      }

      componentDidMount() {
        this.intervalId = setInterval(() => {
          ++frameCount
          this.forceUpdate() 

          if (frameCount % 10 === 0) {
            actualFramesPerSecond =
            (frameCount * 1000.0 /
            (Date.now() - startTime)).toFixed(2)
          }
        }, 1000 / framesPerSecond)
      }

      componentWillUnmount() {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    }
  })

export default h(Main) 
