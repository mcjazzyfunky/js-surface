export default function adaptIsElementFunction({ isElement }) {
    const ret = it => isElement(it);

    ret[Symbol.for('js-spec:hint', 'Must be a valid element')];

    return ret;
}
