type OpaqueType<K extends string, T = {}> = T & { __TYPE__: K }

export default OpaqueType