'use client';
import TimeTable from '@/types/TimeTable';
import { useRef, useState } from 'react';

type dateParticipantsType = {
  [name: string]: Array<number>;
};

type timeOpacityType = {
  [name: string]: string[];
};

type timeCellProps = {
  timeIndex: number;
  opacity: number;
  previousOpacity: number;
  nextOpacity: number;
  endTime: number;
  setHoverData: (data: string[]) => void;
  participants: string[];
  isManager: boolean;
  selected: boolean;
  addHandler: () => void;
  deleteHandler: () => void;
  editMode: boolean;
};

function TimeTableCell({
  timeIndex,
  opacity,
  previousOpacity,
  nextOpacity,
  setHoverData,
  participants,
  isManager,
  selected,
  addHandler,
  deleteHandler,
  editMode,
}: timeCellProps) {
  const [clicked, setClicked] = useState(selected);
  const clickHandler = () => {
    if (clicked) {
      setClicked(false);
      deleteHandler();
    } else {
      setClicked(true);
      addHandler();
    }
  };

  return (
    <div
      style={{
        backgroundColor: `rgba(32, 236, 199, ${opacity})`,
      }}
      onMouseOver={() => {
        setHoverData(participants);
      }}
      className={`relative h-[20px] cursor-pointer border-white ${timeIndex % 2 === 0 ? 'border-t-[0.3px]' : ''}
      ${previousOpacity === 0 && !isNaN(opacity) && opacity != 0 ? 'rounded-t-lg' : ''} ${nextOpacity === 0 && !isNaN(opacity) && opacity !== 0 ? 'rounded-b-lg' : ''} 
      ${clicked && 'after:bg-gray-400 after:bg-opacity-80 after:z-50 after:absolute after:inset-0 after:mx-2'} `}
      onClick={editMode ? clickHandler : undefined}
    ></div>
  );
}

export default function TimeTableColumn({
  date,
  startTime,
  endTime,
  type,
  dateTimetable,
  colIdx,
  setHoverData,
  isManager,
  confirmedTimeTable,
  editMode,
  handleMouseMove,
}: {
  date: string;
  startTime: number;
  endTime: number;
  type: 'DAYS' | 'DATES';
  dateTimetable: dateParticipantsType;
  colIdx: number;
  setHoverData: (data: string[]) => void;
  isManager: boolean;
  confirmedTimeTable: {
    current: TimeTable;
  };
  editMode: boolean;
  handleMouseMove: (e: React.MouseEvent) => void;
}) {
  const label = useRef('');
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  if (type == 'DATES') {
    const newdate = new Date(date);
    label.current =
      newdate.getMonth() +
      1 +
      '/' +
      newdate.getDate() +
      ' ' +
      days[newdate.getDay()];
  } else {
    label.current = date;
  }

  const scheduleOpacityOfTimeObject: timeOpacityType = {};
  for (let i: number = startTime; i < endTime; i++) {
    let participant: string[] = [];
    for (const key in dateTimetable) {
      if (dateTimetable[key].includes(i)) {
        participant = [...participant, key];
      }
    }
    scheduleOpacityOfTimeObject[String(i)] = participant;
  }

  return (
    <div onMouseMove={e => handleMouseMove(e)}>
      <p className="flex justify-center whitespace-pre-wrap h-[30px]">
        {label.current}
      </p>
      {Object.keys(scheduleOpacityOfTimeObject).map(
        (timeIndex: string, index: number) => {
          let previousOpacity = 0;
          let nextOpacity = 0;
          const opacity = scheduleOpacityOfTimeObject[timeIndex].length;

          if (
            parseInt(timeIndex) !== startTime &&
            parseInt(timeIndex) !== endTime - 1
          ) {
            previousOpacity =
              scheduleOpacityOfTimeObject[String(parseInt(timeIndex) - 1)]
                .length;
            nextOpacity =
              scheduleOpacityOfTimeObject[String(parseInt(timeIndex) + 1)]
                .length;
          } else if (parseInt(timeIndex) === startTime) {
            nextOpacity =
              scheduleOpacityOfTimeObject[String(parseInt(timeIndex) + 1)]
                .length;
            previousOpacity = 0;
          } else if (parseInt(timeIndex) === endTime - 1) {
            previousOpacity =
              scheduleOpacityOfTimeObject[String(parseInt(timeIndex) - 1)]
                .length;
            nextOpacity = 0;
          }
          const timeIndexInt = parseInt(timeIndex);

          return (
            <TimeTableCell
              key={index}
              timeIndex={timeIndexInt}
              opacity={
                +(opacity / Object.keys(dateTimetable).length).toFixed(2)
              }
              previousOpacity={previousOpacity}
              nextOpacity={nextOpacity}
              endTime={endTime}
              setHoverData={(data: string[]) => setHoverData(data)}
              participants={scheduleOpacityOfTimeObject[timeIndexInt]}
              isManager={isManager}
              selected={
                confirmedTimeTable.current[date] != null
                  ? confirmedTimeTable.current[date].includes(timeIndexInt)
                  : false
              }
              addHandler={() =>
                confirmedTimeTable.current[date]
                  ? confirmedTimeTable.current[date].push(timeIndexInt)
                  : (confirmedTimeTable.current[date] = [timeIndexInt])
              }
              deleteHandler={() =>
                confirmedTimeTable.current[date] &&
                confirmedTimeTable.current[date].splice(
                  confirmedTimeTable.current[date].indexOf(timeIndexInt),
                  1
                )
              }
              editMode={editMode}
            />
          );
        }
      )}
    </div>
  );
}
