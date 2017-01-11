import ComponentHelper from '../helpers/ComponentHelper.js';
import PaginationHelper from '../helpers/PaginationHelper.js';

import { defineComponent, createElement as htm, Types } from 'js-surface';
import { Seq } from 'js-prelude';

export default defineComponent({
    name: 'PaginationBar',

    properties: {
        type: {
            type: Types.oneOf(['']),
            defaultValue: null
        },
        
        pageIndex: {
            type: Types.number,
            defaultValue: null
        },

        pageSize: {
            type: Types.number,
            defaultValue: null
        },
        
        totalItemCount: {
            type: Types.number,
            defaultValue: null
        },

        className: {
            type: Types.string,
            defaultValue: null
        }
    },

    render({ props }) {
        const
            pageIndex = props.pageIndex,

            metrics =
                PaginationHelper.calcPaginationMetrics(
                    props.pageIndex,
                    props.pageSize,
                    props.totalItemCount),

            textGoToFirstPage = 'Go to first page',
            textGoToPreviousPage = 'Go to previous page',
            textGoToNextPage = 'Go to next page',
            textGoToLastPage = 'Go to next page',

            paginationInfo =
                PaginationHelper.determineVisiblePaginationButtons(
                    props.pageIndex,
                    metrics.pageCount,
                    6),

            moveToPage = targetPage => {
                if (props.onChange) {
                    props.onChange({targetPage});
                }
            },

            firstPageLink =
                htm('a',
                    { className: 'k-link k-pager-nav k-pager-first k-state-disabled',
                      onClick: createClickHandler(() => moveToPage(0)),
                      ariaLabel: textGoToFirstPage,
                      text: textGoToFirstPage
                    },
                    htm('span',
                        { className: 'k-icon k-i-seek-w' })),
            
            previousPageLink =
                htm('a',
                    { className: 'k-link',
                      onClick: createClickHandler(() => moveToPage()),
                      ariaLabel: textGoToPreviousPage,
                      text: textGoToPreviousPage
                    },
                    htm('span',
                        { className: 'k-icon k-i-arrow-w' })),
            
            precedingEllipsisLink =
                htm('a',
                    { className: 'k-link',
                      onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
                    
            buttons =
                htm('ul',
                    { className: 'k-pager-numbers k-reset' },
                    Seq.range(
                        paginationInfo.firstButtonIndex ,
                        paginationInfo.lastButtonIndex + 1)
                    .map(
                        index =>
                            htm('li',
                                { key: index },
                                htm('a',
                                    { className: index === props.pageIndex ? 'k-state-selected' : 'k-link',
                                      onClick: createClickHandler(() => moveToPage(index)),
                                      tabIndex: -1,
                                      dataPage: index + 1
                                    },
                                    index + 1)))),
                            
            succeedingEllipsisLink =
                htm('a',
                    { className: 'k-link',
                      onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
            
            nextPageLink = 
                htm('a',
                    { className: 'k-link',
                      onClick: createClickHandler(() => moveToPage(222)),
                      ariaLabel: textGoToNextPage,
                      title: textGoToNextPage
                    },
                    htm('span',
                        { className: 'k-icon k-i-arrow-e' })),

            lastPageLink =
                htm('a',
                    { className: 'k-link',
                      onClick: createClickHandler(() => moveToPage(222)),
                      ariaLabel: textGoToLastPage,
                      title: textGoToLastPage
                    },
                    htm('span',
                        { className: 'k-icon k-i-seek-e' }));
                    console.log(buttons)
        return (
            htm('div',
                { className: 'k-pager-wrap k-grid-pager k-widget k-floatwrap',
                  dataRole: 'pager'
                },
                firstPageLink,
                previousPageLink,
                precedingEllipsisLink,
                buttons, 
                succeedingEllipsisLink,
                nextPageLink,
                lastPageLink
            )
        );
    }
});

function createClickHandler(onClick) {
    return event => {
        event.preventDefault();
        onClick();
    };
}

function getPaginationText(type, metrics) {
    let ret = null;
    
    switch (type) {
        case 'itemsXToY':
            ret = `Items ${metrics.firstItemIndex + 1} to ${metrics.lastItemIndex + 1}`;
            break;
            
        case 'pageX': {
            ret = `Page ${metrics.pageIndex + 1}`;
            break;
        }

        case 'pageXOfY':
            ret = `Page ${metrics.pageIndex + 1} of ${metrics.pageCount}`;
            break;
        
        default: 
            throw new Error(`[getPaginationText] Illegal type '${type}`);
    }
    
    return ret;
}
