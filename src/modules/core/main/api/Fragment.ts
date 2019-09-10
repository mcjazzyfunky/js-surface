// --- Fragment -----------------------------------------------------

// Just to make sure that the objects type name is 'Fragment'
// even in production
const Fragment = Object.create({ Fragment() {} }.Fragment.prototype)

// --- exports ------------------------------------------------------

export default Fragment
