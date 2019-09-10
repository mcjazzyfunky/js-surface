import getAdapter from '../internal/helpers/getAdapter'

// --- forEachChild -------------------------------------------------

function forEachChild(children: any, action: (child: any) => void): void { // TODO
  adapter.forEachChild(children, action)
}

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default forEachChild
