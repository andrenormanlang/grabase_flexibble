import Link from 'next/link';
import { getUserProjects } from '@/lib/actions';
import { ProjectInterface, UserProfile } from '@/common.types';
import Image from 'next/image';

type Props = {
  userId: string;
  projectId: string;
};

const RelatedProjects = async ({ userId, projectId }: Props) => {
  const result = await getUserProjects(userId) as { user?: UserProfile };

  const filteredProjects = result?.user?.projects
    ?.filter((project: ProjectInterface) => project?.id !== projectId);

  console.log(filteredProjects);

  if (filteredProjects?.length === 0) return null;

  return (
    <section className="flex flex-col mt-32 w-full">
      <div className="flexBetween">
        <p className="text-base font-bold">
          More by {result?.user?.name}
        </p>
        <Link
          href={`/profile/${result?.user?.id}`}
          className="text-primary-purple text-base"
        >
          View All
        </Link>
      </div>

      <div className="related_projects-grid">
        {filteredProjects?.map((project: ProjectInterface) => (
          <div key={project?.id} className="flexCenter related_project-card drop-shadow-card">
            <Link href={`/project/${project?.id}`} className="flexCenter group relative w-full h-full">
              <Image src={project?.image} width={414} height={314} className="w-full h-full object-cover rounded-2xl" alt="project image" />

              <div className="hidden group-hover:flex related_project-card_title">
                <p className="w-full">{project?.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProjects;
