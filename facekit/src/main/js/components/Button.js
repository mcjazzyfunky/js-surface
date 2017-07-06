import ComponentHelper from '../helpers/ComponentHelper.js';

import {
    createElement as h,
    defineFunctionalComponent
} from 'js-surface';

import { Spec } from 'js-spec';

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
            constraint: Spec.oneOf([
                'default', 'primary', 'link', 'info',
                'warning', 'danger', 'success']),
            defaultValue: 'default'
        },

        disabled: {
            type: Boolean,
            defaultValue: false
        },

        size: {
            type: String,
            constraint: Spec.oneOf(
                ['normal', 'large', 'small']),
            defaultValue: 'normal'
        },

        iconPosition: {
            type: String,
            constraint: Spec.oneOf(
                ['top', 'bottom', 'left', 'right']),
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
            nullable: true,
            defaultValue: null
        },

        onClick: {
            type: Function,
            nullable: true,
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
                : h('span.fk-button-text',
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
                ? h('span', {className: 'caret'})
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
                h('button',
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
                h('div.fk-button.btn-group',
                    {   className: props.className
                    },
                    button,
                    h('ul.dropdown-menu',
                        h('li > a.dropdown-item',
                            { href: '#' },
                            'Juhu'),
                        h('li > a.dropdown-item',
                            { href: '#' },
                            'Juhu2')));

        } else if (isSplitButton) {
            ret =
                h('div.fk-button.btn-group.dropdown',
                    {className: props.className},
                    button,
                    h('button.btn.dropdown-toggle.dropdown-toggle-split',
                        {   className: 'btn-' + type,
                            'data-toggle': 'dropdown',
                            type: 'button'
                        },
                        ' ',
                        caret),
                    h('div.dropdown-menu.dropdown-menu',
                        h('li > a.dropdown-item',
                            { href: '#' },
                            'Juhu'),
                        h('li > a.dropdown-item',
                            { href: '#' },
                            'Juhu2')));
        } else {
            ret =
                h('div.fk-button.btn-group',
                    { className: props.className },
                    button);
        }

        return ret;
    }
});
