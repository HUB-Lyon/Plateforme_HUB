import { FC, ReactNode } from 'react';

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

export default InventoryLayout;