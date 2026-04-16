import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Label from '#models/label'
import Todo from '#models/todo'
import User from '#models/user'

export default class TodoSeeder extends BaseSeeder {
  async run() {
    const user = await User.firstOrCreate(
      { email: 'todo@example.com' },
      {
        fullName: 'Todo User',
        password: 'password123',
      }
    )

    const workLabel = await Label.firstOrCreate({ name: 'work' })
    const urgentLabel = await Label.firstOrCreate({ name: 'urgent' })
    const personalLabel = await Label.firstOrCreate({ name: 'personal' })
    const backendLabel = await Label.firstOrCreate({ name: 'backend' })

    const todos = await Todo.createMany([
      {
        title: 'Complete Todo API',
        description: 'Implement CRUD endpoints and label support for todos.',
        isCompleted: false,
        userId: user.id,
      },
      {
        title: 'Review notes module',
        description: 'Check pinning, markdown rendering, and sorting behavior.',
        isCompleted: true,
        userId: user.id,
      },
      {
        title: 'Prepare bootcamp submission',
        description: 'Test all tasks and make sure migrations and seeders work.',
        isCompleted: false,
        userId: user.id,
      },
    ])

    await todos[0].related('labels').attach([workLabel.id, backendLabel.id, urgentLabel.id])
    await todos[1].related('labels').attach([workLabel.id])
    await todos[2].related('labels').attach([personalLabel.id, urgentLabel.id])
  }
}
