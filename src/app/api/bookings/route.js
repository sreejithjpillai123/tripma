import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'bookings.json');

export async function GET() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 200, // Return empty object if file missing or error
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, booking } = body;

        let data = {};
        try {
            const fileContents = await fs.readFile(dataFilePath, 'utf8');
            data = JSON.parse(fileContents);
        } catch (error) {
            // File might not exist or be empty
        }

        if (!data[email]) {
            data[email] = [];
        }

        // Avoid duplicates
        const existingIndex = data[email].findIndex(b => b.id === booking.id);
        if (existingIndex === -1) {
            data[email].unshift(booking);
        } else {
            // Optional: update existing? For now, we only add if new.
        }

        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 4), 'utf8');

        return new Response(JSON.stringify({ success: true, booking }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
