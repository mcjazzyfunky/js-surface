/* global jQuery */

import ComponentHelper from '../helpers/ComponentHelper.js';

import {
    defineFunctionalComponent,
    createElement as dom
} from 'js-surface';

import { Spec } from 'js-spec';

import { Seq, Strings } from 'js-prelude';

export default defineFunctionalComponent({
    displayName: 'Button',

    properties: {
        text: {
            type: String,
            preset: ''
        },

        icon: {
            type: String,
            preset: ''
        },

        type: {
            type: String,
            assert: Spec.oneOf(['default', 'primary', 'link', 'info', 'warning', 'danger', 'success']),
            preset: 'default'
        },

        disabled: {
            type: Boolean,
            preset: false
        },

        size: {
            type: String,
            assert: Spec.oneOf(['normal', 'large', 'small']),
            preset: 'normal'
        },

        iconPosition: {
            type: String,
            assert: Spec.oneOf(['top', 'bottom', 'left', 'right']),
            preset: 'left'
        },

        tooltip: {
            type: String,
            preset: ''
        },

        className: {
            type: String,
            preset: ''
        },

        menu: {
            type: Array,
            preset: []
        },

        onClick: {
            type: Function,
            preset: null
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

            doOnClick = () => {
                const onClick = props.onClick;

                if (onClick) {
    //                onClick(EventMappers.mapClickEvent(event));
                }
            },

            button =
                dom('button',
                    {   type: 'button',
                        className: className,
                        title: tooltip,
                        disabled: disabled,
                        onClick: doOnClick,
                        key: key,
                        'data-toggle': isDropdown ? 'dropdown' : null
                    },
                    (iconPosition === 'left' || iconPosition === 'top'
                         ? [iconElement, (text !== null && icon !== null ? ' ' : null), textElement]
                         : [textElement, (text !== null && icon !== null ? ' ' : null), iconElement]),
                    (isDropdown ? caret : null));

        let ret;

        if (isDropdown) {
            ret =
                dom('div.fk-button.btn-group',
                    {   className: props.className
                    },
                    button,
                    dom('ul.dropdown-menu',
                        dom('li > a.dropdown-item',
                            { href: '#' },
                            'Juhu'),
                        dom('li > a.dropdown-item',
                            { href: '#' },
                            'Juhu2')));

        } else if (isSplitButton) {
            ret =
                dom('div.fk-button.btn-group.dropdown',
                    {className: props.className},
                    button,
                    dom('button.btn.dropdown-toggle.dropdown-toggle-split',
                        { className: 'btn-' + type
                        , 'data-toggle': 'dropdown'
                        , type: 'button'
                        },
                        ' ',
                        caret),
                    dom('div.dropdown-menu.dropdown-menu',
                        dom('li > a.dropdown-item',
                            { href: '#' },
                            'Juhu'),
                        dom('li > a.dropdown-item',
                            { href: '#' },
                            'Juhu2')));
        } else {
            ret =
                dom('div.fk-button.btn-group',
                    { className: props.className },
                    button);
        }

        return ret;
    }
});
