// app/page.tsx

import { ProjectInterface } from "@/common.types";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects } from "@/lib/actions";

type ProjectSearch = {
    projectSearch: {
        edges: { node: ProjectInterface } [];
        pageInfo: {
            hasPreviousPage: boolean;
            hasNextPage: boolean;
            startCursor: string;
            endCursor: string;
        }
    }
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
  
    const projectsToDisplay = data?.projectSearch?.edges || [];
  
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
          {projectsToDisplay.map(({ node }: { node: ProjectInterface }) => (
            <ProjectCard 
              key={node?.id}
              id={node?.id}
              image={node?.image}
              title={node?.title}
              name={node?.user.name}
              avatarUrl={node?.user.avatarUrl}
              userId={node?.user.id}  
            />
          ))}
        </section>
  
        <LoadMore 
          startCursor={data?.projectSearch?.pageInfo?.startCursor} 
          endCursor={data?.projectSearch?.pageInfo?.endCursor} 
          hasPreviousPage={data?.projectSearch?.pageInfo?.hasPreviousPage} 
          hasNextPage={data?.projectSearch?.pageInfo.hasNextPage}
        />
      </section>
    )
  }
  
  export default Home;