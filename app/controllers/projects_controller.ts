import { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class ProjectsController {
  /**
   * Display a list of projects
   */
  async index({ inertia }: HttpContext) {
    const projects = await Project.all()
    return inertia.render('projects/index', { projects })
  }

  /**
   * Get a specific project
   */
  async show({ params, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) {
      return response.notFound({ message: 'Project not found' })
    }
    return response.json(project)
  }

  /**
   * Store a new project
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description'])
    const project = await Project.create(data)
    return response.redirect().back()
  }

  /**
   * Update a project
   */
  async update({ params, request, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) {
      return response.notFound({ message: 'Project not found' })
    }

    const data = request.only(['title', 'description'])
    await project.merge(data).save()
    return response.redirect().back()
  }

  /**
   * Delete a project
   */
  async destroy({ params, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) {
      return response.notFound({ message: 'Project not found' })
    }

    await project.delete()
    return response.redirect().back()
  }
}