// Just to make sure that the objects type name is 'Fragent'
// even in production
const obj = {
  Fragment() {}
}

export default Object.create(obj.Fragment.prototype)

