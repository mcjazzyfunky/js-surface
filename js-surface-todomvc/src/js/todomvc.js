import {
    createElement as h,
    defineFunctionalComponent,
    render
} from 'js-surface';

import { Record, List } from 'immutable';
import { createStore } from 'redux';
import { StoreProvider } from 'js-surface-store-connect';
import { Spec } from 'js-spec';

const
    specStore = Spec.shape({
        subscribe: Spec.func,
        getState: Spec.func,
        dispatch: Spec.func
    }),

    AppState = Record({
        todos: List(),
        activeFilter: 'all',
        todoText: '',
        editTodoId: null,
    }),

    Todo = Record({
        id: null,
        text: '',
        completed: false
    }),

    Actions = {
        addTodo(text) {
            return { type: 'addTodo', text };
        },

        removeTodo(id) {
            return { type: 'removeTodo', id };
        },

        setActiveFilter(filter) {
            return { type: 'setActiveFilter', filter };
        }
    },

    reducer = (state = AppState(), action) => {
        let ret = state;

        switch (action.type) {
        case 'addTodo':
            ret = state.todos.push(Todo({
                id: Date.now().toString(36),
                text: action.text
            }));

            break;

        case 'removeTodo':
            ret = state.todos.filter(todo => todo.id !== action.id);

            break;
        }

        return ret;
    },

    store = createStore(reducer);



const TodoMVCApp = defineFunctionalComponent({
    displayName: 'App',

    render(props) {
        return (
            h(StoreProvider(
                { store },
                h('section.todoapp',
                    Header(),
                    TodoList(),
                    TodoFilters()),
                Footer()))
        );
    }
});

const Header = defineFunctionalComponent({
    displayName: 'Header',

    properties: {
        store: {
            type: Object,
            constraint: specStore,
            inject: true
        }
    },

    render(props) {
        return (
            h('header.header',
                h('h1',
                    'todos'),
                h('input.new-todo[placeholder="What needs to be done?"][autofocus]'))
        );
    }
});

const TodoList = defineFunctionalComponent({
    displayName: 'MainSection',

    properties: {
        store: {
            type: Object,
            constraint: specStore,
            inject: true
        }
    },

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
                        h('input.edit[value="Create a TodoMVC template"]')),
                    h('li',
                        h('div.view',
                            h('input.toggle[type=checkbox][checked]'),
                            h('label',
                                'Taste Javascript'),
                            h('button.destroy')),
                        h('input.edit[value="Create a TodoMVC template"]'))))
        );
    }
});

const TodoFilters = defineFunctionalComponent({
    displayName: 'TodoFilters',

    properties: {
        store: {
            type: Object,
            constraint: specStore,
            inject: true
        }
    },

    render(props) {
        const
            store = props.store,
            dispatch = store.dispatch,
            state = store.getState();

        return (
            h('footer.footer',
                h('span.todo-count',
                    h('strong',
                        0),
                    ' item(s) left'),
                h('ul.filters',
                    h('li > a',
                        { className: state.activeFilter === 'all' ? 'active' : null,
                            onClick: () => dispatch(Actions.setActiveFilter('all')) 
                        },
                        'All'),
                    h('li > a',
                        { className: state.activeFilter === 'active' ? 'active' : null,
                            onClick: () => dispatch(Actions.setActiveFilter('active')) 
                        },
                        'Active'),
                    h('li > a',
                        { className: state.activeFilter === 'completed' ? 'active' : null,
                            onClick: () => dispatch(Actions.setActiveFilter('completed')) 
                        },
                        'Completed')),
                h('button.clear-completed',
                    'Clear completed'))
        );
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
                    'Template by ',
                    h('a[href="http://sindresorhus.com"]',
                        ' Sindre Sorhus')),
                h('p',
                    'Created by ',
                    h('a[href="https://github.com/js-works/js-surface"]',
                        ' the authors of "js-surface"')),
                h('p',
                    'Part of ',
                    h('a[href="http://todomvc.com"]',
                        'TodoMVC')))
        );
    }
});

render(TodoMVCApp(), 'app-container');