export default function isContext(it) {
  return it !== null && typeof it === 'object' && !!it.__internalContext;
}