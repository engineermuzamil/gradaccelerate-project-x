import { HttpContext } from '@adonisjs/core/http'
import { randomBytes } from 'node:crypto'
import Cloudinary from '#config/cloudinary'
import Label from '#models/label'
import Note from '#models/note'

export default class NotesController {
  /**
   * Display a list of notes
   */
  async index({ inertia, auth }: HttpContext) {
    const notes = await Note.query()
      .where('user_id', auth.user!.id)
      .preload('labels')
      .orderBy('pinned', 'desc')
      .orderBy('created_at', 'desc')
    const labels = await Label.query().orderBy('name', 'asc')

    return inertia.render('notes/index', { notes, labels })
  }

  /**
   * Get a specific note
   */
  async show({ params, response, auth }: HttpContext) {
    const note = await Note.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .preload('labels')
      .first()
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    return response.json(note)
  }

  async showShared({ params, inertia, response }: HttpContext) {
    const note = await Note.query().where('shared_token', params.token).preload('labels').first()

    if (!note) {
      return response.notFound('Shared note not found')
    }

    return inertia.render('notes/shared', { note })
  }

  /**
   * Store a new note
   */
  async store({ request, response, session, auth }: HttpContext) {
    const data = request.only(['title', 'content', 'pinned', 'imageUrl'])

    const note = await Note.create({
      title: data.title,
      content: data.content,
      pinned: Boolean(data.pinned),
      imageUrl: data.imageUrl || null,
      userId: auth.user!.id,
    })
    await this.syncLabels(note, request.input('labels', []))

    session.flash('success', 'Note created successfully')
    return response.redirect().back()
  }

  /**
   * Update a note
   */
  async update({ params, request, response, session, auth }: HttpContext) {
    const note = await Note.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .first()
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    const data = request.only(['title', 'content', 'pinned', 'imageUrl'])
    await note
      .merge({
        title: data.title,
        content: data.content,
        pinned: Boolean(data.pinned),
        imageUrl: data.imageUrl || null,
      })
      .save()
    await this.syncLabels(note, request.input('labels', []))

    session.flash('success', 'Note updated successfully')
    return response.redirect().back()
  }

  async share({ params, request, response, session, auth }: HttpContext) {
    const note = await Note.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .first()

    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    if (!note.sharedToken) {
      note.sharedToken = randomBytes(16).toString('hex')
      await note.save()
    }

    const shareUrl = request
      .completeUrl()
      .replace(`/notes/${note.id}/share`, `/notes/shared/${note.sharedToken}`)

    session.flash('sharedNoteUrl', shareUrl)
    session.flash('success', 'Share link is ready')
    return response.redirect().back()
  }

  async uploadImage({ request, response, session }: HttpContext) {
    const image = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    })

    if (!image) {
      return response.badRequest({ error: 'No file uploaded' })
    }

    if (!image.isValid) {
      return response.badRequest({
        error: image.errors[0]?.message || 'Invalid image upload',
      })
    }

    if (!image.tmpPath) {
      return response.internalServerError({
        error: 'Uploaded image is missing a temporary file path',
      })
    }

    try {
      const uploadedImage = await Cloudinary.uploader.upload(image.tmpPath, {
        folder: 'notes',
        resource_type: 'image',
      })

      session.flash('uploadedImageUrl', uploadedImage.secure_url)
      session.flash('success', 'Image uploaded successfully')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Failed to upload image')
      return response.redirect().back()
    }
  }

  /**
   * Delete a note
   */
  async destroy({ params, response, session, auth }: HttpContext) {
    const note = await Note.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .first()
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    await note.delete()
    session.flash('success', 'Note deleted successfully')
    return response.redirect().back()
  }

  private async syncLabels(note: Note, labels: unknown) {
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

    await note.related('labels').sync(labelIds)
  }
}
