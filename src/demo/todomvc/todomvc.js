import {
    createElement as h,
    defineClassComponent,
    defineFunctionalComponent,
    render
} from 'js-surface';

import { Spec } from 'js-spec';

import { List, Record, toJS } from 'immutable';

const
    allowedFilters = ['all', 'active', 'completed'],
    
    shapeOfAppState = {
        newTodoText: Spec.string,
        editTodoId: Spec.nullable(Spec.Number),
        editTodoText: Spec.string,
        filter: Spec.oneOf(allowedFilters),
        todos: Spec.arrayOf(
            Spec.shape({
                text: Spec.string,
                completed: Spec.boolean
            })
        )
    },

    Todo = Record({
        id: null,
        text: '',
        completed: false
    }),

    AppState = Record({
        newTodoText: '',
        editTodoId: null,
        editTodoText: '',
        filter: 'all',
        todos: List([Todo({ id: 1, text: 'Todo 1'}), Todo({ id: 2, text: 'Todo 2'})])
    }),

    fromJSToAppState = data =>
        (!data || Spec.shape(shapeOfAppState)(data) !== null)
            ? AppState()
            : AppState({
                newTodo: data.newTodo,
                filter: data.filter,
                todos: List(data.list.map(Todo))
            }),

    fromAppStateToJS = appState => toJS(appState),

    createAppCtrl = app => ({
        updateNewTodoText(text) {
            app.state = app.state.set('newTodoText', text);
        },

        updateEditTodo(id, text) {
            app.state = app.state
                .set('editTodoId', id)
                .set('editTodoText', text);
        },
            
        addTodo(text) {
            const id = app.state.todos.reduce(
                (prev, curr) => Math.max(prev, curr), 0) + 1;
            
            app.state = app.state.updateIn('todos', todos =>
                todos.push(Todo({ id, text })));
        },

        removeTodo(id) {
            app.state = app.state.updateIn('todos', todos =>
                todos.filter(todo => todo.id !== id));
        },

        removedCompletedTodos() {
            app.state = app.state.updateIn('todos', todos =>
                todos.filter(todo => !todo.completed));
        },

        setFilter(filter) {
            app.state = app.state.set('filter', filter);
        }
    });

const TodoMVCApp = defineClassComponent({
    displayName: 'TodoMVCApp',

    properties: {
        initialState: {
            type: Object,
            defaultValue: null
        },

        onStateChange: {
            type: Function,
            defaultValue: null
        }
    },

    childInjections: ['ctrl'],

    constructor({ initialState }) {
        this.state = fromJSToAppState(initialState);
        this.ctrl = createAppCtrl(this);
    },
    
    provideChildInjections() {
        return {
            ctrl: this.ctrl
        };
    },

    onDidChangeState() {
        if (this.props.onChange) {
            this.props.onChange(fromAppStateToJS(this.state));
        }
    },

    render() {
        const
            state = this.state,
            
            visibleTodos =  state.filter === 'all'
                ? state.todos
                : state.todos.filter(todo =>
                    state.filter === 'active' ^ todo.completed);

        return (
            h('div.todomvc',
                h('section.todoapp',
                    Header({
                        newTodoText: state.newTodoText
                    }),
                    TodoList({
                        todos: visibleTodos
                    }),
                    TodoFilters({
                        filter: state.filter,
                        visibleCount: visibleTodos.size
                    })),
                Footer())
        );
    }
});

const Header = defineFunctionalComponent({
    displayName: 'Header',

    properties: {
        ctrl: {
            type: Object,
            inject: true
        },
        newTodoText: {
            type: String,
            defaultValue: ''
        }
    },

    render({ newTodoText }) {
        return (
            h('header.header',
                h('h1',
                    'todos'),
                h('input.new-todo[placeholder="What needs to be done?"][autofocus]',
                    { value: newTodoText }))
        );
    }
});

const TodoList = defineFunctionalComponent({
    displayName: 'MainSection',

    properties: {
        ctrl: {
            type: Object,
            inject: true
        },
        editTodoId: {
            type: Number,
            constraint: Spec.nonNegativeInteger,
            defaultValue: null
        },
        editTodoText: {
            type: String,
            defaultValue: null
        },
        todos: {
            type: List
        }
    },

    render({ ctrl, editTodoId, editTodoText, todos}) {
        return (
            h('section.main', { style: { display: 'block'} }, // TODO
                h('input.toggle-all[type=checkbox]'),
                h('label[for=toggle-all]',
                    'Mark all as complete'),
                h('ul.todo-list',
                    todos.map(todo => 
                        h('li.completed',
                            h('div.view',
                                h('input.toggle[type=checkbox][checked]'),
                                h('label',
                                    todo.text),
                                h('button.destroy')),
                            //h('input.edit[value="Create a TodoMVC template"]')
                            )
                    )))
        );
    }
});

const TodoFilters = defineFunctionalComponent({
    displayName: 'TodoFilters',

    properties: {
        ctrl: {
            type: Object,
            inject: true
        },
        filter: {
            type: String,
            constraint: Spec.oneOf(allowedFilters),
            defaultValue: 'all'
        },
        visibleCount: {
            type: Number,
            constraint: Spec.and(Spec.integer, Spec.greaterOrEqual(0))
        }
    },

    render({ ctrl, filter, visibleCount }) {
        return (
            h('footer.footer',
                h('span.todo-count',
                    h('strong',
                        `${visibleCount}`),
                    ' item(s) left'),
                h('div.filters',
                    h('a',
                        { className: filter === 'all' ? 'selected' : null,
                            onClick: () => ctrl.setActiveFilter('all') 
                        },
                        'All'),
                    h('a',
                        { className: filter === 'active' ? 'selected' : null,
                            onClick: () => ctrl.setFilter('active') 
                        },
                        'Active'),
                    h('a',
                        { className: filter === 'completed' ? 'selected' : null,
                            onClick: () => ctrl.setFilter('completed') 
                        },
                        'Completed')),
                h('button.clear-completed', 
                    { onClick: () => ctrl.removeCompletedTodos(), style: { display: 'block'} }, // TODO
                    'Clear completed'))
        );
    }
});

const Footer = defineFunctionalComponent({
    displayName: 'Footer',

    render() {
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

render(TodoMVCApp(), 'main-content');