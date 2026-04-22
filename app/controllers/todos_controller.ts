import { HttpContext } from '@adonisjs/core/http'
import Label from '#models/label'
import Todo from '#models/todo'

export default class TodosController {
  async index({ request, response, inertia, auth }: HttpContext) {
    const isApiRequest = request.url().startsWith('/api/')
    const labels = await Label.query().orderBy('name', 'asc')

    if (!isApiRequest) {
      return inertia.render('todos/index', { todos: [], labels })
    }

    const todos = await Todo.query()
      .where('user_id', auth.user!.id)
      .preload('labels')
      .orderBy('created_at', 'desc')

    return response.ok(todos)
  }

  async show({ params, response, auth }: HttpContext) {
    const todo = await Todo.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .preload('labels')
      .first()
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }

    return response.ok(todo)
  }

  async store({ request, response, session, auth }: HttpContext) {
    const isApiRequest = request.url().startsWith('/api/')

    const todo = await Todo.create({
      title: request.input('title'),
      description: request.input('description'),
      priority: request.input('priority', 'medium'),
      status: request.input('status', 'pending'),
      isCompleted: Boolean(request.input('isCompleted', false)),
      userId: auth.user!.id,
    })

    await this.syncLabels(todo, request.input('labels', []))
    await todo.load('labels')

    if (!isApiRequest) {
      session.flash('success', 'Todo created successfully')
      return response.redirect().back()
    }

    return response.created(todo)
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const isApiRequest = request.url().startsWith('/api/')
    const todo = await Todo.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .first()
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }

    await todo
      .merge({
        title: request.input('title', todo.title),
        description: request.input('description', todo.description),
        priority: request.input('priority', todo.priority),
        status: request.input('status', todo.status),
        isCompleted: Boolean(request.input('isCompleted', todo.isCompleted)),
      })
      .save()

    await this.syncLabels(todo, request.input('labels', []))
    await todo.load('labels')

    if (!isApiRequest) {
      session.flash('success', 'Todo updated successfully')
      return response.redirect().back()
    }

    return response.ok(todo)
  }

  async destroy({ params, request, response, session, auth }: HttpContext) {
    const isApiRequest = request.url().startsWith('/api/')
    const todo = await Todo.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .first()
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }

    await todo.delete()

    if (!isApiRequest) {
      session.flash('success', 'Todo deleted successfully')
      return response.redirect().back()
    }

    return response.ok({ message: 'Todo deleted successfully' })
  }

  private async syncLabels(todo: Todo, labels: unknown) {
    const labelValues = Array.isArray(labels)
      ? [...new Set(labels.filter((label): label is string | number => typeof label === 'string' || typeof label === 'number'))]
      : []

    const labelIds: number[] = []

    for (const value of labelValues) {
      if (typeof value === 'number') {
        labelIds.push(value)
        continue
      }

      const numericValue = Number(value)
      if (!Number.isNaN(numericValue) && value.trim() !== '') {
        labelIds.push(numericValue)
        continue
      }

      const name = value.trim()
      if (!name) {
        continue
      }

      const label = await Label.firstOrCreate({ name })
      labelIds.push(label.id)
    }

    await todo.related('labels').sync(labelIds)
  }
}
