function render(view) {
  return {
    normalizeComponent() {
      return (props, refresh) => ({
        receiveProps() {
          refresh();
        },

        render(props, state) {
          return view(props, state);
        }
      });
    }
  };
}

class Component {
  constructor(props) {
    this.___props = props;
    this.___prevProps = undefined;
    this.___state = undefined;
    this.___prevState = undefined;
    this.___snapshot = undefined;
    this.___refresh = null;
    this.___updateState = null;
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
    if (!this.___updateState) {
      throw new Error('Calling setState within the constructor is not allowed');
    } else {
      const
        typeOfFirstArg = typeof firstArg,
        firstArgIsFunction = typeOfFirstArg === 'function',
        firstArgIsObject = firstArg !== null && typeOfFirstArg === 'object';

      if (firstArgIsFunction || firstArgIsObject) {
        const updater = firstArgIsObject ? () => firstArg : firstArg;

        this.___updateState(updater, state => {
          const shouldUpdate = this.shouldComponentUpdate(this.props, state);
          this.___state = Object.assign({}, this.___state, state);

          if (shouldUpdate) {
            this.forceUpdate(() => {
              const
                prevProps = this.___prevProps,
                prevState = this.___prevState;

              this.___prevProps = this.___props;
              this.___prevState = this.___state;

              this.componentDidUpdate(prevProps, prevState, this.___snapshot);
            });
          }
        });
      } else {
        throw new TypeError('First argument of setState must either be a function or an object');
      }
    }
  }

  forceUpdate(callback) {
    if (this.___refresh) {
      this.___refresh(() => 'TODO', callback);
    }
  }

  get props() {
    return this.___props;
  }

  set props(value) {
    throw new Error('Props are read-only');
  }

  get state() {
    return this.___state;
  }

  set state(state) {
    if (!this.___updateState) {
      this.___state = state;
    } else {
      throw new Error('Use method setState');
    }
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
            oldProps = component.___props,
            state = component.___state,
            needsUpdate = this.___isInitialized
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
          
          component.___props = props;

          if (needsUpdate) {
            refresh(() => 'TODO', () => this.componentDidUpdate(oldProps, state));
          }
        },

        finalize = () => {
          if (component && component.___updateState) {
            component.componentWillUnmount();
          }
        };
      
      component.___props = props;
      component.___refresh = refresh;
      component.___updateState = updateState;

      if (this.___state !== undefined) {
        this.___updateState(() => this.__state);
      }

      this.___prevProps = this.___props;
      this.___prevState = this.___state;
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
  render,
  Component
});

export {
  render,
  Component
};

