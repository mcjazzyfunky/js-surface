'use static';

export default class ComponentHelper {
    static buildCssClass(...tokens) {
        let ret = '';

        for (let token of tokens) {
            if (typeof token === 'string' && token.length > 0) {
                if (ret.length > 0) {
                    ret += ' ';
                }

                ret += token;
            } else if (token instanceof Array) {
                for (let subtoken of token) {
                    let subCssClass = ComponentHelper.buildCssClass(subtoken);

                    if (ret.length > 0) {
                        ret += ' ';
                    }

                    ret += subCssClass;
                }
            }
        }

        return ret;
    }
}
