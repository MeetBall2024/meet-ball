'use server';

import { Meet, MeetMode } from '@prisma/client';
import { createMeet } from '@/controllers/meet';
import { validateMeetMode, validateString } from '@/lib/validation';

export default async function createMeetFromInput(
  formData: FormData
): Promise<Meet> {
  const meetName = formData.get('meetName')?.toString();
  if (!validateString(meetName)) throw new Error('이름을 입력하세요.');

  const meetDescription = formData.get('meetDescription')?.toString();

  const meetMode = formData.get('meetMode')?.toString() as MeetMode;
  if (!validateMeetMode(meetMode)) throw new Error();

  const confirmDate = new Date(formData.get('confirmDate')!.toString());
  confirmDate.setHours(parseInt(formData.get('confirmHour')!.toString()));
  confirmDate.setMinutes(parseInt(formData.get('confirmMinute')!.toString()));

  let startTime = parseInt(formData.get('meetStartHour')!.toString()) * 2;
  if (formData.get('meetStartMinute')!.toString() === '30') startTime += 1;

  let endTime = parseInt(formData.get('meetEndHour')!.toString()) * 2;
  if (formData.get('meetEndMinute')!.toString() === '30') endTime += 1;

  if (startTime >= endTime) throw new Error('회의 시간을 확인하세요.');

  const meetSelections = formData.get('meetSelections')?.toString().split(',');
  if (!meetSelections || meetSelections.length === 0)
    throw new Error('날짜를 선택해주세요.');

  const meetPassword = formData.get('meetPassword')?.toString();

  try {
    return await createMeet({
      name: meetName,
      description: meetDescription,
      meetMode: meetMode,
      startTime,
      endTime,
      datesOrDays: meetSelections,
      confirmTime: confirmDate,
      password: meetPassword,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
