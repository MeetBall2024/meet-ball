import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import type { Meet } from '@prisma/client';
import { getMyInfo } from '@/controllers/user';
import {
  getMyManagingMeets,
  getMyParticipatingMeets,
} from '@/controllers/meet';
import MyMeetCard from './MyMeetCard';
import PanelLayout from './PanelLayout';

function ProfileIcon({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt="profile icon"
      width={100}
      height={100}
      className="rounded-full"
    />
  );
}

function UserName({ name }: { name: string }) {
  return <div className="text-3xl">{name}</div>;
}

function EditProfileButton() {
  return (
    <Link href="/mypage/edit" prefetch={false}>
      <button className="cursor-pointer pr-10 pl-10 pt-2 pb-2 m-4 rounded-lg bg-pointColor text-black flex justify-center active:bg-[#05957B] active:text-white">
        프로필 편집
      </button>
    </Link>
  );
}

function LogoutButton() {
  return (
    <a href="/api/auth/signout">
      <button className="cursor-pointer pr-10 pl-10 pt-2 pb-2 m-4 rounded-lg bg-red-600 text-white flex justify-center">
        로그아웃
      </button>
    </a>
  );
}

function ManagingMeetsPanel({ managingMeets }: { managingMeets: Meet[] }) {
  return (
    <div className="space-y-4">
      {managingMeets.map(meet => (
        <MyMeetCard
          key={meet.id}
          meetId={meet.id}
          meetName={meet.name}
          description={meet.description}
          startTime={meet.startTime}
          endTime={meet.endTime}
          participants={['업데이트 필요']}
        />
      ))}
    </div>
  );
}

function ParticipatingMeetsPanel({
  participatingMeets,
}: {
  participatingMeets: Meet[];
}) {
  return (
    <div className="space-y-4">
      {participatingMeets.map(meet => (
        <MyMeetCard
          key={meet.id}
          meetId={meet.id}
          meetName={meet.name}
          description={meet.description}
          startTime={meet.startTime}
          endTime={meet.endTime}
          participants={['업데이트 필요']}
        />
      ))}
    </div>
  );
}

export default async function MyPage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  const myInfo = await getMyInfo();
  const myManagingMeets = await getMyManagingMeets();
  const myParticipatingMeets = await getMyParticipatingMeets();
  return (
    <div className="flex flex-col items-center justify-center">
      <ProfileIcon src={myInfo.image ?? ''} />
      <UserName name={myInfo.name ?? ''} />
      <EditProfileButton />
      <PanelLayout
        titles={['생성한 미트볼', '참여중인 미트볼']}
        panels={[
          <ManagingMeetsPanel key={0} managingMeets={myManagingMeets} />,
          <ParticipatingMeetsPanel
            key={1}
            participatingMeets={myParticipatingMeets}
          />,
        ]}
      />
      <LogoutButton />
    </div>
  );
}
