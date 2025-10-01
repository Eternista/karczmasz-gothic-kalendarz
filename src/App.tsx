import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, X, PlusCircle, Trash2, CheckCircle2, Circle, Download, UploadCloud } from 'lucide-react';

// --- Type Definition ---
interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm (Start time)
  timeEnd: string; // Format: HH:mm (End time)
  status: 'pending' | 'done';
}

// --- Konfiguracja Kalendarza ---
const MONTH_NAMES: string[] = [
    "Miesiąc Adanosa", "Miesiąc Innosa", "Miesiąc Beliara", "Miesiąc Kruka",
    "Miesiąc Starego Obozu", "Miesiąc Nowego Obozu", "Miesiąc Bractwa", "Miesiąc Khorinis",
    "Miesiąc Górniczej Doliny", "Miesiąc Jarkendaru", "Miesiąc Irdorath", "Miesiąc Końca"
];
const DAYS_OF_WEEK = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];
const DAYS_IN_MONTH = 28;
const FIXED_YEAR = 2025;


// --- Komponenty z typami ---

interface EventItemProps {
  event: Event;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onToggleStatus, onDelete }) => {
    const isDone = event.status === 'done';
    return (
        <div className={`p-3 rounded-lg mb-2 border-l-4 transition-all duration-300 ${isDone ? 'bg-gray-800 border-green-700' : 'bg-gray-700 border-red-800 hover:bg-gray-600'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`font-bold text-lg ${isDone ? 'text-green-300 line-through' : 'text-red-300'}`}>{event.title}</p>
                    <p className={`text-sm text-gray-300 ${isDone ? 'line-through' : ''}`}>{event.description}</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    <button onClick={() => onToggleStatus(event.id)} title={isDone ? "Oznacz jako niewykonane" : "Oznacz jako wykonane"}>
                        {isDone ? <CheckCircle2 size={20} className="text-green-500"/> : <Circle size={20} className="text-gray-400 hover:text-white"/>}
                    </button>
                    <button onClick={() => onDelete(event.id)} className="text-gray-400 hover:text-red-500" title="Usuń wydarzenie">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
            <div className="flex items-center text-xs text-gray-400 mt-2">
                <Calendar size={14} className="mr-2" />
                <span>Dzień: {new Date(event.date).getUTCDate()}, {MONTH_NAMES[new Date(event.date).getUTCMonth()]}</span>
                <Clock size={14} className="ml-4 mr-2" />
                <span>{event.time} - {event.timeEnd}</span>
            </div>
        </div>
    );
};

interface AddEventFormProps {
    onAddEvent: (event: Event) => void;
    onCancel: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ onAddEvent, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [month, setMonth] = useState(0);
    const [day, setDay] = useState(1);
    const [time, setTime] = useState('12:00');
    const [timeEnd, setTimeEnd] = useState('13:00');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) {
            alert("Tytuł wydarzenia jest wymagany.");
            return;
        }
        if (timeEnd < time) {
            alert("Czas zakończenia nie może być wcześniejszy niż czas rozpoczęcia.");
            return;
        }
        const newEvent: Event = {
            id: Date.now(), title, description,
            date: `${FIXED_YEAR}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            time,
            timeEnd,
            status: 'pending'
        };
        onAddEvent(newEvent);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-red-300">Nowe wydarzenie</h3>
                <button type="button" onClick={onCancel} className="p-1 rounded-full hover:bg-gray-700"><X size={20}/></button>
            </div>
            <div className="space-y-4 flex-grow">
                <input type="text" placeholder="Tytuł wydarzenia" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500" />
                <textarea placeholder="Opis" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
                <div className="grid grid-cols-2 gap-4">
                    <select value={month} onChange={e => setMonth(Number(e.target.value))} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                        {MONTH_NAMES.map((name, index) => <option key={index} value={index}>{name}</option>)}
                    </select>
                    <input type="number" min="1" max={DAYS_IN_MONTH} value={day} onChange={e => setDay(Number(e.target.value))} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-400">Od:</label>
                        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Do:</label>
                        <input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                </div>
            </div>
            <button type="submit" className="mt-4 w-full bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Zapisz</button>
        </form>
    );
};


