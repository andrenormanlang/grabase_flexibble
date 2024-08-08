import { redirect } from "next/navigation";

import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { getCurrentUser } from "@/lib/session";
import { getProjectDetails } from "@/lib/actions";
import { ProjectInterface } from "@/common.types";

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/");
    return null;
  }

  const result = await getProjectDetails(id) as { projects_by_pk?: ProjectInterface };

  const projectDetails = result?.projects_by_pk;

  if (!projectDetails) {
    return (
      <p className="no-result-text">Failed to fetch project info</p>
    );
  }


  return (
    <Modal>
      <h3 className="modal-head-text">Edit Project</h3>
      <ProjectForm type="edit" session={session} project={projectDetails} />
    </Modal>
  );
};

export default EditProject;
