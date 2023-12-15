import { FC } from 'react';

interface RenderPageNumbersProps {
  currentPage: number;
  totalPages: number;
  handlePageClick: (page: number) => void;
}

const PaginationUtil: FC<RenderPageNumbersProps> = ({
    currentPage,
    totalPages,
    handlePageClick,
}) => {
    const renderPageButtons = () => {
        const pageButtons = [];
        for (let pageN = 1; pageN <= totalPages; pageN++) {
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
