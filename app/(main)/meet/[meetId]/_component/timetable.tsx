'use client';
import { useRef, useState } from 'react';
import TimeTableColumn from './timetable-column';
import type CombinedTimeTable from '@/types/CombinedTimeTable';
import Button from '@/components/button/button';
import { Meet } from '@prisma/client';
import { updateConfirmedTimeTable } from '@/controllers/meet';
import Link from 'next/link';
import TimeTable from '@/types/TimeTable';
import ParticipantsPanel from './participants-panel';

type TimeTableComponentProps = {
  startTime: number;
  endTime: number;
  datesOrDays: string[];
  type: 'DAYS' | 'DATES';
  timetable: CombinedTimeTable;
  participantsNum: number;
  isManager: boolean;
  confirmedTimeTable: Meet['confirmedTimeTable'];
  meetId: string;
};

export default function TimeTableComponent({
  startTime,
  endTime,
  datesOrDays,
  type,
  timetable,
  participantsNum,
  isManager,
  confirmedTimeTable,
  meetId,
}: TimeTableComponentProps) {
  const confirmedTimeTableRef = useRef<TimeTable>(
    confirmedTimeTable as TimeTable
  );
  console.log(confirmedTimeTableRef.current);
  const timeList = Array.from(
    { length: endTime - startTime + 1 },
    (_, index) => startTime + index
  );
  const [hoverData, setHoverData] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [location, setLocation] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const handleMouseMove = (e: React.MouseEvent) => {
    setLocation({ x: e.clientX, y: e.clientY });
  };

  type gridColumnsType = {
    [key: number]: string;
  };

  const gridSetList: gridColumnsType = {
    1: `grid grid-cols-table1 w-full`,
    2: `grid grid-cols-table2 w-full`,
    3: `grid grid-cols-table3 w-full`,
    4: `grid grid-cols-table4 w-full`,
    5: `grid grid-cols-table5 w-full`,
    6: `grid grid-cols-table6 w-full`,
    7: `grid grid-cols-table7 w-full`,
  };

  return (
    <>
      <div className="flex flex-col items-end">
        {isManager && (
          <Button
            title={`${editMode ? '저장하기' : '스케줄 확정'}`}
            className="cursor-pointer bg-white mt-4 text-sm hover:bg-cardColor hover:text-white active:bg-cardColor active:text-white"
            onClick={async () => {
              await updateConfirmedTimeTable(
                meetId,
                confirmedTimeTableRef.current
              ).then(() => {
                setEditMode(!editMode);
              });
            }}
          />
        )}
        <Link href={`/meet/${meetId}/edit`}>
          <Button
            title="내 스케줄 편집"
            className="cursor-pointer px-8 bg-white mt-4 text-sm hover:bg-cardColor hover:text-white active:bg-cardColor active:text-white"
          />
        </Link>
      </div>
      <div className="flex mobile:flex-col justify-center items-start mobile:items-center text-xs mt-16 mb-16">
        <div className={gridSetList[datesOrDays.length % 7]}>
          <div className="flex flex-col items-end">
            <div className="min-h-[30px] mr-2 -mt-2">{/* <p>week</p> */}</div>
            {timeList.map((time: number) => (
              <div key={time} className="min-h-[20px] mr-2">
                {time % 2 === 0 ? (
                  <p className="text-xs">{`${Math.floor(time / 2)}:00`}</p>
                ) : time === startTime || time === endTime ? (
                  <p className="text-xs">{`${Math.floor(time / 2)}:30`}</p>
                ) : null}
              </div>
            ))}
          </div>
          {datesOrDays.map((date: string) => (
            <TimeTableColumn
              key={date}
              date={date}
              startTime={startTime}
              endTime={endTime}
              type={type}
              dateTimetable={timetable[date]}
              colIdx={datesOrDays.indexOf(date)}
              setHoverData={(data: string[]) => setHoverData(data)}
              isManager={isManager}
              confirmedTimeTable={confirmedTimeTableRef}
              editMode={editMode}
              handleMouseMove={handleMouseMove}
            />
          ))}
        </div>
        <ParticipantsPanel
          hoverData={hoverData}
          participantsNum={participantsNum}
          location={location}
        />
      </div>
    </>
  );
}
