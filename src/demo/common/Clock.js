import { createElement as h, defineComponent } from 'js-surface';
import { Component } from 'js-surface/common';

const Clock = defineComponent({
  displayName: 'Clock',

  properties: {
    headline: {
      type: String,
      defaultValue: 'Time:'
    }
  },

  main: class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        time: new Date().toLocaleTimeString()
      };
    }

    updateState() {
      this.setState({
        time: new Date().toLocaleTimeString()
      });
    }

    componentDidMount() {
      this.updateState();

      this.intervalId = setInterval(() => this.updateState(), 1000);
    }

    componentWillUnmount() {
      clearInterval(this.intervalId);
    }

    render() {
      return (
        h('div', null,
          h('h4', null,
            this.props.headline),
          this.state.time)
      );
    }
  }
});

export default Clock({ headline: 'Local time:' }); 
