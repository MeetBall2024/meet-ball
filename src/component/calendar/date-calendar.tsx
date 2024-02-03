'use client';
import * as React from 'react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { LeftIcon, RightIcon } from '../icon';
import CalenderBody from './calendar-body';

const DateCalender = () => {
  const currentDay = dayjs();
  const [selectedDay, setSelectedDay] = useState<string>(
    currentDay.format('YYYY-MM-DD')
  );

  const handleSelectDate = (day: string) => {
    setSelectedDay(day);
  };

  useEffect(() => {
    console.log(selectedDay);
  }, [selectedDay]);

  const handlePrevMonth = () => {
    const newDate = dayjs(selectedDay)
      .subtract(1, 'month')
      .endOf('month')
      .format('YYYY-MM-DD');
    setSelectedDay(newDate);
  };

  const handleNextMonth = () => {
    const newDate = dayjs(selectedDay)
      .add(1, 'month')
      .startOf('month')
      .format('YYYY-MM-DD');
    setSelectedDay(newDate);
  };

  return (
    <div className="">
      <div className="">
        <span>{dayjs(selectedDay).format('YYYY년 MM월')}</span>
        <div className="flex justify-evenly">
          <LeftIcon onClick={handlePrevMonth} />
          <RightIcon onClick={handleNextMonth} />
        </div>
      </div>
      <CalenderBody
        selectedDay={selectedDay}
        handleSelectDate={handleSelectDate}
      />
    </div>
  );
};

export default DateCalender;
