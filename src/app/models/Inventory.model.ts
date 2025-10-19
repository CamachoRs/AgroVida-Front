import { Category } from "./Category.model";

export interface Inventory {
    id?: number;
    nameItem?: string;
    quantity?: number;
    unitMeasurement?: string;
    entryDate?: string;
    expiryDate?: string;
    supplierName?: string;
    categoryId?: number;
    category: Category;
}