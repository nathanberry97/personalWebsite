import {
    getData,
    formatData,
    writeApodHtmlFile
} from './nasaApodFunctions';

async function main() {

    const rawApodData = await getData();
    const htmlApodData = formatData(rawApodData);
    writeApodHtmlFile(htmlApodData);

}

main();
