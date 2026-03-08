import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    name: string;
    description: string;
    isFeatured: boolean;
    category: Category;
    priceInr: bigint;
}
export interface Inquiry {
    name: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export enum Category {
    breads = "breads",
    cakes = "cakes",
    cookies = "cookies",
    pastries = "pastries"
}
export interface backendInterface {
    getAllInquiries(): Promise<Array<Inquiry>>;
    getMenu(): Promise<Array<MenuItem>>;
    getMenuByPrice(): Promise<Array<MenuItem>>;
    seedMenu(): Promise<void>;
    submitInquiry(name: string, phone: string, message: string): Promise<void>;
}
