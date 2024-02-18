'use client';

import { addCalendarEvent } from './action';

export default function AddCalendarPage() {
  return (
    <section>
      <button
        onClick={async () => {
          await addCalendarEvent();
        }}
      >
        Add Calendar Event
      </button>
    </section>
  );
}
