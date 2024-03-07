'use server';

import { Prisma } from '@prisma/client';
import type { Meet, MeetType } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/authentication';

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
  meetType: MeetType;
  startTime: number; // 0-47
  endTime: number; // 0-47
  datesOrDays: string[];
  confirmTime: Date | string;
  password?: string;
};

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
            hasAccepted: true, // should be true for manager by default
          },
        },
      },
    });
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMeet(meetId: string): Promise<Meet> {
  try {
    const currentUser = await getCurrentUser();
    const meet = await prisma.meet.findUniqueOrThrow({
      where: {
        id: meetId,
        managerId: currentUser.id,
      },
    });
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const meetWithParticipants = Prisma.validator<Prisma.MeetDefaultArgs>()({
  include: { participants: true },
});

export type MeetWithParticipants = Prisma.MeetGetPayload<
  typeof meetWithParticipants
>;

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
      // are you the manager or one of the participants of this meet?
      //   meet.managerId !== currentUser.id ||  meet participants에 manager가 포함되어있으므로 확인 x
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
  meetType?: MeetType;
  startTime?: number; // 0-47
  endTime?: number; // 0-47
  datesOrDays?: string[];
  confirmTime?: Date;
  password?: string;
};

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

export async function deleteMeet(meetId: string): Promise<Meet> {
  const currentUser = await getCurrentUser();
  try {
    const meet = await prisma.meet.delete({
      where: {
        id: meetId,
        managerId: currentUser.id, // only authorized for manager
      },
    });
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// add users to a specific meet
export async function addParticipantsToMeet(
  meetId: string,
  userIds: string[]
): Promise<Meet> {
  try {
    const currentUser = await getCurrentUser();
    const meet = await prisma.meet.update({
      where: {
        id: meetId,
        managerId: currentUser.id, // only authorized for manager
      },
      data: {
        participants: {
          create: userIds.map(userId => ({
            userId,
          })),
        },
      },
    });
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
  // // Create an array of ParticipantsOnMeets objects
  // const participants = userIds.map(userId => ({
  //   meetId,
  //   userId,
  // }));

  // // Use the createMany method on the ParticipantsOnMeets model to add all participants at once
  // await prisma.participantsOnMeets.createMany({
  //   data: participants,
  //   skipDuplicates: true, // This ensures users are not added twice
  // });
}

export async function acceptMeetInvitation(meetId: string) {
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
        hasAccepted: true,
      },
    });
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type TimeTable = {
  [key: string]: number[];
};

export async function getTimeTable(meetId: string) {
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
    return meet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

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
