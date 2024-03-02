'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import Button from '../button/button';
import TimeColumn from '@/components/timeTable/time-column';
import { useParams } from 'next/navigation';
import { updateTimeTable } from '@/controllers/meet';
import { transformedParticipantsType } from '@/app/(main)/meet/[meetId]/page';

interface TimeTable {
  current: {
    [key: string]: number[];
  };
}

type TimeTableProps = {
  startTime: number;
  endTime: number;
  datesOrDays: string[];
  type: 'DAYS' | 'DATES';
  participants: transformedParticipantsType;
  participantsNum: number;
};

export default function TimeTable({
  startTime,
  endTime,
  datesOrDays,
  type,
  participants,
  participantsNum,
}: TimeTableProps) {
  const timeList = Array.from(
    { length: endTime - startTime + 1 },
    (_, index) => startTime + index
  );
  const [hoverData, setHoverData] = useState<string[]>([]);

  type gridColumnsType = {
    [key: number]: string;
  };

  const gridSetList: gridColumnsType = {
    1: `grid grid-cols-table1 w-3/4`,
    2: `grid grid-cols-table2 w-3/4`,
    3: `grid grid-cols-table3 w-3/4`,
    4: `grid grid-cols-table4 w-3/4`,
    5: `grid grid-cols-table5 w-3/4`,
    6: `grid grid-cols-table6 w-3/4`,
    7: `grid grid-cols-table7 w-3/4`,
  };

  return (
    <div className="flex flex-col justify-center items-center text-xs mt-16 mb-16">
      <div className={gridSetList[datesOrDays.length % 7]}>
        <div className="flex flex-col items-end">
          <div className="min-h-[30px] mr-2 -mt-2">
            <p>week</p>
          </div>
          {timeList.map((time: number, index: number) => {
            const tempHour = Math.floor(time / 2);
            return (
              <div key={index} className="min-h-[20px] mr-2">
                {time % 2 === 0 ? (
                  <p className="text-xs">{`${tempHour}:00`}</p>
                ) : (
                  (index == endTime - startTime || index == 0) && (
                    <p className="text-xs">{`${tempHour}:30`}</p>
                  )
                )}
              </div>
            );
          })}
        </div>

        {datesOrDays.map((date: string, i: number) => (
          <TimeColumn
            key={date}
            date={date}
            startTime={startTime}
            endTime={endTime}
            type={type}
            dateParticipants={participants[date]}
            colIdx={datesOrDays.indexOf(date)}
            setHoverData={(data: string[]) => setHoverData(data)}
          />
        ))}
      </div>
      <div className="bg-cardColor w-3/5 rounded-lg p-6 mt-8 text-[16px] flex flex-col gap-4">
        <p>
          응답자: {hoverData.length}/{participantsNum}
        </p>
        {hoverData.map(data => (
          <p>{data}</p>
        ))}
      </div>
    </div>
  );
}
