/**
 * @fileoverview Wikipedia API utility functions
 * @author Matthew Kang
 */

import axios from "axios";
import * as fs from 'fs';
import * as path from 'path';
import {convert} from "html-to-text";
import payload from "payload";
import {randomUUID} from "crypto";


/**
 *
 * @param name wikipedia name (e.g. "en:New York City")
 * @returns the object id of the photo stored in the database
 */
export async function downloadImageFromWikipedia(name: string): Promise<string | number> {

    try {
        // "en:New York City" -> "New York City"
        let wikipediaName = name.split(":")[1];
        let wikipediaInstance = name.split(":")[0];

        if (!wikipediaName) {
            wikipediaName = name;
            wikipediaInstance = "en";
        }

        const imageName = await getWikipediaImageNameFromTitle(wikipediaName, wikipediaInstance);
        const imageUrl = "https://commons.wikimedia.org/wiki/Special:FilePath/File:" + imageName;

        const [imageAttributes, filePath] = await Promise.all([
            getAdditionalImageAttributes(imageName, wikipediaInstance),
            downloadImage(imageUrl)
        ]);

        if (!filePath) {
            return Promise.reject("Error downloading image from Wikipedia");
        }

        const {artist, license, licenseUrl} = imageAttributes;

        const photo = await payload.create({
            collection: 'media',
            data: {
                image_origin: 'external',
                artist: artist,
                license: license,
                license_url: licenseUrl,
            },
            filePath: path.resolve(filePath),
        });

        // clean up the downloaded image (remove the file)
        // this is done asynchronously
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${filePath}`, err);
            } else {
                console.log(`Successfully deleted file: ${filePath}`);
            }
        });

        return Promise.resolve(photo.id);

    } catch (error) {
        console.error('Error downloading image from Wikipedia:', error);
        return Promise.reject('Error downloading image from Wikipedia');
    }
}


/**
 * From a Wikipedia page title, fetches the name of the main image associated with the page.
 * @param {string} pageTitle - The title of the Wikipedia page (e.g. 'New York City').
 * @returns {Promise<string>} - A promise for name of the main image associated with the page (e.g. 'New_York_City.jpg').
 */
export async function getWikipediaImageNameFromTitle(pageTitle: string, wikipediaInstance: string): Promise<string> {


    const params = {
        action: 'query',
        prop: 'images|pageimages',
        format: 'json',
        titles: decodeURIComponent(pageTitle),
    };

    const url = `https://${wikipediaInstance}.wikipedia.org/w/api.php`;
    const username = '4bdb8efa119723abac0374d31d9aa92b';
    const password = '4983bb8156987392a524f76ce23b4aaff067e5a7';

    console.log("Fetching Wikipedia 1");

    const response = await axios.get(url, {
        params: params,
        auth: {
            username: username,
            password: password
        }
    });

    console.log(JSON.stringify(response.data));

    interface Page {
        pageid: number;
        ns: number;
        title: string;
        images: { ns: number; title: string }[];
        thumbnail?: { source: string; width: number; height: number };
        pageimage?: string;
    }

    const pages = response.data.query.pages;

    console.log(JSON.stringify(pages));
    const [firstPage] = Object.values(pages) as Page[];
    const pageImage = firstPage?.pageimage;

    if (!pageImage) {
        return Promise.reject("No Image found in Wikipedia");
    }

    return Promise.resolve(pageImage);
}

/**
 * Downloads an image from a URL and saves it locally with the correct extension based on its MIME type.
 * @param {string} url - The URL of the image to download.
 * @param {string} filepath - The local path where the image will be saved, without extension.
 * @returns {Promise<string>} - A promise that resolves to the file extension used.
 */
export const downloadImage = async (url: string): Promise<string> => {
    try {
        console.log("In downloadImage");
        console.log(url);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
        });

        console.log("Download Response received");
        console.log(response.headers);

        // Read MIME Type
        const mimeType = response.headers['content-type'];

        // Map MIME Type to Extension
        const mimeToExtension: { [key: string]: string } = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/svg+xml': '.svg',
            'image/webp': '.webp',
        };

        // Determine Extension
        const extension: string = mimeToExtension[mimeType] || '.jpg'; // Fallback Option

        // Modify Filepath based on determined extension
        const fileName = `${randomUUID()}${extension}`;
        const filePath = path.resolve(__dirname, `./${fileName}`);

        console.log("Writing to file: ", filePath);

        const writer = fs.createWriteStream(filePath);

        console.log("22 Writing to file: ", filePath);

        // Convert response data to a Buffer and write it
        const buffer = Buffer.from(response.data, 'binary');
        writer.write(buffer, () => {
            writer.end(); // Ensure to close the stream
        });


        return new Promise<string>((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading the image:', error);
    }

    return new Promise<string>((resolve, reject) => reject('Error downloading the image'));
};


/**
 * get the image attributes from wikipedia including artist, license, and license url
 * @param imageName the name of the image (excluding "File:")
 * @returns a promise that resolves to an object containing the artist, license, and license url (if available)
 */
export async function getAdditionalImageAttributes(imageName: string, wikipediaInstance: string): Promise<{
    artist: string | undefined,
    license: string | undefined,
    licenseUrl: string | undefined
}> {

    const url = `https://${wikipediaInstance}.wikipedia.org/w/api.php`;
    const username = '4bdb8efa119723abac0374d31d9aa92b';
    const password = '4983bb8156987392a524f76ce23b4aaff067e5a7';


    const imgAttributionParams = {
        action: 'query',
        prop: 'imageinfo',
        iiprop: 'extmetadata',
        titles: `File:${imageName}`,
        format: 'json',
    };

    console.log("Fetching Wikipedia 2");

    const response2 = await axios.get(url, {
        params: imgAttributionParams,
        auth: {
            username: username,
            password: password
        }
    });

    console.log(JSON.stringify(response2.data));

    interface ExtMetadata {
        [key: string]: {
            value: string;
            source: string;
            hidden?: string;
        };
    }

    interface ImageInfo {
        extmetadata: ExtMetadata;
    }

    interface ImagePage {
        ns: number;
        title: string;
        missing?: string;
        known?: string;
        imagerepository: string;
        imageinfo: ImageInfo[];
    }

    const imagePages = response2.data.query.pages;
    const [firstImagePage] = Object.values(imagePages) as ImagePage[];

    const imageInfo = firstImagePage.imageinfo[0].extmetadata;

    const license = imageInfo.License?.value || imageInfo.LicenseShortName?.value;
    const licenseUrl = imageInfo.LicenseUrl?.value;
    const attributionRequired = imageInfo.AttributionRequired?.value;

    let artist;

    if (attributionRequired && (attributionRequired === "true" || attributionRequired === "True") && imageInfo.Artist) {
        artist = parseHtmlString(imageInfo.Artist.value);
    }

    return Promise.resolve({artist, license, licenseUrl});
}


export function parseHtmlString(htmlString: string): string {
    const options = {
        selectors: [
            {selector: 'a', options: {ignoreHref: true}},
        ]
    };
    const text = convert(htmlString, options);
    return text;
}

