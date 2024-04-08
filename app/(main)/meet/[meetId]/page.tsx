import { Prisma } from '@prisma/client';
import type CombinedTimeTable from '@/types/CombinedTimeTable';
import TimeTableComponent from './_component/timetable';
import {
  getMeet,
  getMeetWithParticipants,
  getMyParticipatingMeets,
} from '@/controllers/meet';
import { redirect } from 'next/navigation';
import EditMeetButton from '../_component/EditMeetButton';
import MeetDescription from '../_component/MeetDescription';
import ShareLinkButton from '../_component/ShareLinkButton';
import { getCurrentUser } from '@/lib/authentication';

export default async function MeetPage({
  params,
}: {
  params: { meetId: string };
}) {
  // first check if this meetId exists
  if (!(await getMeet(params.meetId))) throw new Error('meet not found');

  // check if I'm participating in this meet
  const myParticipatingMeets = await getMyParticipatingMeets();
  if (!myParticipatingMeets.some(meet => meet.id === params.meetId)) {
    redirect(`/meet/${params.meetId}/participate`);
  }

  const meet = await getMeetWithParticipants(params.meetId);
  const currentUser = await getCurrentUser();

  // combine all participants' TimeTables
  const combinedTimeTable: CombinedTimeTable = {};
  for (const key of meet.datesOrDays) {
    combinedTimeTable[key] = {};
  }
  for (const participant of meet.participants) {
    const userId = participant.userId ?? participant.userName as string; // TODO: make function for getting userId or userName for temporary user
    const currentTimeTable = participant.timeTable as Prisma.JsonObject;
    for (const key in currentTimeTable) {
      combinedTimeTable[key][userId] = currentTimeTable[key] as number[];
    }
  }

  return (
    <>
      <div className="flex items-center w-full">
        <p className="text-xl mt-3 grow">{meet.name}</p>
        <ShareLinkButton meetId={params.meetId} />
        <EditMeetButton meetId={params.meetId} />
      </div>
      <MeetDescription description={meet.description} />
      <TimeTableComponent
        startTime={meet.startTime}
        endTime={meet.endTime}
        datesOrDays={meet.datesOrDays}
        type={meet.meetMode}
        timetable={combinedTimeTable}
        participantsNum={meet.participants.length}
        isManager={currentUser.id === meet.managerId}
        confirmedTimeTable={meet.confirmedTimeTable || {}}
        meetId={params.meetId}
      />
    </>
  );
}
