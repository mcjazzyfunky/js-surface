import {
    createElement as h,
    mount
} from 'js-surface';

import {
    defineClassComponent,
    defineFunctionalComponent
}  from 'js-unify';

import { Seq } from 'js-essential';

import PaginationHelper from './helper/PaginationHelper.js';
import ComponentHelper from './helper/ComponentHelper.js';

import React from 'react';
import ReactDOM from 'react-dom';

const
    number = 20,
    pageSize = 25,
    totalItemCount = 1220;

export const Pagination = defineFunctionalComponent({
    displayName:  'Pagination',

    properties: {
        className: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        pageIndex: {
            type: Number,
            nullable: true,
            defaultValue: null
        },

        pageSize: {
            type: Number,
            nullable: true,
            defaultValue: null
        },

        totalItemCount: {
            type: Number,
            nullable: true,
            defaultValue: null
        },

        showFirstButton: {
            type: Boolean,
            defaultValue: true
        },

        showLastButton: {
            type: Boolean,
            defaultValue: true
        },

        showPreviousButton: {
            type: Boolean,
            defaultValue: true
        },

        showNextButton: {
            type: Boolean,
            defaultValue: true
        },

        onChange: {
            type: Function,
            defaultValue: null
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
            h('div',
                {className: classNameOuter},
                h('ul',
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
        h('li.page-item',
            {
                className: isActive ? 'active' : '',
                key: text !== '...' ? text + '-' + isActive : undefined
            },
            h('a.page-link',
                { onClick: moveToPage },
                text))
    );
}

const DemoOfPagination = defineClassComponent({
    displayName: 'DemoOfPagination',

    constructor() {
        this.state = { pageIndex: 0 };
    },

    moveToPage(pageIndex) {
        this.state = { pageIndex };
    },

    render() {
        return (
            h('div',
                {className: 'container-fluid'},
                Seq.range(1, number).map(() =>
                    h('div',
                        Pagination({
                            pageIndex: this.state.pageIndex,
                            pageSize: pageSize,
                            totalItemCount: totalItemCount,
                            onChange: evt => this.moveToPage(evt.targetPage)})))));
    }
});

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
            { className: 'page-item ' + (isActive ? 'active' : ''), key: (pageIndexToMove === null ? undefined : pageIndexToMove + text + isActive)},
            React.createElement('a',
                { className: 'page-link', onClick: onClick },
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

const container = document.getElementById('main-content');

container.innerHTML =
    '<div class="row" style="margin: 0 0 0 50px">'
    + '<div class="col-md-6"><b>js-surface:</b></div>'
    + '<div class="col-md-6"><b>React:</b></div>'
    + '<div id="section-surface" class="col-md-6"></div>'
    + '<div id="section-react" class="col-md-6"></div>'
    + '</div>';

mount(
    DemoOfPagination(),
    'section-surface');

ReactDOM.render(
    RDemoOfPagination(),
    document.getElementById('section-react'));

