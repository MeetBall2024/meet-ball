'use server';

import type { Meet, MeetMode } from '@prisma/client';
import type MeetWithParticipants from '@/types/MeetWithParticipants';
import type TimeTable from '@/types/TimeTable';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/authentication';
import { revalidatePath, revalidateTag } from 'next/cache';

// get current user's managing meets
export async function getMyManagingMeets(): Promise<Meet[]> {
  try {
    const currentUser = await getCurrentUser();
    const meets = await prisma.meet.findMany({
      where: {
        managerId: currentUser.id,
      },
    });
    return meets;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// get current user's participating meets
export async function getMyParticipatingMeets(): Promise<Meet[]> {
  try {
    const currentUser = await getCurrentUser();
    const meets = (
      await prisma.user.findUniqueOrThrow({
        where: {
          id: currentUser.id,
        },
        include: {
          participatingMeets: {
            include: {
              meet: true,
            },
          },
        },
      })
    ).participatingMeets.map(participatingMeet => participatingMeet.meet);
    return meets;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type CreateMeetParams = {
  name: string;
  description?: string;
  meetMode: MeetMode;
  startTime: number; // 0-47
  endTime: number; // 0-47
  datesOrDays: string[];
  confirmTime: Date | string;
  password?: string;
};

// create meet managed by current user
export async function createMeet(params: CreateMeetParams): Promise<Meet> {
  try {
    const currentUser = await getCurrentUser();

    const meet = await prisma.meet.create({
      data: {
        managerId: currentUser.id,
        ...params,
        participants: {
          create: {
            userId: currentUser.id, // should involve itself as participant at first
          },
        },
      },
    });
    revalidatePath('/');
    revalidatePath('/mypage');
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// get meet without checking authorization (exclude participants)
export async function getMeet(meetId: string): Promise<Meet> {
  try {
    const meet = await prisma.meet.findUniqueOrThrow({
      where: {
        id: meetId,
      },
    });
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// get meet with participants, only if you are participating in that meet
export async function getMeetWithParticipants(
  meetId: string
): Promise<MeetWithParticipants> {
  try {
    const currentUser = await getCurrentUser();
    const meet = await prisma.meet.findUniqueOrThrow({
      where: {
        id: meetId,
      },
      include: {
        participants: true,
      },
    });
    if (
      meet.participants.some(
        participant => participant.userId === currentUser.id
      )
    ) {
      return meet;
    } else {
      throw Error('not authorized');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type UpdateMeetParams = {
  name?: string;
  description?: string;
  meetMode?: MeetMode;
  startTime?: number; // 0-47
  endTime?: number; // 0-47
  datesOrDays?: string[];
  confirmTime?: Date;
  password?: string;
};

// only authorized for manager
export async function updateMeet(
  meetId: string,
  params: UpdateMeetParams
): Promise<Meet> {
  try {
    const currentUser = await getCurrentUser();

    const meet = await prisma.meet.update({
      where: {
        id: meetId,
        managerId: currentUser.id, // only authorized for manager
      },
      data: {
        ...params,
      },
    });
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteMeet(
  meetId: string,
  pathName: string
): Promise<Meet> {
  const currentUser = await getCurrentUser();
  try {
    const meet = await prisma.meet.delete({
      where: {
        id: meetId,
        managerId: currentUser.id, // only authorized for manager
      },
    });
    revalidatePath(pathName);
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// add myself to the meet with checking password
export async function participateMeet(
  meetId: string,
  password: string | null
): Promise<void> {
  const meet = await getMeet(meetId);
  if (meet.password !== password) throw new Error('Wrong password');

  const currentUser = await getCurrentUser();
  try {
    await prisma.participantsOnMeets.create({
      data: {
        meetId,
        userId: currentUser.id,
        hasAccepted: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// // add participants to the meet, allowed only by manager
// export async function addParticipantsToMeet(
//   meetId: string,
//   userIds: string[]
// ): Promise<void> {
//   try {
//     const currentUser = await getCurrentUser();
//     const meet = await getMeet(meetId);
//     if (meet.managerId !== currentUser.id)
//       throw new Error('Only manager can add participants.');

//     // Create an array of ParticipantsOnMeets objects
//     const participants = userIds.map(userId => ({
//       meetId,
//       userId,
//     }));

//     // Use the createMany method on the ParticipantsOnMeets model to add all participants at once
//     await prisma.participantsOnMeets.createMany({
//       data: participants,
//       skipDuplicates: true, // This ensures users are not added twice
//     });
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// export async function acceptMeetInvitation(meetId: string) {
//   try {
//     const currentUser = await getCurrentUser();
//     const meet = await prisma.participantsOnMeets.update({
//       where: {
//         meetId_userId: {
//           meetId: meetId,
//           userId: currentUser.id,
//         },
//       },
//       data: {
//         hasAccepted: true,
//       },
//     });
//     return meet;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// get current user's time table of the meet
export async function getMyTimeTable(
  meetId: string
): Promise<TimeTable | null> {
  try {
    const currentUser = await getCurrentUser();
    const meet = await prisma.participantsOnMeets.findUniqueOrThrow({
      where: {
        meetId_userId: {
          meetId: meetId,
          userId: currentUser.id,
        },
      },
    });
    if (!meet.timeTable) return null;
    return meet.timeTable as TimeTable;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// update current user's time table of the meet
export async function updateTimeTable(meetId: string, timeTable: TimeTable) {
  try {
    const currentUser = await getCurrentUser();
    const meet = await prisma.participantsOnMeets.update({
      where: {
        meetId_userId: {
          meetId: meetId,
          userId: currentUser.id,
        },
      },
      data: {
        timeTable,
      },
    });
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateConfirmedTimeTable(
  meetId: string,
  confirmedTimeTable: TimeTable
) {
  try {
    const currentUser = await getCurrentUser();
    // const meet = await prisma.meet.findUniqueOrThrow({
    //   where: {
    //     id: meetId,
    //     managerId: currentUser.id,
    //   },
    //   include: {
    //     participants: true,
    //   },
    // });

    // // 1. count all participants' timetable per time slot
    // const count = {} as { [key: string]: number[] };
    // for (const key of meet.datesOrDays) {
    //   count[key] = Array.from({ length: 49 }, () => 0);
    // }
    // for (const participant of meet.participants) {
    //   const currentTimeTable = (participant.timeTable ?? {}) as TimeTable;
    //   for (const key of meet.datesOrDays) {
    //     if (!currentTimeTable.hasOwnProperty(key)) continue;
    //     for (const time of currentTimeTable[key]) {
    //       count[key][time] += 1;
    //     }
    //   }
    // }

    // // 2. find all available time slots
    // const confirmedTimeTable = {} as TimeTable;
    // for (const key of meet.datesOrDays) {
    //   confirmedTimeTable[key] = [];
    //   for (let i = 0; i < 49; i++) {
    //     if (count[key][i] === meet.participants.length) {
    //       confirmedTimeTable[key].push(i);
    //     }
    //   }
    // }

    // update meet with confirmed time table
    await prisma.meet.update({
      where: { id: meetId, managerId: currentUser.id },
      data: {
        confirmedTimeTable,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
