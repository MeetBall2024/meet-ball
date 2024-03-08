'use server';

import type { User, AuthenticatedUser } from 'next-auth';
import { getCurrentUser } from '@/lib/authentication';
import prisma from '@/lib/prisma';

export async function getMyInfo(): Promise<AuthenticatedUser> {
  try {
    const currentUser = await getCurrentUser();
    return currentUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUsersByUserIds(
  userIds: string[]
): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserIdsByEmails(emails: string[]): Promise<string[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
    });
    return users.map(user => user.id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
