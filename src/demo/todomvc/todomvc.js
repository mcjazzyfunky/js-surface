import {
    createElement as h,
    defineClassComponent,
    defineFunctionalComponent,
    mount 
} from 'js-surface';

import { Spec } from 'js-spec';

import { List, Record, toJS } from 'immutable';

const
    allowedFilters = ['all', 'active', 'completed'],
    
    shapeOfAppState = {
        newTodoText: Spec.string,
        editTodoId: Spec.nullable(Spec.Number),
        editTodoText: Spec.string,
        filter: Spec.in(allowedFilters),
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
            
            app.state = app.state.update('todos', todos =>
                todos.push(Todo({ id, text })));
        },

        removeTodo(id) {
            app.state = app.state.update('todos', todos =>
                todos.filter(todo => todo.id !== id));
        },

        removeCompletedTodos() {
            app.state = app.state.update('todos', todos =>
                todos.filter(todo => !todo.completed));
        },

        setFilter(filter) {
            app.state = app.state.set('filter', filter);
        },

        setNewTodoText(text) {
            app.state = app.state.set('newTodoText', text);
        },

        setTodoCompleted(id, completed) {
            app.state = app.state.update('todos', todos =>
                todos.map(todo =>
                    todo.id !== id
                        ? todo
                        : todo.set('completed', completed)));
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
                    state.filter === 'active' ^ todo.completed),

            activeCount = this.state.todos.count(todo => !todo.completed);

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
                        activeCount
                    })))
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

    render({ newTodoText, ctrl }) {
        return (
            h('header.header',
                h('h1',
                    'todos'),
                h('input.new-todo[placeholder="What needs to be done?"][autoFocus]',
                    { value: newTodoText,
                        onChange(ev) {
                            ctrl.setNewTodoText(ev.target.value);
                        },

                        onBlur(ev) {
                            const text = ev.target.value.trim();

                            if (text !== '') {
                                ctrl.addTodo(text);
                            }

                            ctrl.setNewTodoText('');
                        },

                        onKeyDown(ev) {
                            if (ev.keyCode === 13) {
                                const text = ev.target.value.trim();

                                if (text !== '') {
                                    ctrl.addTodo(text);
                                }

                                ctrl.setNewTodoText('');
                            }
                        }
                    }))
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
            h('section.main',
                h('input.toggle-all[type=checkbox]'),
                h('label[for=toggle-all]',
                    'Mark all as complete'),
                h('ul.todo-list',
                    todos.map(todo => 
                        h('li',
                            { class: todo.completed ? 'completed' : '' },
                            h('div.view',
                                h('input.toggle[type=checkbox]',
                                    { checked: todo.completed,
                                        'data-id': todo.id,
                                        onClick(ev) {
                                            const
                                                id = Number(ev.target.dataset.id),
                                                checked = ev.target.checked;
                                        
                                            ctrl.setTodoCompleted(id, checked);
                                        }
                                    }),
                                h('label',
                                    todo.text),
                                h('button.destroy',
                                    { 'data-id': todo.id,
                                        onClick(ev) {
                                            ctrl.removeTodo(Number(ev.target.dataset.id));
                                        }
                                    })),
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
            constraint: Spec.in(allowedFilters),
            defaultValue: 'all'
        },
        activeCount: {
            type: Number,
            constraint: Spec.and(Spec.integer, Spec.greaterOrEqual(0))
        }
    },

    render({ ctrl, filter, activeCount }) {
        return (
            h('footer.footer',
                h('span.todo-count',
                    h('strong',
                        `${activeCount}`),
                    ' item(s) left'),
                h('div.filters',
                    h('a',
                        { class: filter === 'all' ? 'selected' : null,
                            onClick: () => ctrl.setFilter('all') 
                        },
                        'All'),
                    h('a',
                        { class: filter === 'active' ? 'selected' : null,
                            onClick: () => ctrl.setFilter('active') 
                        },
                        'Active'),
                    h('a',
                        { class: filter === 'completed' ? 'selected' : null,
                            onClick: () => ctrl.setFilter('completed') 
                        },
                        'Completed')),
                h('button.clear-completed', 
                    { onClick:() => ctrl.removeCompletedTodos() },
                    'Clear completed'))
        );
    }
});

mount(TodoMVCApp(), 'main-content');