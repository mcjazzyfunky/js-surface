function view(renderContent) {
  return {
    normalizeComponent() {
      return (props, refresh) => ({
        receiveProps() {
          refresh();
        },

        render(props, state) {
          return renderContent(props, state);
        }
      });
    }
  };
}

class Component {
  constructor(props) {
    Object.defineProperty(this, '___internals', {
      enumerable: false,
      writeable: false,

      value: {
        props: props,
        prevProps: null,
        state: null,
        prevState: null,
        snapshot: undefined,
        refresh: null,
        updateState: null,

        getSnapshot() {
          return this.getSnapshotBeforeUpdate(this.___internals.prevProps, this.___internals.prevState);
        }
      }
    });
  }

  getSnapshotBeforeUpdate() {
  }

  componentDidMount() {
  }

  componentDidUpdate(/* prevProps, prevState */) {
  }

  componentWillUnmount() {
  }

  componentDidCatch(/* error, info */) {
  }

  shouldComponentUpdate(/* nextProps, nextState */) {
    return true;
  }

  render() { 
    return null;
  }

  setState(firstArg) {
    if (!this.___internals.updateState) {
      throw new Error('Calling setState within the constructor is not allowed');
    } else {
      const
        typeOfFirstArg = typeof firstArg,
        firstArgIsFunction = typeOfFirstArg === 'function',
        firstArgIsObject = firstArg !== null && typeOfFirstArg === 'object';

      if (firstArgIsFunction || firstArgIsObject) {
        const updater = firstArgIsObject ? () => firstArg : firstArg;

        this.___internals.updateState(updater, state => {
          const shouldUpdate = this.shouldComponentUpdate(this.props, state);
          this.___internals.state = Object.assign({}, this.___internals.state, state);

          if (shouldUpdate) {
            this.forceUpdate(() => {
              const
                prevProps = this.___internals.prevProps,
                prevState = this.___internals.prevState;

              this.___internals.prevProps = this.___props;
              this.___internals.prevState = this.___state;

              this.componentDidUpdate(prevProps, prevState, this.___internals.snapshot);
            });
          }
        });
      } else {
        throw new TypeError('First argument of setState must either be a function or an object');
      }
    }
  }

  forceUpdate(callback) {
    if (this.___internals.refresh) {
      this.___internals.refresh(this.___internals.getSnapshot.bind(this), callback);
    }
  }

  get props() {
    return this.___internals.props;
  }

  set props(value) {
    throw new Error('Props are read-only');
  }

  get state() {
    return this.___internals.state;
  }

  set state(state) {
    if (!this.___internals.updateState) {
      this.___internals.state = state;
    } else {
      throw new Error('Use method setState');
    }
  }

  static getDerivedStateFromProps(/* nextProps, prevState */) {
    return null;
  }

  static normalizeComponent(config) {
    const main = (props, refresh, updateState) => {
      const
        component = new this(props),

        render = () => {
          return component.render();
        },

        receiveProps = props => {
          const
            oldProps = component.___internals.props,
            state = component.___internals.state,
            needsUpdate = component.___internals.isInitialized
              && component.shouldComponentUpdate(props, state),

            getDerivedStateFromProps =
              Object.getPrototypeOf(this)
                .getDerivedStateFromProps;

          if (getDerivedStateFromProps) {
            // TODO - is this realy working
            const state = getDerivedStateFromProps(props, state);

            if (state) {
              this.setState(() => state);
            }
          }
          
          component.___internals.props = props;

          if (needsUpdate) {
            refresh(
              () => component.___internals.getSnapshot(),
              () => component.componentDidUpdate(oldProps, state));
          }
        },

        finalize = () => {
          if (component && component.___internals.updateState) {
            component.componentWillUnmount();
          }
        };
      
      component.___internals.props = props;
      component.___internals.refresh = refresh;
      component.___internals.updateState = updateState;

      // TODO: What's this for?!?
      if (component.___internals.state !== undefined) {
        component.___internals.updateState(() => component.___state);
      }

      component.___internals.prevProps = component.___internals.props;
      component.___internals.prevState = component.___internals.state;
      component.componentDidMount();

      const ret = {
        render,
        receiveProps,
        finalize
      };

      if (config.isErrorBoundary) {
        ret.handleError = (error, info) => {
          component.componentDidCatch(error, info);
        };
      }

      if (config.methods) {
        ret.callMethod = (name, args) => {
          return component[name](...args);
        };
      }

      return ret;
    };

    return main;
  }
}

// --- exports ------------------------------------------------------

export default Object.freeze({
  view,
  Component
});

export {
  view,
  Component
};

