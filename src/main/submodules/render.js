export function render(view) {
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