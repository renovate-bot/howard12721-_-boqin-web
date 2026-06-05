import { NextResponse } from 'next/server';

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

export async function GET() {
    try {
        const pteronToken = process.env.PTERON_TOKEN;
        const pteronApiBaseUrl = (process.env.PTERON_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

        if (!pteronToken) {
            console.error('PTERON_TOKEN is not defined');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        const response = await fetch(`${pteronApiBaseUrl}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${pteronToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await readJsonResponse(response).catch(() => ({}));
            console.error('Pteron API error:', response.status, errorData);
            return NextResponse.json(
                { error: 'Failed to fetch project info', details: errorData },
                { status: response.status }
            );
        }

        const data = await readJsonResponse(response);
        // Return only necessary info (balance) if needed, or the whole object.
        // The user asked for balance. Pteron returns Project object.
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error in /api/me:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
