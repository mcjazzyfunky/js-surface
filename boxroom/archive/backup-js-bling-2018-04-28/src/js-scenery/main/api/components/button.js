import { createElement as h, defineComponent } from 'js-bling';
import { defineMessages, defineDispatcher } from 'js-messages';
import { apply } from 'js-messages/effects;'
import { Spec } from 'js-spec';

import { Seq, Strings } from 'js-essential';
import ComponentUtils from '../util/ComponentUtils';
import EventMappers from '../util/EventMappers';


const
    events = {
        clickedButton: ev => ({ props }) =>
            props.onClick ? EventMappers.mapClickEvent(ev) : null
    };

export default defineComponent({
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
            constraint: Spec.oneOf(
                'default', 'primary', 'secondary',
                'positive', 'negative', 'flat', 'link'),

            defaultValue: 'default'
        },

        outlined: {
            type: Boolean,
            defaultValue: false
        },

        disabled: {
            type: Boolean,
            defaultValue: false
        },

        size: {
            type: String,
            constraint: Spec.oneOf(
                'mini', 'tiny', 'small', 'medium', 'large', 'big', 'huge', 'massive'),
            defaultValue: 'medium'
        },

        iconPosition: {
            type: String,
            constraint: Spec.oneOf('left', 'top'),
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

    initDispatcher: defineDispatcher(),

    render({ props, bind }) {
        const
            key = props.key,

            onClick = props.onClick,

            icon = Strings.trimToNull(props.icon),

            iconPosition = props.iconPosition,

            iconElement =
                ComponentUtils.createIconElement(
                    icon,
                    'sc-button-icon sc-icon sc-' + iconPosition,
                    props.iconPosition === 'left' ? null : { margin: '0 0 5px 0'}),

            type = props.type,

            text = Strings.trimToNull(props.text),

            textElementInner =
                props.type === 'link'
                    ? h('a', text)
                    : text,

            textElement =
                text === null
                    ? null
                    : (props.iconPosition === 'left'
                        ? h('span', textElementInner)
                        : h('div', textElementInner)),

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

            sizeClass = props.size,

            className =
                ComponentUtils.buildClass(
                    `ui button ${type} sc-Button--${type}`,
                    sizeClass,
                    (text === null ? null : 'sc-has-text'),
                    (iconElement === null ? null : 'sc-has-icon'),
                    (!isDropdown ? null : 'dropdown-toggle'),
                    (props.outlined ? 'basic' : null)),

            button =
                h('button',
                    {   type: 'button',
                        className: className,
                        title: tooltip,
                        disabled: disabled,
                        onClick: bind(events.clickedButton),
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
                h('div.sc-button.btn-group',
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
                h('div.sc-button.btn-group.dropdown',
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
                h('div.sc-button.btn-group',
                    { className: props.className },
                    button);
        }

        return ret;
    }
});