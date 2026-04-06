import { HttpContext } from '@adonisjs/core/http'
import Label from '#models/label'
import Todo from '#models/todo'

export default class TodosController {
  async index({ request, response, inertia }: HttpContext) {
    const todos = await Todo.query().preload('labels').orderBy('created_at', 'desc')
    const labels = await Label.query().orderBy('name', 'asc')

    if (!request.url().startsWith('/api/')) {
      return inertia.render('todos/index', { todos, labels })
    }

    return response.ok(todos)
  }

  async show({ params, response }: HttpContext) {
    const todo = await Todo.query().where('id', params.id).preload('labels').first()
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }

    return response.ok(todo)
  }

  async store({ request, response }: HttpContext) {
    const todo = await Todo.create({
      title: request.input('title'),
      description: request.input('description'),
      isCompleted: Boolean(request.input('isCompleted', false)),
    })

    await this.syncLabels(todo, request.input('labels', []))
    await todo.load('labels')

    if (!request.url().startsWith('/api/')) {
      return response.redirect().back()
    }

    return response.created(todo)
  }

  async update({ params, request, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }

    await todo
      .merge({
        title: request.input('title', todo.title),
        description: request.input('description', todo.description),
        isCompleted: Boolean(request.input('isCompleted', todo.isCompleted)),
      })
      .save()

    await this.syncLabels(todo, request.input('labels', []))
    await todo.load('labels')

    if (!request.url().startsWith('/api/')) {
      return response.redirect().back()
    }

    return response.ok(todo)
  }

  async destroy({ params, request, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }

    await todo.delete()

    if (!request.url().startsWith('/api/')) {
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
