import { placeCategoryColorMap, placeCategoryIconMap } from "@constants/placeCategory";

export function getIconForCategory(categoryName: string) {
    const icon = placeCategoryIconMap[categoryName as keyof typeof placeCategoryIconMap];
    return icon || placeCategoryIconMap["Other"];
}

export function getColorForCategory(categoryName: string) {
    const color = placeCategoryColorMap[categoryName as keyof typeof placeCategoryColorMap];
    return color || "gray.6";
}

export const getCountryFlagEmoji = (countryCode: string) => {
    return countryCode.toUpperCase().replace(/./g, char =>
        String.fromCodePoint(char.charCodeAt(0) + 127397)
    );
};