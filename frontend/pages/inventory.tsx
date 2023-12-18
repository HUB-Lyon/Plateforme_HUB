import { FC } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { InventoryLayoutProps, InventoryItem, InventoryPageProps } from '../model';
import { API_URL } from '../config';
import PaginationUtil from '../components/PaginationUtils';
import 'react-toastify/dist/ReactToastify.css';

const ITEMSPERPAGE = 10;

const InventoryLayout: FC<InventoryLayoutProps> = ({ children }) => {
    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-4xl font-bold mb-8">Inventory</h1>
            <div className="overflow-x-y-auto">{children}</div>
        </div>
    );
};

const InventoryPage: FC<InventoryPageProps> = ({ inventoryData }) => {
    const router = useRouter();
    const { page } = router.query;
    const currentPage = page ? Number(page) : 1;
    const totalPages = Math.ceil(inventoryData.length / ITEMSPERPAGE);
  
    const indexOfLastItem = currentPage * ITEMSPERPAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMSPERPAGE;
    const currentItems = inventoryData.slice(indexOfFirstItem, indexOfLastItem);
  
  
    const handlePageClick = (page: number) => {
        router.push(`/inventory?page=${page}`);
    };
  
    const tableCellStyle = 'py-3 px-4 border-b text-center';
  
    return (
        <InventoryLayout>
            <table className="min-w-full bg-white border border-gray-300 mb-4">
                <thead>
                    <tr>
                        <th className={`${tableCellStyle} bg-blue-600`}>Name</th>
                        <th className={`${tableCellStyle} bg-blue-600`}>Description</th>
                        <th className={`${tableCellStyle} bg-blue-600`}>Available</th>
                        <th className={`${tableCellStyle} bg-blue-600`}>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.id} className="h-16 overflow-hidden">
                            <td className={tableCellStyle}>{item.name}</td>
                            <td className={tableCellStyle}>{item.description}</td>
                            <td className={tableCellStyle}>{item.available}</td>
                            <td className={tableCellStyle}>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mx-auto">
                <ul className="pagination flex gap-5">
                    {currentPage > 1 && (
                        <li>
                            <button
                                onClick={() => {
                                    handlePageClick(currentPage - 1);
                                }}
                                className="inline-block w-8 h-8 text-center"
                            >
                                <ArrowLeftIcon className="w-5 h-5 mx-auto" /> Prev
                            </button>
                        </li>
                    )}
                    <PaginationUtil
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageClick={handlePageClick}
                    />
                    {currentPage < totalPages && (
                        <li>
                            <button
                                onClick={() => {
                                    handlePageClick(currentPage + 1);
                                }}
                                className="inline-block w-8 h-8 text-center"
                            >
                    Next <ArrowRightIcon className="w-5 h-5 mx-auto" />
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </InventoryLayout>
    );
};


export const getServerSideProps = async () => {
    try {
        const response = await fetch(`${API_URL}/inventory`);
        const data: InventoryItem[] = await response.json();
        
        if (!response.ok)
            toast.error('An error occurred while retrieving inventory data');
        else {
            return {
                props: {
                    inventoryData: data,
                },
            };
        }
    } catch (error: unknown) {
        toast.error('An error occurred while processing inventory data');
        return {
            props: {
                inventoryData: [],
            },
        };
    }
};

export default InventoryPage;