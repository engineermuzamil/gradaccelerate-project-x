import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Project, { ProjectStatus } from '#models/project'

export default class ProjectSeeder extends BaseSeeder {
  async run() {
    await Project.createMany([
      {
        title: 'Build an AdonisJS App',
        description: 'Develop a full-stack app using AdonisJS and Inertia.js.',
        status: ProjectStatus.COMPLETED,
      },
      {
        title: 'Write API Documentation',
        description: 'Document all API endpoints for better maintainability.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        title: 'Deploy the Application',
        description: 'Deploy the project to a cloud provider.',
        status: ProjectStatus.PENDING,
      },
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Automate testing and deployment workflows.',
        status: ProjectStatus.PENDING,
      },
      {
        title: 'Write Unit Tests',
        description: 'Cover all major features with unit and integration tests.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        title: 'Design System Setup',
        description: 'Create reusable UI components and design tokens.',
        status: ProjectStatus.COMPLETED,
      },
      {
        title: 'Database Optimization',
        description: 'Optimize queries and add indexes for better performance.',
        status: ProjectStatus.PENDING,
      },
      {
        title: 'Authentication System',
        description: 'Implement login, registration and password reset flows.',
        status: ProjectStatus.COMPLETED,
      },
      {
        title: 'Email Notification Service',
        description: 'Set up transactional emails for user notifications.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        title: 'Mobile Responsive UI',
        description: 'Ensure all pages are fully responsive on mobile devices.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        title: 'Search Feature',
        description: 'Add full-text search across projects and notes.',
        status: ProjectStatus.PENDING,
      },
      {
        title: 'Role Based Access Control',
        description: 'Implement admin, editor and viewer roles for users.',
        status: ProjectStatus.PENDING,
      },
      {
        title: 'File Upload System',
        description: 'Allow users to attach files and images to projects.',
        status: ProjectStatus.PENDING,
      },
      {
        title: 'Analytics Dashboard',
        description: 'Build a dashboard showing project progress and stats.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        title: 'API Rate Limiting',
        description: 'Add rate limiting to protect API endpoints from abuse.',
        status: ProjectStatus.COMPLETED,
      },
    ])
  }
}