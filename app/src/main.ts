import {
    getData,
    formatData,
    writeApodHtmlFile,
    writeHtmlFileToS3,
    clearCacheCloudFront
} from './nasaApodFunctions';

async function main() {
    const rawData = await getData();
    const htmlData = formatData(rawData);
    const htmlFile = writeApodHtmlFile(htmlData);
    writeHtmlFileToS3(htmlFile);
    clearCacheCloudFront(process.env.DISTRIBUTION_ID_REDIRECT_BUCKET!);
    clearCacheCloudFront(process.env.DISTRIBUTION_ID_WEBSITE_BUCKET!);
}

main();
