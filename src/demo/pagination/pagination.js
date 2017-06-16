import {
    defineFunctionalComponent,
    defineClassComponent,
    createElement as dom,
    render,
    Component,
}  from 'js-surface';

import { Seq } from 'js-prelude';

import PaginationHelper from './helper/PaginationHelper.js';
import ComponentHelper from './helper/ComponentHelper.js';

import React from 'react';
import ReactDOM from 'react-dom';

const
    number = 50,
    pageSize = 25,
    totalItemCount = 1220;

export const Pagination = defineFunctionalComponent({
    displayName:  'Pagination',

    properties: {
        className: {
            type: String,
            preset: null
        },

        pageIndex: {
            type: Number,
            preset: null
        },

        pageSize: {
            type: Number,
            preset: null
        },

        totalItemCount: {
            type: Number,
            preset: null
        },

        showFirstButton: {
            type: Boolean,
            preset: true
        },

        showLastButton: {
            type: Boolean,
            preset: true
        },

        showPreviousButton: {
            type: Boolean,
            preset: true
        },

        showNextButton: {
            type: Boolean,
            preset: true
        },

        onChange: {
            type: Function,
            preset: null
        }
    },

    render(props) {
        const
            pageIndex = props.pageIndex,

            metrics =
                PaginationHelper.calcPaginationMetrics(
                    props.pageIndex,
                    props.pageSize,
                    props.totalItemCount),

            paginationInfo =
                PaginationHelper.determineVisiblePaginationButtons(
                    props.pageIndex,
                    metrics.pageCount,
                    6),

            classNameOuter =
                ComponentHelper.buildCssClass(
                    'fk-pagination',
                    props.className),

            classNameInner = 'pagination',

            moveToPage = targetPage => {
                if (props.onChange) {
                    props.onChange({targetPage});
                }
            },

            firstPageLink =
                metrics.pageCount > 0
                ? buildLinkListItem(
                    1,
                    pageIndex === 0,
                    () => moveToPage(0))
                : null,

            precedingEllipsis =
                paginationInfo.firstButtonIndex > 1
                ? buildLinkListItem(
                    '...',
                    false)
                : null,

            succeedingEllipsis =
                paginationInfo.lastButtonIndex < metrics.pageCount - 2
                ? buildLinkListItem(
                    '...',
                    false)
                : null,

            lastPageLink =
                metrics.pageCount > 0
                ? buildLinkListItem(
                    metrics.pageCount,
                    pageIndex === metrics.pageCount - 1,
                    () => moveToPage(metrics.pageCount - 1))
                : null,

            buttons =
                Seq.range(
                    paginationInfo.firstButtonIndex ,
                    paginationInfo.lastButtonIndex + 1)
                .map(
                    index => buildLinkListItem(
                        index + 1,
                        index === pageIndex,
                        () => moveToPage(index))
                );

        return (
            dom('div',
                {className: classNameOuter},
                dom('u',
                    {className: classNameInner},
                    firstPageLink,
                    precedingEllipsis,
                    buttons.toArray(),
                    succeedingEllipsis,
                    lastPageLink))
        );
    }
});


function buildLinkListItem(text, isActive, moveToPage) {
    return (
        dom('li',
            {
                className: isActive ? 'active' : '',
                key: text !== '...' ? text + '-' + isActive : undefined
            },
            dom('a',
                { onClick: moveToPage },
                text))
    );
}

class DemoOfPaginationComponent extends Component {
    static get displayName() {
        return 'DemoOfPagination';
    }

    constructor(props) {
        super(props);

        this.state = { pageIndex: 0 };
    }

    moveToPage(pageIndex) {
        this.state = { pageIndex };
    }

    render() {
        return (
            dom('div',
                {className: 'container-fluid'},
                Seq.range(1, number).map(() =>
                    dom('div',
                        {className: 'row'},
                        Pagination({
                            className: 'col-md-3',
                            pageIndex: this.state.pageIndex,
                            pageSize: pageSize,
                            totalItemCount: totalItemCount,
                            onChange: evt => this.moveToPage(evt.targetPage)})))));
    }
}

const DemoOfPagination = defineClassComponent(DemoOfPaginationComponent);

// -----------------

class RPaginationClass extends React.Component {
    render() {
        const
            pageIndex = this.props.pageIndex,

            metrics = PaginationHelper.calcPaginationMetrics(
                            this.props.pageIndex,
                            this.props.pageSize,
                            this.props.totalItemCount),

            paginationInfo = PaginationHelper.determineVisiblePaginationButtons(
                                    this.props.pageIndex,
                                    metrics.pageCount,
                                    6),

            classNameOuter = ComponentHelper.buildCssClass(
                                    'fk-pagination',
                                    this.props.className),

            classNameInner = 'pagination',

            firstPageLink = metrics.pageCount > 0
                                ? buildLinkListItem2(
                                        1,
                                        pageIndex === 0,
                                        this.props,
                                        0)
                                : null,

            precedingEllipsis = paginationInfo.firstButtonIndex > 1
                                    ? buildLinkListItem2(
                                            '...',
                                            false,
                                            this.props)
                                    : null,

            succeedingEllipsis = paginationInfo.lastButtonIndex < metrics.pageCount - 2
                                        ? buildLinkListItem2(
                                                '...',
                                                false,
                                                this.props)
                                        : null,

            lastPageLink =  metrics.pageCount > 0
                                ? buildLinkListItem2(
                                    metrics.pageCount,
                                    pageIndex === metrics.pageCount - 1,
                                    this.props,
                                    metrics.pageCount - 1)
                                : null,

            buttons = Seq.range(
                            paginationInfo.firstButtonIndex ,
                            paginationInfo.lastButtonIndex + 1)
                        .map(index => buildLinkListItem2(
                                            index + 1,
                                            index === pageIndex,
                                            this.props,
                                            index));

        return (
            React.createElement('div',
                {className: classNameOuter},
                React.createElement('ul',
                    {className: classNameInner},
                    firstPageLink,
                    precedingEllipsis,
                    buttons,
                    succeedingEllipsis,
                    lastPageLink))
        );
    }
}

function buildLinkListItem2(text, isActive, props, pageIndexToMove = null) {
    const
        onChangeProp = props.onChange,

        onClick = !isActive && pageIndexToMove !== null && typeof onChangeProp === 'function'
            ? () => onChangeProp({targetPage: pageIndexToMove})
            : null;

    return (
        React.createElement('li',
            {className: isActive ? 'active' : '', key: (pageIndexToMove === null ? undefined : pageIndexToMove + text + isActive)},
            React.createElement('a',
                {onClick: onClick},
                text))
    );
}


class RDemoOfPaginationClass extends React.Component {
    constructor() {
        super();
        this.state = {currPageIdx: 0};
    }

    render() {
        return (
            React.createElement('div',
                    {className: 'container-fluid'},
                    ...Seq.range(1, number).map(() =>
                        React.createElement('div',
                            {className: 'row'},
                            RPagination({
                                className: 'col-md-3',
                                pageIndex: this.state.currPageIdx,
                                pageSize: pageSize,
                                totalItemCount: totalItemCount,
                                onChange: evt => this.setState({currPageIdx: evt.targetPage})
                            })
                        )))
        );
    }
}

const
    RPagination = React.createFactory(RPaginationClass),
    RDemoOfPagination = React.createFactory(RDemoOfPaginationClass);

if (1) {
    render(
        DemoOfPagination(),
        'main-content',
        'React');
} else {
    ReactDOM.render(
        RDemoOfPagination(),
        document.getElementById('main-content'));
}
