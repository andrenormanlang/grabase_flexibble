import { ProjectForm } from "@/common.types";
import { categoryFilters } from "@/constants";
import { createProjectMutation, createUserMutation, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery, updateProjectMutation } from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = process.env.NEXT_PUBLIC_HASURA_API_URL!;
const adminSecret = process.env.HASURA_ADMIN_SECRET!;
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

const client = new GraphQLClient(apiUrl, {
  headers: {
    "x-hasura-admin-secret": adminSecret,
  },
});

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (error) {
    throw error;
  }
};

export const getUser = (email: string) => {
  return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  };

  return makeGraphQLRequest(createUserMutation, variables);
};

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({
        path: imagePath,
      }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
  const imageUrl = await uploadImage(form.image);

  if (imageUrl.url) {
    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          id: creatorId,
        },
      },
    };

    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

export const fetchAllProjects = async (category?: string | null, endcursor?: number | null) => {
  const categories = category == null ? categoryFilters : [category];
  const variables = { categories, endcursor };
  return makeGraphQLRequest(projectsQuery, variables);
};

export const getProjectDetails = (id: string) => {
  return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = (id: string, last?: number) => {
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

export const deleteProject = (id: string, token: string) => {
  return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
  function isBase64DataURL(value: string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  let updatedForm = { ...form };

  const isUploadingNewImage = isBase64DataURL(form.image);

  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.image);

    if (imageUrl.url) {
      updatedForm = { ...updatedForm, image: imageUrl.url };
    }
  }

  const variables = {
    id: projectId,
    input: updatedForm,
  };

  return makeGraphQLRequest(updateProjectMutation, variables);
};
