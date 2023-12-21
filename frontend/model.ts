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

interface RenderPageNumbersProps {
    currentPage: number;
    totalPages: number;
    handlePageClick: (page: number) => void;
}

export interface Project {
    id: number;
    image: string;
    name: string;
    description: string;
    createdAt: string;
    leaderId: number;
    membersIds: number[];
    status: string;
}

export interface User {
    id: number;
    email: string;
    token: string;
    projects_ids: number[];
    admin: boolean;
}

export type {
    InventoryLayoutProps,
    InventoryItem,
    InventoryPageProps,
    RenderPageNumbersProps
};