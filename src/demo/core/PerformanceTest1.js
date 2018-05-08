import { createElement as h, defineComponent }  from 'js-surface';

const
  framesPerSecond = 240,
  colors = ['red', 'yellow', 'orange'],
  tileWidth = 5,
  columnCount = 20,
  rowCount = 20;

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
  
  main(props, refresh) {
    return {
      render(props) {
        const
          { width, color } = props,
        
          style = {
            float: 'left',
            width: width + 'px',
            height: width + 'px',
            backgroundColor: color
          };
        
        return h('div', { style });
      },

      receiveProps() {
        refresh();
      }
    };
  }
});

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
  
  main(props, refresh) {
    return {
      render(props) {
        const
          { tileWidth, columnCount } = props,
          tiles = [];

        for (let x = 0; x < columnCount; ++x) {
          const
            colorIdx = Math.floor(Math.random() * colors.length),       
            color = colors[colorIdx];
        
          tiles.push(Tile({ width: tileWidth, color, key: x }));
        }
      
        return h('div', { style: { clear: 'both' }}, tiles);
      },

      receiveProps() {
        refresh();
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
    }
  },
    
  main(initialProps, refresh) {
    let
      startTime = Date.now(),
      frameCount = 0,
      actualFramesPerSecond = '0',

      render = props => {
        const
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

      intervalId = null;

    refresh(null, () => {
      intervalId = setInterval(() => {
        ++frameCount;
        refresh(); 

        if (frameCount % 10 === 0) {
          actualFramesPerSecond =
            (frameCount * 1000.0 /
              (Date.now() - startTime)).toFixed(2);
        }
      }, 1000 / framesPerSecond);
    });

    return {
      render,

      receiveProps() {
        refresh();
      },

      finalize() {
        clearInterval(intervalId);
        intervalId = null,
        startTime = null;
        frameCount = 0;
      }
    };
  },
});

export default SpeedTest({ tileWidth, columnCount, rowCount });
