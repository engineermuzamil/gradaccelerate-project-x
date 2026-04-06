import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Label from '#models/label'
import Todo from '#models/todo'

export default class TodoSeeder extends BaseSeeder {
  async run() {
    const workLabel = await Label.firstOrCreate({ name: 'work' })
    const urgentLabel = await Label.firstOrCreate({ name: 'urgent' })
    const personalLabel = await Label.firstOrCreate({ name: 'personal' })
    const backendLabel = await Label.firstOrCreate({ name: 'backend' })

    const todos = await Todo.createMany([
      {
        title: 'Complete Todo API',
        description: 'Implement CRUD endpoints and label support for todos.',
        isCompleted: false,
      },
      {
        title: 'Review notes module',
        description: 'Check pinning, markdown rendering, and sorting behavior.',
        isCompleted: true,
      },
      {
        title: 'Prepare bootcamp submission',
        description: 'Test all tasks and make sure migrations and seeders work.',
        isCompleted: false,
      },
    ])

    await todos[0].related('labels').attach([workLabel.id, backendLabel.id, urgentLabel.id])
    await todos[1].related('labels').attach([workLabel.id])
    await todos[2].related('labels').attach([personalLabel.id, urgentLabel.id])
  }
}
