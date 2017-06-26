import {
    createElement as h,
    defineClassComponent,
    defineFunctionalComponent,
    Component
} from 'js-surface';

const Header = defineFunctionalComponent({
    displayName: 'Header',

    render(props) {
        return (
            h('header.header',
                h('h1',
                    'todos'),
                h('input.new-todo[placeholder="What needs to be done?"][autofocus]'))
        );
    }
});

const MainSection = defineFunctionalComponent({
    displayName: 'MainSection',

    render(props) {
        return (
            h('section.main',
                h('input.toggle-all[type=checkbox]'),
                h('label[for=toggle-all]',
                    'Mark all as complete'),
                h('ul.todo-list',
                    h('li.completed',
                        h('div.view',
                            h('input.toggle[type=checkbox][checked]'),
                            h('label',
                                'Taste Javascript'),
                            h('button.destroy')),
                        h('input.edit[value=Create a TodoMVC template]')),
                    h('li',
                        h('div.view',
                            h('input.toggle[type=checkbox][checked]'),
                            h('label',
                                'Taste Javascript'),
                            h('button.destroy')),
                        h('input.edit[value="Create a TodoMVC template"]'))))

            


        )
    }
});

const Footer = defineFunctionalComponent({
    displayName: 'Footer',

    render(props) {
        return (
            h('footer.info',
                h('p',
                    'Double-click to edit a todo'),
                h('p',
                    'Template by',
                    h('a[href="http://sindresorhus.com"]',
                        'Sindre Sorhus')),
                h('p',
                    'Created by',
                    h('a[href="http://todomvc.com"]',
                        'you')),
                h('p',
                    'Part of',
                    h('a[href="http://todomvc.com"]',
                        'TodoMVC')))
        );
    }
});
