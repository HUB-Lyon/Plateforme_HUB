import { FC, ReactNode, useState, useEffect } from 'react';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface InventoryLayoutProps {
    children: ReactNode;
}

const InventoryLayout: FC<InventoryLayoutProps> = ({ children }) => {
    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-4xl font-bold mb-4">Inventory</h1>
            <div className="overflow-x-auto">{children}</div>
        </div>
    );
};

interface InventoryItem {
    id: number;
    name: string;
    description: string;
    quantity: number;
}

interface InventoryPageProps {
    inventoryData: InventoryItem[];
}

const InventoryPage: FC<InventoryPageProps> = ({ inventoryData }) => {
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = inventoryData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(inventoryData.length / itemsPerPage);

    useEffect(() => {
        // Update URL with page parameter
        window.history.replaceState({}, '', `/inventory?page=${currentPage}`);
    }, [currentPage]);

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <li key={i} className={currentPage === i ? 'active' : ''}>
                    <a href={`?page=${i}`} onClick={(e) => { e.preventDefault(); handlePageClick(i); }}>
                        {i}
                    </a>
                </li>
            );
        }
        return pageNumbers;
    };

    return (
        <InventoryLayout>
            <table className="min-w-full bg-white border border-gray-300 mb-4">
                <thead>
                    <tr>
                        <th className="py-3 px-6 bg-gray-300 text-center">ID</th>
                        <th className="py-3 px-6 bg-gray-300 text-center">Name</th>
                        <th className="py-3 px-6 bg-gray-300 text-center">Description</th>
                        <th className="py-3 px-6 bg-gray-300 text-center">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.id} className="h-20 overflow-hidden">
                            <td className="py-2 px-4 border-b text-center">{item.id}</td>
                            <td className="py-2 px-4 border-b text-center">{item.name}</td>
                            <td className="py-2 px-4 border-b text-center">{item.description}</td>
                            <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ul className="pagination flex gap-2">
                <li className={currentPage === 1 ? 'disabled' : ''}>
                    <a
                        href={`?page=${currentPage - 1}`}
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                                handlePageClick(currentPage - 1);
                            }
                        }}
                    >
                        &laquo; Prev
                    </a>
                </li>
                {renderPageNumbers()}
                <li className={currentPage === totalPages ? 'disabled' : ''}>
                    <a
                        href={`?page=${currentPage + 1}`}
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                                handlePageClick(currentPage + 1);
                            }
                        }}
                    >
                        Next &raquo;
                    </a>
                </li>
            </ul>
        </InventoryLayout>
    );
};


export const getServerSideProps = async () => {
    try {
        const response = await fetch(`${API_URL}/inventory`);
        const data: InventoryItem[] = await response.json();

        return {
            props: {
                inventoryData: data,
            },
        };
    } catch (error) {
        toast.error(`An error occurred: ${error}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
        });

        return {
            props: {
                inventoryData: [],
            },
        };
    }
};

export default InventoryPage;