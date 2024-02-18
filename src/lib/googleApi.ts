import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';
import prisma from '@/lib/prisma';

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */

// // Access scopes for read-only Drive activity.
// const scopes = ['https://www.googleapis.com/auth/calendar'];

async function getOAuth2Client(userId: string): Promise<OAuth2Client> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    process.env.AUTH_URL + '/api/auth/callback/google'
  );
  const googleAccount = await prisma.account.findFirstOrThrow({
    where: { userId, provider: 'google' },
  });
  const tokens = {
    access_token: googleAccount.access_token,
    refresh_token: googleAccount.refresh_token,
  };
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

export async function getCalendarClient(userId: string) {
  const oauth2Client = await getOAuth2Client(userId);
  const calendar = google.calendar({
    version: 'v3',
    auth: oauth2Client,
  });
  return calendar;
}
