import { Calendar } from '@/components/calendar/calendar';
import { cookies } from 'next/headers';
import { useState } from 'react';
import EventButton from '../button/event-button';

export default function DateCalendar() {
  const initialDays: Date[] = [];
  const [days, setDays] = useState<Date[] | undefined>(initialDays);

  return (
    <>
      <Calendar
        mode="multiple"
        selected={days}
        onSelect={setDays}
        className="rounded-md border"
      />
      <EventButton title={'🧆 미트볼 굴리기'} meetingDays={days} />
    </>
  );
}
