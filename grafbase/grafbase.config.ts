import { auth, connector, graph, config } from '@grafbase/sdk'

const g = graph.Standalone()

const pg = connector.Postgres('Postgres', {
  url: g.env('DATABASE_URL'),
})

const User = g.type('User', {
  name: g.string(),
  email: g.string(),
  avatarUrl: g.url(),
  description: g.string().optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(),
  // Define the projects field
  projects: g.ref('Project').list().optional(),
})

// Define the Project model
const Project = g.type('Project', {
  title: g.string(),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),
  category: g.string(),
  createdBy: g.ref('User'),
})

// Define JWT authentication
const jwt = auth.JWT({
  issuer: 'grafbase',
  secret:  g.env('NEXTAUTH_SECRET')
})

g.datasource(pg)

export default config({
  graph: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private()
  },
})
