import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'

export default class NotesController {
  /**
   * Display a list of notes
   */
  async index({ inertia }: HttpContext) {
    const notes = await Note.query().orderBy('pinned', 'desc').orderBy('created_at', 'desc')

    return inertia.render('notes/index', { notes })
  }

  /**
   * Get a specific note
   */
  async show({ params, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    return response.json(note)
  }

  /**
   * Store a new note
   */
  async store({ request, response, session }: HttpContext) {
    const data = request.only(['title', 'content', 'pinned'])

    await Note.create({
      title: data.title,
      content: data.content,
      pinned: Boolean(data.pinned),
    })

    session.flash('success', 'Note created successfully')
    return response.redirect().back()
  }

  /**
   * Update a note
   */
  async update({ params, request, response, session }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    const data = request.only(['title', 'content', 'pinned'])
    await note
      .merge({
        title: data.title,
        content: data.content,
        pinned: Boolean(data.pinned),
      })
      .save()

    session.flash('success', 'Note updated successfully')
    return response.redirect().back()
  }

  /**
   * Delete a note
   */
  async destroy({ params, response, session }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    await note.delete()
    session.flash('success', 'Note deleted successfully')
    return response.redirect().back()
  }
}
