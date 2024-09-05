import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        // Parse the request body
        const requestBody = await request.json();
        console.log('Request Body:', requestBody);

        // Define the path to data.json file in the same directory as route.js
        const filePath = path.join(process.cwd(), 'app/api/saveData', 'data.json');

        // Write the requestBody to data.json, overwriting existing content
        fs.writeFileSync(filePath, JSON.stringify(requestBody, null, 2), 'utf-8');

        return new Response(JSON.stringify({ message: 'Data saved successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Failed to save data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
