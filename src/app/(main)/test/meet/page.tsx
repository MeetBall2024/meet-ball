'use client';

import { useState } from 'react';
import { createMeet, deleteMeet, updateMeet } from '@/controllers/meet';
import { MeetType } from '@prisma/client';

export default function TemporaryPage() {
  const [inputId, setInputId] = useState<string>('');
  const [result, setResult] = useState<string>('');
  return (
    <>
      <section>
        <h1>Buttons</h1>
        <button
          onClick={async () => {
            const confirmDate = new Date();
            confirmDate.setDate(confirmDate.getDate() + 7);
            const meet = await createMeet({
              name: 'test',
              description: 'test',
              meetType: MeetType.DATES,
              datesOrDays: ['2022-10-10'],
              startTime: 0,
              endTime: 47,
              confirmTime: confirmDate,
            });
            setResult(JSON.stringify(meet));
          }}
        >
          Create Test Meet
        </button>
        <div>
          <label>MeetId: </label>
          <input
            id="meetId"
            value={inputId}
            onChange={event => {
              setInputId(event.target.value);
            }}
            className="text-black"
          />
        </div>
        <button
          onClick={async () => {
            await deleteMeet(inputId);
            setResult('delete success.');
          }}
        >
          Delete Meet
        </button>
        <button
          onClick={async () => {
            await updateMeet(inputId, {
              description: 'updated!',
            });
            setResult('update success.');
          }}
        >
          Update Meet
        </button>
      </section>

      <section>
        <h1>Result</h1>
        {result ? JSON.stringify(result) : null}
      </section>
    </>
  );
}
