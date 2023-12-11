import { FC, useEffect, useState } from 'react';
import InventoryLayout from './component/inventory_layout';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  description: string;
}

const InventoryPage: FC = () => {
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const response = await fetch('http://localhost:3000/inventory', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data: InventoryItem[] = await response.json();
                console.log(data);
                setInventoryData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInventoryData();
    }, []);

    return (
        <InventoryLayout>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-3 px-6 bg-gray-300 text-center">ID</th>
                        <th className="py-3 px-6 bg-gray-300 text-center">Name</th>
                        <th className="py-3 px-6 bg-gray-300 text-center">Description</th>
                        <th className="py-3 px-6 bg-gray-300 text-center">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryData.map((item) => (
                        <tr key={item.id}>
                            <td className="py-2 px-4 border-b text-center">{item.id}</td>
                            <td className="py-2 px-4 border-b text-center">{item.name}</td>
                            <td className="py-2 px-4 border-b text-center">{item.description}</td>
                            <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </InventoryLayout>
    );
};

export default InventoryPage;