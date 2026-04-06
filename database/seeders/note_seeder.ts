import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Label from '#models/label'
import Note from '#models/note'

export default class NoteSeeder extends BaseSeeder {
  async run() {
    const workLabel = await Label.firstOrCreate({ name: 'work' })
    const ideasLabel = await Label.firstOrCreate({ name: 'ideas' })
    const studyLabel = await Label.firstOrCreate({ name: 'study' })

    const notes = await Note.createMany([
      {
        title: 'Project Highlights',
        content: `# GradAccelerate Features

## Completed Modules

- **Projects**: Full CRUD with pagination
- **Notes**: Pin, sort, markdown support
- **Auth**: Session-based authentication

## Tech Stack

- **Backend**: AdonisJS 6
- **Frontend**: React 19 + TypeScript
- **Database**: SQLite with Lucid ORM
- **UI**: Tailwind CSS + Framer Motion

## Key Features

\`Markdown rendering\` - Display notes with **rich formatting**

> This is a blockquote example`,
        pinned: true,
        imageUrl: null,
      },
      {
        title: 'Weekend Plans',
        content: `- Visit family
- Clean house
- Movie night
- Cook dinner`,
        pinned: false,
        imageUrl: null,
      },
      {
        title: 'Development Tips',
        content: `## React Best Practices

### Component Structure

1. Keep components small and focused
2. Use meaningful prop names
3. Memoize expensive computations

### Example

\`const MyComponent = ({ title }) => {
  return <h1>{title}</h1>
}\`

> Always write clean and maintainable code`,
        pinned: false,
        imageUrl: null,
      },
    ])

    await notes[0].related('labels').attach([workLabel.id, ideasLabel.id])
    await notes[1].related('labels').attach([ideasLabel.id])
    await notes[2].related('labels').attach([studyLabel.id, workLabel.id])
  }
}
