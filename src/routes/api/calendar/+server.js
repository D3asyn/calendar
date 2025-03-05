import ICAL from 'ical.js';

export async function GET({ url }) {
    // Get the start and end date from query parameters
    const startDateParam = url.searchParams.get('start');
    const endDateParam = url.searchParams.get('end');

    // Parse the dates from query parameters
    const startDate = startDateParam ? new Date(startDateParam) : new Date();
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    endDate.setHours(23, 59, 59, 999); // Set the end date to the end of the day

    // Fetch and parse the iCal data from the public Google Calendar
    const response = await fetch('https://calendar.google.com/calendar/ical/d2a4e81eb4f8e4665911a343e79113f1f25c476c23fd1cb7804c4fe28017babd%40group.calendar.google.com/public/basic.ics');
    const text = await response.text();
    const jcalData = ICAL.parse(text);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    // Filter events that fall within the specified date range
    const events = vevents
        .map(vevent => {
            const event = new ICAL.Event(vevent);
            const eventStart = event.startDate.toJSDate();
            const eventEnd = event.endDate ? event.endDate.toJSDate() : null;

            // Filter events based on the provided start and end date range
            if (eventStart >= startDate && eventStart <= endDate) {
                return {
                    start: eventStart,
                    end: eventEnd,
                    text: event.summary,
                    location: event.location
                };
            }
            return null;
        })
        .filter(event => event !== null); // Remove any null entries

    // Return the filtered events as JSON
    return new Response(JSON.stringify(events), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
