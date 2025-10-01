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

export const handler: Handler = async (event, context) => {
  try {
    const store = getStore('gothic-calendar-data');
    const data = await store.get('events', { type: 'json' });
    
    if (!data) {
        return {
            statusCode: 200,
            body: JSON.stringify({ events: [] }),
        };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
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
