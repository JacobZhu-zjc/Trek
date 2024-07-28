import { categoryColorMap, categoryIconMap } from "../constants/budgetCategory";


export function getIconForCategory(categoryName: string) {
    const icon = categoryIconMap[categoryName as keyof typeof categoryIconMap];
    return icon || categoryIconMap["Other"];
}

export function getColorForCategory(categoryName: string) {
    const color = categoryColorMap[categoryName as keyof typeof categoryColorMap];
    return color || "gray.6";
}