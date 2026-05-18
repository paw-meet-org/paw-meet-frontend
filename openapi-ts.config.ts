import 'dotenv/config';
import { defineConfig } from '@hey-api/openapi-ts';

const API_URL = process.env.OPENAPI_URL;

export default defineConfig({
    input: `${API_URL}/api/schema`,
    output: './api',
    plugins: [
        {
            name: '@hey-api/typescript',
            definitions: {
                case: 'preserve',
            },
        },
        {
            name: '@hey-api/sdk',
            operations: {
                strategy: 'byTags',
                containerName: '{{name}}Service',
            },
        }
    ],
});