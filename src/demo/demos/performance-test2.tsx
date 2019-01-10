import { createElement, defineComponent }  from '../../modules/core/main/index'
import { useState, useEffect } from '../../modules/hooks/main/index'

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
    
    return <div style={style}/>
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
  
    return <div style={{ clear: 'both' }}>{tiles}</div>
  }
})

type SpeedTestProps = {
  columnCount: number,
  rowCount: number,
  tileWidth: number
}

const SpeedTest = defineComponent<SpeedTestProps>({
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
    
  render(props) {
    const
      [data, setData] = useState(() => ({
        intervalId : null,
        startTime: Date.now(),
        frameCount: 0,
        actualFramesPerSecond: '0'
      })),

      rows = [],
        
      style = {
        marginTop: 40,
        marginLeft: 40
      }

      useEffect(() => {
        data.intervalId = setInterval(() => {
          ++data.frameCount
          setData(data)

          if (data.frameCount % 10 === 0) {
            data.actualFramesPerSecond =
              (data.frameCount * 1000.0 /
                (Date.now() - data.startTime)).toFixed(2)
          }
        }, 1000 / framesPerSecond)

        return () => clearInterval(data.intervalId)
      }, [])
  
      for (let y = 0; y < props.rowCount; ++y) {
        rows.push(
          TileRow({
            tileWidth: props.tileWidth,
            columnCount: props.columnCount,
            key: y
          }))
      }
      
      return (
        <div>
          <div> 
            Rows: {props.rowCount}, columns: {props.columnCount}
            <div style={style}>{rows}</div>
          </div>
          <br/>
          <div style={{ clear: 'both' }}>
            (actual frames per second: {data.actualFramesPerSecond})
          </div>
        </div>
      )
    }
  })

export default
  <SpeedTest tileWidth={tileWidth} columnCount={columnCount} rowCount={rowCount}/>
