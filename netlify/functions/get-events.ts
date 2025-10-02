import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { getStore } from '@netlify/blobs';

// Definicja typu dla spójności
interface Event {
    id: number;
    title: string;
    description: string;
    date: string; // format YYYY-MM-DD
    timeStart: string; // format HH:mm
    timeEnd: string; // format HH:mm
    status: 'pending' | 'done';
}

export const handler: Handler = async (_event: HandlerEvent, _context: HandlerContext) => {
  try {
    // Używamy nazwy 'gothic-events' - musi być taka sama jak w pliku save-events.ts
    const store = getStore('gothic-events');
    let data = await store.get('all-events', { type: 'json' });

    // --- KLUCZOWA LOGIKA "SAMONAPRAWIAJĄCA" ---
    // Jeśli nie ma żadnych danych (pierwsze uruchomienie), stwórz je
    if (!data) {
      const initialData = { events: [] };
      // Zapisujemy dane po raz pierwszy, co finalizuje stworzenie bazy
      await store.setJSON('all-events', initialData);
      data = initialData;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process events', details: errorMessage }),
    };
  }
};