export default function App() {
    const [viewingDate, setViewingDate] = useState<Date>(new Date(FIXED_YEAR, 0, 1));
    const [today, setToday] = useState<Date>(new Date(FIXED_YEAR, 0, 1));
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/get-events')
            .then(res => res.json())
            .then((data: { events: Event[] }) => {
                const loadedEvents = (data.events || []).map(event => {
                    // Zapewnij kompatybilność wsteczną dla starych wydarzeń bez timeEnd
                    if (event.timeEnd) return event;
                    const [startHour, startMinute] = event.time.split(':').map(Number);
                    const endHour = (startHour + 1) % 24;
                    return {
                        ...event,
                        timeEnd: `${String(endHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`
                    };
                });
                setEvents(loadedEvents);
            })
            .catch(error => console.error("Błąd ładowania danych z serwera:", error))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const handler = setTimeout(() => {
            setIsSaving(true);
            fetch('/api/save-events', {
                method: 'POST',
                body: JSON.stringify({ events }),
            })
            .then(res => { if(!res.ok) throw new Error("Błąd zapisu danych"); })
            .catch(error => console.error("Błąd zapisu:", error))
            .finally(() => setIsSaving(false));
        }, 1000);

        return () => clearTimeout(handler);
    }, [events, isLoading]);
    
    const handleDownloadJson = (): void => {
        const dataToSave = { events };
        const jsonString = JSON.stringify(dataToSave, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'gothic_calendar_backup.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const viewingMonth = viewingDate.getMonth();

    const upcomingEvents = useMemo<Event[]>(() => {
        const todayWithoutTime = new Date(today);
        todayWithoutTime.setUTCHours(0, 0, 0, 0);
        return events
            .filter(event => new Date(`${event.date}T23:59:59Z`) >= todayWithoutTime)
            .sort((a, b) => {
                if (a.status === b.status) {
                    const dateA = new Date(`${a.date}T${a.time}:00Z`);
                    const dateB = new Date(`${b.date}T${b.time}:00Z`);
                    return dateA.getTime() - dateB.getTime();
                }
                return a.status === 'done' ? 1 : -1;
            });
    }, [events, today]);

    const eventsForSelectedDay = useMemo<Event[]>(() => {
        if (!selectedDay) return [];
        return events
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getUTCMonth() === selectedDay.getUTCMonth() &&
                       eventDate.getUTCDate() === selectedDay.getUTCDate();
            })
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [events, selectedDay]);

    const handleAddEvent = (newEvent: Event): void => {
        setEvents(prev => [...prev, newEvent]);
        setIsAddingEvent(false);
    };
    
    const handleDeleteEvent = (eventId: number): void => {
        setEvents(prev => prev.filter(event => event.id !== eventId));
    };

    const handleToggleEventStatus = (eventId: number): void => {
        setEvents(prev => prev.map(event => 
            event.id === eventId ? { ...event, status: event.status === 'done' ? 'pending' : 'done' } : event
        ));
    };

    const handleSetToday = (month: number, day: number): void => {
        const newDay = Math.max(1, Math.min(DAYS_IN_MONTH, day));
        const newDate = new Date(Date.UTC(FIXED_YEAR, month, newDay));
        setToday(newDate);
        setViewingDate(newDate);
    };

    const handlePrevMonth = (): void => setViewingDate(prev => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1)));
    const handleNextMonth = (): void => setViewingDate(prev => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1)));
    const handleDayClick = (day: number): void => setSelectedDay(new Date(Date.UTC(FIXED_YEAR, viewingMonth, day)));
    
    const renderCalendarGrid = () => {
        const days = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);
        const eventDays = new Set(events.filter(e => new Date(e.date).getUTCMonth() === viewingMonth).map(e => new Date(e.date).getUTCDate()));
        return days.map(day => {
            const isToday = day === today.getUTCDate() && viewingMonth === today.getUTCMonth();
            const isSelected = selectedDay?.getUTCDate() === day && selectedDay?.getUTCMonth() === viewingMonth;
            return (
                <div key={day} className="relative aspect-square">
                    <button onClick={() => handleDayClick(day)} className={`w-full h-full flex items-center justify-center rounded-lg transition-colors text-lg ${isToday ? 'bg-red-800 text-white font-bold' : 'bg-gray-800 hover:bg-gray-700'} ${isSelected ? 'ring-2 ring-red-400' : ''}`}>
                        {day}
                        {eventDays.has(day) && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-400 rounded-full"></div>}
                    </button>
                </div>
            );
        });
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                 <header className="text-center mb-4 relative">
                    <h1 className="text-4xl md:text-5xl font-bold text-red-300" style={{ fontFamily: 'MedievalSharp, cursive' }}>Kalendarz Świata Gothic</h1>
                    <p className="text-gray-400 mt-2">Rok ma 12 miesięcy, a każdy miesiąc 28 dni.</p>
                    <div className="absolute top-0 right-0 flex items-center gap-4">
                        {isSaving && <div className="flex items-center gap-2 text-gray-400 animate-pulse"><UploadCloud size={20} /><span>Zapisywanie...</span></div>}
                        <button onClick={handleDownloadJson} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-lg transition-colors" title="Pobierz aktualny stan jako plik JSON">
                            <Download size={20} />
                            <span className="hidden md:inline">Pobierz Kopię</span>
                        </button>
                    </div>
                </header>
                
                 <div className="flex flex-wrap justify-center items-center gap-4 my-6 bg-gray-800/50 p-4 rounded-lg max-w-lg mx-auto border border-gray-700">
                    <label className="font-semibold whitespace-nowrap">Aktualna data w grze:</label>
                    <select value={today.getUTCMonth()} onChange={(e) => handleSetToday(Number(e.target.value), today.getUTCDate())} className="bg-gray-700 p-2 rounded-md border border-gray-600">
                        {MONTH_NAMES.map((name, index) => <option key={index} value={index}>{name}</option>)}
                    </select>
                    <input type="number" min="1" max={DAYS_IN_MONTH} value={today.getUTCDate()} onChange={(e) => handleSetToday(today.getUTCMonth(), Number(e.target.value))} className="bg-gray-700 p-2 rounded-md w-20 border border-gray-600" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <main className="lg:col-span-2 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-700"><ChevronLeft size={28} /></button>
                            <h2 className="text-2xl md:text-3xl font-semibold text-center">{MONTH_NAMES[viewingMonth]}</h2>
                            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-700"><ChevronRight size={28} /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-gray-400 mb-3">{DAYS_OF_WEEK.map(day => <div key={day} className="font-medium">{day}</div>)}</div>
                        <div className="grid grid-cols-7 gap-2">{renderCalendarGrid()}</div>
                    </main>

                    <aside className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col">
                        {isAddingEvent ? <AddEventForm onAddEvent={handleAddEvent} onCancel={() => setIsAddingEvent(false)} />
                        : selectedDay ? (
                            <div className="flex-grow flex flex-col min-h-0">
                                <div className="flex justify-between items-center mb-4">
                                     <h3 className="text-xl font-semibold text-red-300">Plan na: {selectedDay.getUTCDate()} {MONTH_NAMES[selectedDay.getUTCMonth()]}</h3>
                                    <button onClick={() => setSelectedDay(null)} className="p-1 rounded-full hover:bg-gray-700"><X size={20}/></button>
                                </div>
                                <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                                    {Array.from({ length: 24 }).map((_, hour) => {
                                        const eventsForHour = eventsForSelectedDay.filter(event => {
                                            const startHour = parseFloat(event.time.replace(':', '.'));
                                            const endHour = parseFloat(event.timeEnd.replace(':', '.'));
                                            // Wydarzenie jest w tej godzinie, jeśli zaczyna się przed jej końcem
                                            // i kończy się po jej początku.
                                            return startHour < (hour + 1) && endHour > hour;
                                        });

                                        return (
                                            <div key={hour} className="flex items-start py-2 border-b border-gray-700 last:border-b-0">
                                                <span className="w-16 text-gray-400 pt-3">{`${String(hour).padStart(2, '0')}:00`}</span>
                                                <div className="flex-1 space-y-2">
                                                    {eventsForHour.length > 0 ? (
                                                        eventsForHour.map(event => <EventItem key={event.id} event={event} onToggleStatus={handleToggleEventStatus} onDelete={handleDeleteEvent} />)
                                                    ) : (<div className="h-12"></div>)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-semibold text-red-300">Zbliżające się wydarzenia</h3>
                                    <button onClick={() => setIsAddingEvent(true)} className="flex items-center gap-2 bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                        <PlusCircle size={20} /><span>Dodaj</span>
                                    </button>
                                </div>
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map(event => <EventItem key={event.id} event={event} onToggleStatus={handleToggleEventStatus} onDelete={handleDeleteEvent} />)
                                ) : (<p className="text-gray-400">Brak nadchodzących wydarzeń.</p>)}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}