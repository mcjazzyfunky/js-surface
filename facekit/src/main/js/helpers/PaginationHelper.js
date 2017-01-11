'use strict';

export default class PaginationHelper {
    static calcPaginationMetrics(pageIndex, pageSize, totalItemCount) {
        const ret = {};

        ret.pageIndex = isNaN(pageIndex) ? -1 : Math.max(-1, parseInt(pageIndex, 10));

        ret.pageSize = isNaN(pageSize)
                ? (pageSize === null || pageSize === Infinity ? Infinity : -1)
                : Math.floor(pageSize);

        if (ret.pageSize <= 0) {
            ret.pageSize = -1;
        }

        ret.totalItemCount = isNaN(totalItemCount) ? -1 : Math.max(-1, parseInt(totalItemCount, 10));

        ret.pageCount = (ret.totalItemCount == -1 || ret.pageSize == -1)
                ? -1
                : Math.ceil(ret.totalItemCount / ret.pageSize);

        ret.isFirstPage = ret.pageIndex === 0;

        ret.isLastPage = ret.pageCount > 0 && ret.pageCount === ret.pageIndex + 1;

        return ret;
    }

    static determineVisiblePaginationButtons(pageIndex, pageCount, maxPageButtonCount) {
        const
            pageNumber = pageIndex + 1,
            pageButtonCount = Math.min(maxPageButtonCount, pageCount);

        var firstPageNumber,
            lastPageNumber;

        if (pageButtonCount === pageCount || pageNumber <= Math.round(pageButtonCount / 2)) {
            firstPageNumber = 2;
        } else if (pageCount - pageNumber < Math.round(pageButtonCount / 2)) {
            firstPageNumber = pageCount - pageButtonCount + 2;
        } else {
            firstPageNumber = pageNumber - Math.round(pageButtonCount / 2) + 2;
        }

        lastPageNumber = firstPageNumber + pageButtonCount - 3;

        return {
            pageButtonCount: pageButtonCount,
            firstButtonIndex: firstPageNumber - 1,
            lastButtonIndex: lastPageNumber - 1
        };
    }
}
