import { getUserProjects } from '@/lib/actions';
import ProfilePage from '@/components/ProfilePage';


type Props = {
  params: {
    id: string;
  };
};

import { User, Session } from 'next-auth';

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
  projects: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

const UserProfile = async ({ params }: Props) => {
  const result = await getUserProjects(params.id, 100) as { user: UserProfile };

  if (!result?.user) return (
    <p className="no-result-text">Failed to fetch user info</p>
  );

  return <ProfilePage user={result?.user} />;
};

export default UserProfile;
