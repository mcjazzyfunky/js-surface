/* global jQuery */

import ComponentHelper from '../helpers/ComponentHelper.js';

import {
    defineFunctionalComponent,
    hyperscript as dom,
    Spec
} from 'js-surface';

import { Seq, Strings } from 'js-prelude';

export default defineFunctionalComponent({
    displayName: 'Button',

    properties: {
        text: {
            type: String,
            defaultValue: ''
        },

        icon: {
            type: String,
            defaultValue: ''
        },

        type: {
            type: String,
            constraint: Spec.isOneOf(['default', 'primary', 'link', 'info', 'warning', 'danger', 'success']),
            defaultValue: 'default'
        },

        disabled: {
            type: Boolean,
            defaultValue: false
        },

        size: {
            type: String,
            constraint: Spec.isOneOf(['normal', 'large', 'small']),
            defaultValue: 'normal'
        },

        iconPosition: {
            type: String,
            constraint: Spec.isOneOf(['top', 'bottom', 'left', 'right']),
            defaultValue: 'left'
        },

        tooltip: {
            type: String,
            defaultValue: ''
        },

        className: {
            type: String,
            defaultValue: ''
        },

        menu: {
            type: Array,
            defaultValue: []
        },

        onClick: {
            type: Function,
            defaultValue: null
        }
    },

    render(props) {
        const
            key = props.key,

            onClick = props.onClick,

            icon = Strings.trimToNull(props.icon),

            iconPosition = props.iconPosition,

            iconElement =
                ComponentHelper.createIconElement(
                    icon,
                    'fk-button-icon fk-icon fk-' + iconPosition),

            type = props.type,

            text = Strings.trimToNull(props.text),

            textElement =
                text === null
                ? null
                : dom('span',
                    {className: 'fk-button-text'},
                    text),

            tooltip = props.tooltip, // TODO

            disabled = props.disabled,

            menu =
                Seq.from(props.menu)
                    .toArray(),

            hasMenu = menu.length > 0,

            isDropdown = hasMenu && !onClick,

            isSplitButton = hasMenu && onClick,

            caret =
                hasMenu
                ? dom('span', {className: 'caret'})
                : null,

            sizeClass = { large: 'btn-lg', small: 'btn-sm'}[props.size] || null,

            className =
                ComponentHelper.buildCssClass(
                    'btn btn-' + type,
                    sizeClass,
                    (text === null ? null : 'fk-has-text'),
                    (iconElement === null ? null : 'fk-has-icon'),
                    (!isDropdown ? null : 'dropdown-toggle')),

            doOnClick = event => {
                const onClick = props.onClick;

                if (onClick) {
    //                onClick(EventMappers.mapClickEvent(event));
                }
            },

            button =
                dom('button',
                    { type: 'button'
                    , className: className
                    , title: tooltip
                    , disabled: disabled
                    , onClick: doOnClick
                    , key: key
                    , 'data-toggle': isDropdown ? 'dropdown' : null
                    },
                    (iconPosition === 'left' || iconPosition === 'top'
                         ? [iconElement, (text !== null && icon !== null ? ' ' : null), textElement]
                         : [textElement, (text !== null && icon !== null ? ' ' : null), iconElement]),
                    (isDropdown ? caret : null));

        let ret;

        if (isDropdown) {
            ret =
                dom('div.fk-button.btn-group',
                    { className: props.className
                    },
                    button,
                    dom('ul',
                        {className: 'dropdown-menu'},
                        dom('li/a.dropdown-item',
                            { className: 'dropdown-item', href: '#' },
                            'Juhu'),
                        dom('li/a.dropdown-item',
                            { className: 'dropdown-item', href: '#' },
                            'Juhu2')));

        } else if (isSplitButton) {
            ret =
                dom('div',
                    {className: 'fk-button btn-group dropdown ' + props.className},
                    button,
                    dom('button',
                        { className: 'btn dropdown-toggle dropdown-toggle-split btn-' + type
                        , 'data-toggle': 'dropdown'
                        , type: 'button'
                        },
                        ' ',
                        caret),
                    dom('div.dropdown-menu',{className: 'dropdown-menu'},
                        dom('li/a.dropdown-item',
                            { className: 'dropdown-item', href: '#' },
                            'Juhu'),
                        dom('li/a.dropdown-item',
                            { className: 'dropdown-item', href: '#' },
                            'Juhu2')));
        } else {
            ret =
                dom('div',
                    { className: 'fk-button btn-group ' + props.className },
                    button);
        }

        return ret;

    }
});
