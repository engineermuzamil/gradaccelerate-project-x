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
const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', ({ inertia }) => inertia.render('home'))

// Auth pages
router.get('/login', [AuthController, 'showLogin'])
router.get('/signup', [AuthController, 'showSignup'])

// Session auth routes
router.group(() => {
  router.post('/signup', [AuthController, 'signup'])
  router.post('/login', [AuthController, 'login'])
}).prefix('/auth/session')

// Protected logout route
router.group(() => {
  router.post('/logout', [AuthController, 'logout'])
}).prefix('/auth/session').use(middleware.auth())

// Todo pages
router.get('/todos', [TodosController, 'index'])
router.post('/todos', [TodosController, 'store'])
router.put('/todos/:id', [TodosController, 'update'])
router.delete('/todos/:id', [TodosController, 'destroy'])

// Protected notes routes
router
  .group(() => {
    router.get('/notes', [NotesController, 'index'])
    router.get('/notes/:id', [NotesController, 'show'])
    router.post('/notes/upload', [NotesController, 'uploadImage'])
    router.post('/notes', [NotesController, 'store'])
    router.put('/notes/:id', [NotesController, 'update'])
    router.delete('/notes/:id', [NotesController, 'destroy'])
  })
  .use(middleware.auth())

// Project pages
router.get('/projects', [ProjectsController, 'index'])
router.post('/projects', [ProjectsController, 'store'])
router.put('/projects/:id', [ProjectsController, 'update'])
router.delete('/projects/:id', [ProjectsController, 'destroy'])

// Todo API routes
router
  .group(() => {
    router.get('/', [TodosController, 'index'])
    router.post('/', [TodosController, 'store'])
    router.get('/:id', [TodosController, 'show'])
    router.put('/:id', [TodosController, 'update'])
    router.delete('/:id', [TodosController, 'destroy'])
  })
  .prefix('/api/todos')
