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
const TodosController = () => import('#controllers/todos_controller')
import router from '@adonisjs/core/services/router'

router.get('/', ({ inertia }) => inertia.render('home'))
router.get('/todos', [TodosController, 'index'])
router.post('/todos', [TodosController, 'store'])
router.put('/todos/:id', [TodosController, 'update'])
router.delete('/todos/:id', [TodosController, 'destroy'])

router.get('/notes', [NotesController, 'index'])
router.get('/notes/:id', [NotesController, 'show'])
router.post('/notes/upload', [NotesController, 'uploadImage'])
router.post('/notes', [NotesController, 'store'])
router.put('/notes/:id', [NotesController, 'update'])
router.delete('/notes/:id', [NotesController, 'destroy'])

router.get('/projects', [ProjectsController, 'index'])
router.post('/projects', [ProjectsController, 'store'])
router.put('/projects/:id', [ProjectsController, 'update'])
router.delete('/projects/:id', [ProjectsController, 'destroy'])

router
  .group(() => {
    router.get('/', [TodosController, 'index'])
    router.post('/', [TodosController, 'store'])
    router.get('/:id', [TodosController, 'show'])
    router.put('/:id', [TodosController, 'update'])
    router.delete('/:id', [TodosController, 'destroy'])
  })
  .prefix('/api/todos')
