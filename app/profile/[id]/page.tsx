import { getUserProjects } from '@/lib/actions';
import ProfilePage from '@/components/ProfilePage';

type Props = {
  params: {
    id: string;
  };
};

type ProjectInterface = {
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

type UserProfile = {
  id: string;
  name: string;
  email: string;
  description: string | null;
  avatarUrl: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  projects: ProjectInterface[];
}

const UserProfile = async ({ params }: Props) => {
  console.log("UserProfile component - params:", params);

  const result = await getUserProjects(params.id, 100) as { users_by_pk?: UserProfile };

  console.log("UserProfile component - fetched user projects:", result);

  if (!result?.users_by_pk) {
    console.error("UserProfile component - Error: Failed to fetch user info");
    return (
      <p className="no-result-text">Failed to fetch user info</p>
    );
  }

  return <ProfilePage user={result.users_by_pk} />;
};

export default UserProfile;
