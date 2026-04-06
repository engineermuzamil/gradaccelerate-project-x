/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const NotesController = () => import('#controllers/notes_controller')
const ProjectsController = () => import('#controllers/projects_controller')
import router from '@adonisjs/core/services/router'

router.get('/', ({ inertia }) => inertia.render('home'))
router.get('/todos', ({ inertia }) => inertia.render('todos/empty'))

router.get('/notes', [NotesController, 'index'])
router.get('/notes/:id', [NotesController, 'show'])
router.post('/notes', [NotesController, 'store'])
router.put('/notes/:id', [NotesController, 'update'])
router.delete('/notes/:id', [NotesController, 'destroy'])

router.get('/projects', [ProjectsController, 'index'])
router.post('/projects', [ProjectsController, 'store'])
router.put('/projects/:id', [ProjectsController, 'update'])
router.delete('/projects/:id', [ProjectsController, 'destroy'])
