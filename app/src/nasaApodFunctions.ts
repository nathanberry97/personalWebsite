import { apodData, htmlApodData } from "./types";
import * as fs from 'fs';
import axios from 'axios';
import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';

export async function getData(): Promise<apodData>{

    const apiKey: string = process.env.NSAS_API_KEY!;

    try {
        const response = await axios.request({
            method: 'get',
            baseURL: `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        });

        const nasaData: apodData = response.data;

        return(nasaData);
    } catch {
        throw new Error('Not okay');
    }
}

export function formatData(data: apodData): htmlApodData{

    let copyright = '<h4> Copyright: <a href="https://apod.nasa.gov/apod/astropix.html">NASA APOD</a> </h4>';

    if (data.copyright) {
        const formatCopyright = data.copyright.replace(/\n/g, ' ');
        copyright = `<h4> Copyright:${formatCopyright} </h4>`;
    }

    let formattedApodData: htmlApodData = {
        title: `<h1> ${data.title} </h1>`,
        date: `<h3> ${data.date} </h3>`,
        image: `<img src=${data.url}>`,
        copyright: copyright,
        explanation: `<p> ${data.explanation} </p>`
    }

    return (formattedApodData);
}

export function writeApodHtmlFile(data: htmlApodData): string{

    try {
        let htmlFile = fs.readFileSync('./html/template.html', 'utf-8');

        htmlFile = htmlFile.replace(/Title/g, data.title);
        htmlFile = htmlFile.replace(/Date/g, data.date);
        htmlFile = htmlFile.replace(/Image/g, data.image);
        htmlFile = htmlFile.replace(/Copyright/g, data.copyright);
        htmlFile = htmlFile.replace(/Explanation/g, data.explanation);

        return (htmlFile);
    } catch {
        throw new Error('Unable to fetch and update template html file');
    }
}

export function writeHtmlFileToS3(file: string){
    const client = new S3Client({ region: 'eu-west-2' });

    const command = new PutObjectCommand({
        Bucket: 'nathanberry.co.uk',
        Key: 'apod.html',
        Body: file
    });

    try {
        client.send(command);
    } catch {
        console.error('Unable to upload APOD html file to S3');
    }
}

export function clearCacheCloudFront(distribution_id: string){
    const client = new CloudFrontClient({ region: 'eu-west-2' });

    const command = new CreateInvalidationCommand({
        DistributionId: distribution_id,
        InvalidationBatch: {
            Paths: {
                Quantity: 1,
                Items: ['/apod.html']
            },
            CallerReference: `Invalidate APOD cache ${new Date().getDate()}`
        },
    });

    try {
        client.send(command);
    } catch {
        console.error('Unable to invalidate cloudfront cache');
    }
}
