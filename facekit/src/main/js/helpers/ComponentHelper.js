'use static';
import { Seq, Strings } from 'js-prelude';
import { createElement as htm } from 'js-surface';

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

    static buildIconCssClass(icon) {
        let ret = '';

        if (icon && typeof icon === 'string' && icon.indexOf('.') === -1) {
            let match = icon.match(/(?:^|\s)(fa|glyphicon)-./);

            if (match) {
                ret = match[1] + ' ' + icon;
            }
        }

        return ret;
    }
    
    static createIconElement(icon, className) {
        let ret = null;

        icon = Strings.trimToNull(icon);
        className = ComponentHelper.buildCssClass(className);

        if (icon !== null) {
            if (icon.indexOf('.') >= 0) {
                ret = htm('img', { href: icon, alt: '', className: className });
            } else {
                let match = icon.match(/(?:^|\s)(fa|glyphicon)-./),
                    fullClassName = (match ? match[1] : '') + ' ' + icon + ' ' + className;

                if (match) {
                    ret = htm('span', { className: fullClassName });
                }
            }
        }

        return ret;
    }
}
