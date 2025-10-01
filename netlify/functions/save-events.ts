import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  status: 'pending' | 'done';
}

interface RequestBody {
    events: Event[];
}

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    if (!event.body) {
        return { statusCode: 400, body: 'Bad Request: Missing body' };
    }

    const data: RequestBody = JSON.parse(event.body);
    const store = getStore('gothic-calendar-data');

    await store.setJSON('events', data);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Events saved successfully' }),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(error);
    return { 
        statusCode: 500, 
        body: JSON.stringify({ error: errorMessage }) 
    };
  }
};
