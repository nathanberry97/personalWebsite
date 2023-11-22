import {
    getData,
    formatData,
    writeApodHtmlFile,
    writeHtmlFileToS3
} from './nasaApodFunctions';

async function main() {
    const rawData = await getData();
    const htmlData = formatData(rawData);
    const htmlFile = writeApodHtmlFile(htmlData);
    writeHtmlFileToS3(htmlFile);
}

main();
