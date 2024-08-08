// app/page.tsx

import { ProjectInterface } from "@/common.types";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects } from "@/lib/actions";

type ProjectSearch = {
  projects: ProjectInterface[];
}

type SearchParams = {
  category?: string;
  endcursor?: string; // Ensure this matches the query parameter name exactly
}

type Props = {
  searchParams: SearchParams
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const Home = async ({ searchParams: { category, endcursor } }: Props) => {
  const endCursorNumber = endcursor ? parseInt(endcursor, 10) : null;
  const data = await fetchAllProjects(category, endCursorNumber) as ProjectSearch;
  

  const projectsToDisplay = data?.projects || [];


  if (projectsToDisplay.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />

        <p className="no-result-text text-center">No projects found, go create some first.</p>
      </section>
    )
  }

  return (
    <section className="flexStart flex-col paddings mb-16">
      <Categories />

      <section className="projects-grid">
        {projectsToDisplay.map((project: ProjectInterface) => (
          <ProjectCard 
            key={project.id}
            id={project.id}
            image={project.image}
            title={project.title}
            name={project.user.name}
            avatarUrl={project.user.avatarUrl}
            userId={project.user.id}  
          />
        ))}
      </section>

      <LoadMore 
        startCursor={null} 
        endCursor={endcursor ? endcursor.toString() : null} 
        hasPreviousPage={false} 
        hasNextPage={true}
      />
    </section>
  )
}

export default Home;

