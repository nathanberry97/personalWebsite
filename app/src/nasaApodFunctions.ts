import { apodData } from "./types";
import axios from 'axios';
import 'dotenv/config';

export async function getData(): Promise<apodData>{

    const apiKey: string = process.env.NSAS_API_KEY!;

    try {
        const response = await axios.request({
            method: 'get',
            baseURL: `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        });

        const nasaData: apodData = response.data;

        console.log(nasaData)

        return(nasaData);
    } catch {
        throw new Error('Not okay');
    }
}
