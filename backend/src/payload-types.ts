/* tslint:disable */

/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
    collections: {
        admins: Admin;
        destinations: Destination;
        explore: Explore;
        media: Media;
        legal: Legal;
        'payload-preferences': PayloadPreference;
        'payload-migrations': PayloadMigration;
    };
    globals: {};
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "admins".
 */
export interface Admin {
    id: string;
    updatedAt: string;
    createdAt: string;
    email: string;
    resetPasswordToken?: string | null;
    resetPasswordExpiration?: string | null;
    salt?: string | null;
    hash?: string | null;
    loginAttempts?: number | null;
    lockUntil?: string | null;
    password: string | null;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "destinations".
 */
export interface Destination {
    id: string;
    type: 'Feature';
    /**
     * @minItems 2
     * @maxItems 2
     */
    geometry?: [number, number] | null;
    properties: {
        mapbox_id?: string | null;
        osm_id?: string | null;
        osm_type?: string | null;
        wikidata_id?: string | null;
        geonames_id?: number | null;
        wikipedia?: string | null;
        wikipedia_url?: string | null;
        destination_type: 'poi' | 'address' | 'area';
        name: string;
        display_name?: string | null;
        description?: string | null;
        address?: string | null;
        main_photo?: (string | null) | Media;
        poi_category?: string | null;
        timezone?: string | null;
        bbox?: {
            min_latitude?: number | null;
            min_longitude?: number | null;
            max_latitude?: number | null;
            max_longitude?: number | null;
        };
    };
    updatedAt: string;
    createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
    id: string;
    image_origin: 'trek' | 'external';
    artist?: string | null;
    license_url?: string | null;
    license?: string | null;
    updatedAt: string;
    createdAt: string;
    url?: string | null;
    filename?: string | null;
    mimeType?: string | null;
    filesize?: number | null;
    width?: number | null;
    height?: number | null;
    focalX?: number | null;
    focalY?: number | null;
    sizes?: {
        thumbnail?: {
            url?: string | null;
            width?: number | null;
            height?: number | null;
            mimeType?: string | null;
            filesize?: number | null;
            filename?: string | null;
        };
        card?: {
            url?: string | null;
            width?: number | null;
            height?: number | null;
            mimeType?: string | null;
            filesize?: number | null;
            filename?: string | null;
        };
        tablet?: {
            url?: string | null;
            width?: number | null;
            height?: number | null;
            mimeType?: string | null;
            filesize?: number | null;
            filename?: string | null;
        };
    };
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "explore".
 */
export interface Explore {
    id: string;
    destination: string | Destination;
    description: string;
    know_before?: {
        cost?: string | null;
        transportation?: string | null;
        safety?: string | null;
    };
    slug?: string | null;
    updatedAt: string;
    createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "legal".
 */
export interface Legal {
    id: string;
    title: string;
    content?: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    } | null;
    content_html?: string | null;
    slug?: string | null;
    updatedAt: string;
    createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
    id: string;
    user: {
        relationTo: 'admins';
        value: string | Admin;
    };
    key?: string | null;
    value?:
        | {
        [k: string]: unknown;
    }
        | unknown[]
        | string
        | number
        | boolean
        | null;
    updatedAt: string;
    createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
    id: string;
    name?: string | null;
    batch?: number | null;
    updatedAt: string;
    createdAt: string;
}


// declare module 'payload' {
//   export interface GeneratedTypes extends Config {}
// }
