import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Project from '#models/project'

export default class ProjectSeeder extends BaseSeeder {
  async run() {
    await Project.createMany([
      {
        title: 'Build an AdonisJS App',
        description: 'Develop a full-stack app using AdonisJS and Inertia.js.',
      },
      {
        title: 'Write API Documentation',
        description: 'Document all API endpoints for better maintainability.',
      },
      {
        title: 'Deploy the Application',
        description: 'Deploy the project to a cloud provider.',
      },
    ])
  }
}