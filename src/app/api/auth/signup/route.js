
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

        // Read existing users
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        const users = JSON.parse(fileData);

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            );
        }

        // Create new user
        const newUser = {
            id: (users.length + 1).toString(), // Simple ID generation
            name,
            email,
            password, // Note: In a real app, hash this password!
        };

        // Add to array
        users.push(newUser);

        // Write back to file
        fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));

        return NextResponse.json(
            { message: 'User created successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email } },
            { status: 201 }
        );

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
