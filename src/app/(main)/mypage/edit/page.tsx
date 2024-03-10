import { getCurrentUser } from '@/lib/authentication';
import EditProfileForm from './EditProfileForm';

export default async function EditProfilePage() {
  const currentUser = await getCurrentUser();
  return (
    <EditProfileForm
      currentName={currentUser.name}
      currentImage={currentUser.image}
    />
  );
}
