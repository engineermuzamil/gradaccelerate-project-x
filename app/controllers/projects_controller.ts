import { HttpContext } from '@adonisjs/core/http'
import Project, { ProjectStatus } from '#models/project'

export default class ProjectsController {
  /**
   * Display paginated list of projects
   */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 6

    const projects = await Project.query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return inertia.render('projects/index', {
      projects: projects.all(),
      meta: projects.getMeta()
    })
  }

  /**
   * Store a new project
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description', 'status'])
    await Project.create({
      ...data,
      status: data.status || ProjectStatus.PENDING
    })
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

    const data = request.only(['title', 'description', 'status'])
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