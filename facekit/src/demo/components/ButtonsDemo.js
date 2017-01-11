import {
	defineFunctionComponent,
	hyperscript as dom,
} from 'js-surface';

import { Seq } from 'js-prelude';

import Button from '../../main/js/components/Button.js';


const
    buttonTypes = ['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'],
    sizes = ['large', 'normal', 'small'],
    exampleIcons = ['fa-calendar', 'fa-twitter', 'glyphicon-home', 'glyphicon-print'],
    iconPositions = ['left', 'top', 'right', 'bottom'];


export default defineFunctionComponent({
    name: 'DemoOfButtons',

    render() {
        return (
            dom('div',
                {className: 'container-fluid'},
                dom('div',
                    {className: 'row'},
                    dom('div',
                        {className: 'col-md-2'},
                        'Enabled buttons:'),
                    ...Seq.from(buttonTypes).map(buttonType =>
                        dom('div',
                            {className: 'col-md-1'},
                            Button({
                                text: buttonType,
                                type: buttonType,
                                onClick: () => alert('You clicked: ' + buttonType)
                            })))),
                dom('div',
                    {className: 'row'},
                    dom('div',
                        {className: 'col-md-2'},
                        'Disabled buttons:'),
                    ...Seq.from(buttonTypes).map(buttonType =>
                        dom('div',
                            {className: 'col-md-1'},
                            Button({
                                text: buttonType,
                                type: buttonType,
                                disabled: true
                            }))
                    )),

                dom('div',
                    {className: 'row'},
                    dom('div',
                        {className: 'col-md-2'},
                        'Buttons with icons'),
                    ...Seq.from(exampleIcons).map(icon =>
                        dom('div',
                            {className: 'col-md-1'},
                            Button({text: icon.replace(/^[^\-]+-/, ''), icon: icon})))),
                dom('div',
                    {className: 'row'},
                    dom('div',
                        {className: 'col-md-2'},
                        'Buttons with different icon positions'),
                    ...Seq.from(iconPositions).map(iconPosition =>
                        dom('div',
                            {className: 'col-md-1'},
                            Button({text: iconPosition, icon: 'fa-cab', iconPosition: iconPosition})))),

                dom('div',
                    {className: 'row'},
                    dom('div',
                        {className: 'col-md-2'},
                        'Links with different icon positions'),
                    ...Seq.from(iconPositions).map(iconPosition =>
                        dom('div',
                            {className: 'col-md-1'},
                            Button({
                                text: iconPosition,
                                icon: 'fa-cab',
                                iconPosition: iconPosition,
                                type: 'link'
                            })))),
                dom('div',
                    {className: 'row'},
                    dom('div',
                        {className: 'col-md-2'},
                        'Button sizes:'),
                    ...Seq.from(sizes).map(size =>
                        dom('div', {className: 'col-md-1'},
                            Button({text: size, size: size})))),

                dom('div',
                    {className: 'row'},
                    dom('div', {className: 'col-md-2'},
                        'Link sizes:'),
                    ...Seq.from(sizes).map(size =>
                        dom('div', {className: 'col-md-1'},
                            Button({text: size, size: size, type: 'link'})))),
                dom('div',
                    {className: 'row'},
                    dom('div',
                        {className: 'col-md-2'},
                        'Menu buttons:'),
                    Button({
                        className: 'col-md-2',
                        type: 'info',
                        text: 'Dropdown button',
                        menu: [{text: 'Item 1'}]
                    }),
                    Button({
                        className: 'col-md-2',
                        text: 'Split button',
                        onClick: () => alert('Juhuuu'),
                        menu: [{text: 'Item 1'}]
                    })))
        );
    }
});
