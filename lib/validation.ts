import { MeetMode } from '@prisma/client';

function validateString(str?: string): str is string {
  if (!str || str.length === 0) {
    return false;
  }
  return true;
}

function validateMeetMode(str?: string): str is MeetMode {
  if (!str || !Object.values(MeetMode).includes(str as MeetMode)) {
    return false;
  }
  return true;
}

export { validateString, validateMeetMode };
