import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const readJsonResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return response.json();
    }

    const body = await response.text();
    return {
        message: 'Upstream returned a non-JSON response',
        contentType,
        body: body.slice(0, 500),
    };
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount } = body;

        // Get user from header or default for debugging
        const headersList = await headers();
        let targetUser = headersList.get('x-forwarded-user');

        // Fallback for local development/debugging
        if (!targetUser) {
            targetUser = 'howard127';
        }

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid input. Positive amount is required.' },
                { status: 400 }
            );
        }

        const pteronToken = process.env.PTERON_TOKEN;
        // Ensure base URL doesn't have trailing slash
        const pteronApiBaseUrl = (process.env.PTERON_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
        const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        if (!pteronToken) {
            console.error('PTERON_TOKEN is not defined');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        const payload = {
            targetUser,
            amount: Number(amount),
            successUrl: `${appBaseUrl}/success`,
            cancelUrl: `${appBaseUrl}/cancel`,
        };

        // If env is https://pteron.trap.show/api/v1, then we append /bills.
        const endpoint = `${pteronApiBaseUrl}/bills`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${pteronToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await readJsonResponse(response).catch(() => ({}));
            console.error('Pteron API error:', response.status, errorData, 'Endpoint:', endpoint);
            return NextResponse.json(
                { error: 'Failed to create bill', details: errorData },
                { status: response.status }
            );
        }

        const data = await readJsonResponse(response);
        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error('Error in /api/donate:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
