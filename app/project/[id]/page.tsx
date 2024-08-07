import Image from "next/image"
import Link from "next/link"

import { getCurrentUser } from "@/lib/session"
import { getProjectDetails } from "@/lib/actions"
import Modal from "@/components/Modal"
import RelatedProjects from "@/components/RelatedProjects"
import { ProjectInterface } from "@/common.types"
import ProjectActions from "@/components/ProjectActions"

const Project = async ({ params: { id } }: { params: { id: string } }) => {
    const session = await getCurrentUser();

    const result = await getProjectDetails(id) as { projects_by_pk?: ProjectInterface };

    const projectDetails = result?.projects_by_pk;

    if (!projectDetails) {
        console.error("Failed to fetch project info for project ID:", id);
        return (
            <p className="no-result-text">Failed to fetch project info</p>
        );
    }

    const renderLink = () => `/profile/${projectDetails?.user?.id}`;

    return (
        <Modal>
            <section className="flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full">
                <div className="flex-1 flex items-start gap-5 w-full max-xs:flex-col">
                    <Link href={renderLink()}>
                        <Image
                            src={projectDetails?.user?.avatarUrl}
                            width={50}
                            height={50}
                            alt="profile"
                            className="rounded-full"
                        />
                    </Link>

                    <div className="flex-1 flexStart flex-col gap-1">
                        <p className="self-start text-lg font-semibold">
                            {projectDetails?.title}
                        </p>
                        <div className="user-info">
                            <Link href={renderLink()}>
                                {projectDetails?.user?.name}
                            </Link>
                            <Image src="/dot.svg" width={4} height={4} alt="dot" />
                            <Link href={`/?category=${projectDetails.category}`} className="text-primary-purple font-semibold"> 
                                {projectDetails?.category}
                            </Link>
                        </div>
                    </div>
                </div>

                {session?.user?.email === projectDetails?.user?.email && (
                    <div className="flex justify-end items-center gap-2">
                        <ProjectActions projectId={projectDetails?.id} />
                    </div>
                )}
            </section>

            <section className="mt-14">
                <Image
                    src={`${projectDetails?.image}`}
                    className="object-cover rounded-2xl"
                    width={1064}
                    height={798}
                    alt="poster"
                />
            </section>

            <section className="flexCenter flex-col mt-20">
                <p className="max-w-5xl text-xl font-normal">
                    {projectDetails?.description}
                </p>

                <div className="flex flex-wrap mt-5 gap-5">
                    <Link href={projectDetails?.githubUrl} target="_blank" rel="noreferrer" className="flexCenter gap-2 tex-sm font-medium text-primary-purple">
                        🖥 <span className="underline">Github</span> 
                    </Link>
                    <Image src="/dot.svg" width={4} height={4} alt="dot" />
                    <Link href={projectDetails?.liveSiteUrl} target="_blank" rel="noreferrer" className="flexCenter gap-2 tex-sm font-medium text-primary-purple">
                        🚀 <span className="underline">Live Site</span> 
                    </Link>
                </div>
            </section>
      
            <section className="flexCenter w-full gap-8 mt-28">
                <span className="w-full h-0.5 bg-light-white-200" />
                <Link href={renderLink()} className="min-w-[82px] h-[82px]">
                    <Image
                        src={projectDetails?.user?.avatarUrl}
                        className="rounded-full"
                        width={82}
                        height={82}
                        alt="profile image"
                    />
                </Link>
                <span className="w-full h-0.5 bg-light-white-200" />
            </section>

            <RelatedProjects userId={projectDetails?.user?.id} projectId={projectDetails?.id} />
        </Modal>
    )
}

export default Project

