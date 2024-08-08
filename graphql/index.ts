export const createProjectMutation = `
  mutation CreateProject($input: projects_insert_input!) {
  insert_projects_one(object: $input) {
    id
    title
    description
    image
    liveSiteUrl
    githubUrl
    category
    user {
      id
      name
      email
      avatarUrl
    }
  }
}
`;

export const updateProjectMutation = `
  mutation UpdateProject($id: uuid!, $input: projects_set_input!) {
    update_projects_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
      title
      description
      user {
        email
        name
      }
    }
  }
`;

export const deleteProjectMutation = `
  mutation DeleteProject($id: uuid!) {
    delete_projects_by_pk(id: $id) {
      id
    }
  }
`;

export const createUserMutation = `
  mutation CreateUser($input: users_insert_input!) {
    insert_users_one(object: $input) {
      id
      name
      email
      avatarUrl
      description
      githubUrl
      linkedinUrl
    }
  }
`;

export const projectsQuery = `
 query getProjects($categories: [String!], $endcursor: Int) {
  projects(where: {category: {_in: $categories}}, limit: 16, offset: $endcursor) {
    id
    title
    description
    image
    liveSiteUrl
    githubUrl
    category
    user {
      id
      name
      avatarUrl
    }
  }
}



`;


export const getProjectByIdQuery = `
  query GetProjectById($id: uuid!) {
    projects_by_pk(id: $id) {
      id
      title
      description
      image
      liveSiteUrl
      githubUrl
      category
      user {
        id
        name
        email
        avatarUrl
      }
    }
  }
`;

export const getUserQuery = `
  query GetUser($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      name
      email
      avatarUrl
      description
      githubUrl
      linkedinUrl
    }
  }
`;

export const getProjectsOfUserQuery = `
  query getUserProjects($id: uuid!, $last: Int = 4) {
    users_by_pk(id: $id) {
      id
      name
      email
      description
      avatarUrl
      githubUrl
      linkedinUrl
      projects(limit: $last) {
        id
        title
        image
      }
    }
  }
`;