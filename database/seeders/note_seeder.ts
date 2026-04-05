import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Note from '#models/note'

export default class NoteSeeder extends BaseSeeder {
  async run() {
    await Note.createMany([
      {
        title: 'First Note',
        content: 'This is the content of the first note.',
      },
      {
        title: 'Second Note',
        content: 'This is the content of the second note.',
      },
      {
        title: 'Third Note',
        content: 'This is the content of the third note.',
      },
    ])
  }
}