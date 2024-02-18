'use client';

import { calendar_v3 } from 'googleapis';

export default function AddCalendarEventButton({
  calendar,
}: {
  calendar: calendar_v3.Calendar;
}) {
  return (
    <button
      onClick={() => {
        calendar.events.insert({
          calendarId: 'primary',
          sendUpdates: 'all',
          requestBody: {
            start: {
              dateTime: '2024-02-01T09:00:00-08:00',
            },
            end: {
              dateTime: '2024-02-20T17:00:00-08:00',
            },
            // attendees: [
            //     {
            //         email: ""
            //     }
            // ]
            description: 'test',
          },
        });
      }}
    >
      Add Calendar Event
    </button>
  );
}
