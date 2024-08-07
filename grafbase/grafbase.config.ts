// g is a schema generator, config the final object to return
import { auth, graph, config } from '@grafbase/sdk'

const g = graph.Standalone()

// Define the User model
const User = g.type('User', {
  name: g.string(),
  email: g.string(),
  avatarUrl: g.url(),
  description: g.string().optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(),
  // Define the projects field
  projects: g.ref('Project'),
})

// Define the Project model
const Project = g.type('Project', {
  title: g.string(),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),
  category: g.string(),
  user: g.ref('User'),
})

// Define JWT authentication
const jwt = auth.JWT({
  issuer: 'grafbase',
  secret: g.env('NEXTAUTH_SECRET')
})

// Export the configuration
export default config({
  graph: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private()
  },
})
