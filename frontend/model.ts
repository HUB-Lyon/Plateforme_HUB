import { ReactNode } from 'react';

interface InventoryLayoutProps {
    children: ReactNode;
}
  
interface InventoryItem {
    id: number;
    name: string;
    description: string;
    available: number;
    quantity: number;
}
  
interface InventoryPageProps {
    inventoryData: InventoryItem[];
}

export type {
    InventoryLayoutProps,
    InventoryItem,
    InventoryPageProps
};