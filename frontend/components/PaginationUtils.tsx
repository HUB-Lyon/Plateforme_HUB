import { FC } from 'react';
import { RenderPageNumbersProps } from '../model';

const PaginationUtil: FC<RenderPageNumbersProps> = ({
    currentPage,
    totalPages,
    handlePageClick,
}) => {
    const maxPagesToShow = 5;

    const renderPageButtons = () => {
        const pageButtons = [];
        const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

        // Calculate start and end pages to display based on the current page
        let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

        // Adjust start and end pages if we reach the end of the total pages
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let pageN = startPage; pageN <= endPage; pageN++) {
            pageButtons.push(
                <li key={pageN} className={currentPage === pageN ? 'active' : ''}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageClick(pageN);
                        }}
                        className={'text-center inline-block w-9 h-9 leading-9 rounded-full bg-gray-300 hover:bg-gray-400 focus:outline-none focus:bg-gray-400 cursor-pointer'}
                    >
                        {pageN}
                    </button>
                </li>
            );
        }

        return pageButtons;
    };

    return <ul className="flex list-none">{renderPageButtons()}</ul>;
};

export default PaginationUtil;
