export default function view(render) {
  return (/* config */) => {
    // TODO - check config
    
    return {
      functional: true,
      render
    }
  }
}
