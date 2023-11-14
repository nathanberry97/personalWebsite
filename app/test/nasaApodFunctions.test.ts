import { getData } from '../src/nasaApodFunctions';
import axios from 'axios';
import { apodData } from '../src/types';

const mockRequest = jest.spyOn(axios, 'request').mockImplementation(jest.fn());

describe('Test NSAS APOD app', () => {
    const env = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...env };
        mockRequest.mockClear();
    });

    afterEach(() => {
        process.env = env;
    });

    test('Test get data returns apodData', async () => {
        process.env.NSAS_API_KEY = '1234567890';

        mockRequest.mockResolvedValue({
            data: {
                date: '10-01-97',
                explanation: 'This is space',
                hdurl: 'http://space',
                media_type: 'image',
                service_version: '2',
                title: 'space',
                url: 'https://space'
            },
            context: {
                test: 'this is a test'
            }
        });

        const response = await getData();

        const expected: apodData = {
            date: '10-01-97',
            explanation: 'This is space',
            hdurl: 'http://space',
            media_type: 'image',
            service_version: '2',
            title: 'space',
            url: 'https://space'
          }

        expect(response).toStrictEqual(expected);
    });

    test('Test get data returns error when data is missing from header', async () => {
        process.env.NSAS_API_KEY = '1234567890';
        mockRequest.mockResolvedValue({ context: { test: 'this is a test' } });

        try {
            await getData();
        } catch (err) {
            expect(err).toStrictEqual('Not okay');
        }
    });

    test('Test get data returns error when data does not match apodData', async () => {
        process.env.NSAS_API_KEY = '1234567890';
        mockRequest.mockResolvedValue({ data: { test: 'this is a test' } });

        try {
            await getData();
        } catch (err) {
            expect(err).toStrictEqual('Not okay');
        }
    });
})
