import { createElement, component, useEffect, useRef, useForceUpdate }
  from '../../modules/core/main/index'

const prefs = {
  framesPerSecond: 240,
  colors: ['red', 'yellow', 'orange'],
  tileWidth: 5,
  columnCount: 20,
  rowCount: 20
}

type TileProps = {
  color?: string,
  width?: number
}

const Tile: any = component<TileProps>('Tile', ({ // TODO
  color = 'white',
  width = 3
}) => {
  const
    style = {
      float: 'left',
      width: width + 'px',
      height: width + 'px',
      backgroundColor: color,
      padding: 0,
      margin: 0
    }
    
  return <div style={style as any}/> // TODO
})

type TypeRowProps = {
  tileWidth?: number,
  columnCount?: number,
  colors?: string[],
}

const TileRow: any = component<TypeRowProps>('TileRow', ({ // TODO
  tileWidth = 3,
  columnCount = prefs.columnCount,
  colors = prefs.colors
}) => {
  const tiles = []

  for (let x = 0; x < columnCount; ++x) {
    const
      colorIdx = Math.floor(Math.random() * colors.length),
      color = colors[colorIdx]
  
    tiles.push(<Tile width={tileWidth} color={color} key={x}/>)
  }

  return <div style={{ clear: 'both' }}>{tiles}</div>
})

type SpeedTestProps = {
  columnCount: number,
  rowCount: number,
  tileWidth?: number,
  framesPerSecond?: number
}

const SpeedTest: any = component<SpeedTestProps>('SpeedTest', ({ // TODO
  tileWidth = 3,
  rowCount = prefs.rowCount,
  columnCount = prefs.columnCount,
  framesPerSecond = prefs.framesPerSecond
}) => {
  const
    forceUpdate = useForceUpdate(),
    intervalIdRef = useRef(null),
    startTimeRef = useRef(Date.now()),
    frameCountRef = useRef(0),
    actualFramesPerSecondRef = useRef('0'),

    rows = [],
      
    style = {
      marginTop: 40,
      marginLeft: 40
    }

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      ++frameCountRef.current
      forceUpdate()

      if (frameCountRef.current % 10 === 0) {
        actualFramesPerSecondRef.current =
          (frameCountRef.current * 1000.0 /
            (Date.now() - startTimeRef.current)).toFixed(2)
      }
    }, 1000 / framesPerSecond)

    return () => clearInterval(intervalIdRef.current)
  }, [])

  for (let y = 0; y < rowCount; ++y) {
    rows.push(
      <TileRow
        tileWidth={tileWidth}
        columnCount={columnCount}
        key={y}
      />)
  }
  
  return (
    <div>
      <div> 
        Rows: {rowCount}, columns: {columnCount}
        <div style={style}>{rows}</div>
      </div>
      <br/>
      <div style={{ clear: 'both' }}>
        (actual frames per second: {actualFramesPerSecondRef.current})
      </div>
    </div>
  )
})

export default
  <SpeedTest
    tileWidth={prefs.tileWidth}
    columnCount={prefs.columnCount}
    rowCount={prefs.rowCount}
  />
