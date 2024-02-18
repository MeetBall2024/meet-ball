'use server';

import { getCurrentUser } from '@/lib/authentication';
import { getCalendarClient } from '@/lib/googleApi';

export async function addCalendarEvent() {
  console.log('hello');
  const user = await getCurrentUser();
  console.log(user);
  const calendar = await getCalendarClient(user.id);
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
}
