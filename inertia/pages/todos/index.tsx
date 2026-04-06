import { Head, useForm, Link, router, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PlusIcon, XIcon, ArrowLeft } from 'lucide-react'
import TodoCard from './todo-card'
import TodoForm from './todo-form'
import ViewSwitcher from './view-switcher'

interface Label {
  id: number
  name: string
}

interface Todo {
  id: number
  title: string
  description: string | null
  isCompleted: boolean
  createdAt: string
  updatedAt: string | null
  labels: Label[]
}

type ViewType = 'grid' | 'list'

export default function Todos() {
  const { todos: initialTodos, labels: availableLabels } = usePage<{ todos: Todo[]; labels: Label[] }>().props
  const [todos, setTodos] = useState(initialTodos)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)
  const [viewType, setViewType] = useState<ViewType>('grid')
  const { data, setData, post, put, processing, reset } = useForm({
    title: '',
    description: '',
    isCompleted: false as boolean,
    labels: [] as number[],
  })

  const sortTodos = (items: Todo[]) =>
    [...items].sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  useEffect(() => {
    setTodos(sortTodos(initialTodos))
  }, [initialTodos])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTodoId !== null) {
      put(`/todos/${editingTodoId}`, {
        onSuccess: () => {
          resetForm()
        },
      })
      return
    }

    post('/todos', {
      onSuccess: () => {
        resetForm()
      },
    })
  }

  const resetForm = () => {
    reset()
    setData('labels', [])
    setEditingTodoId(null)
    setIsFormVisible(false)
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodoId(todo.id)
    setData('title', todo.title)
    setData('description', todo.description || '')
    setData('isCompleted', todo.isCompleted)
    setData('labels', todo.labels.map((label) => label.id))
    setIsFormVisible(true)
  }

  const handleDelete = (id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
    router.delete(`/todos/${id}`, {
      preserveScroll: true,
    })
  }

  const handleToggleComplete = (todo: Todo) => {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted }

    setTodos((currentTodos) =>
      sortTodos(currentTodos.map((item) => (item.id === todo.id ? updatedTodo : item)))
    )

    router.put(
      `/todos/${todo.id}`,
      {
        title: todo.title,
        description: todo.description,
        isCompleted: updatedTodo.isCompleted,
        labels: todo.labels.map((label) => label.id),
      },
      { preserveScroll: true }
    )
  }

  const toggleForm = () => {
    if (isFormVisible) {
      resetForm()
      return
    }

    setIsFormVisible(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      submit(e as any)
    }
  }

  return (
    <>
      <Head title="Todos" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold">Todos</h1>
            </div>
            <div className="flex items-center gap-3">
              <ViewSwitcher currentView={viewType} onChange={setViewType} />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleForm}
                className="bg-[#0A84FF] text-white p-3 rounded-full shadow-lg hover:bg-[#0A74FF] transition-colors duration-200"
              >
                {isFormVisible ? <XIcon size={20} /> : <PlusIcon size={20} />}
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {isFormVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <TodoForm
                  data={data}
                  labels={availableLabels}
                  setData={setData}
                  submit={submit}
                  processing={processing}
                  handleKeyDown={handleKeyDown}
                  isEditing={editingTodoId !== null}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={viewType === 'grid' ? 'columns-1 md:columns-2 gap-4' : 'flex flex-col gap-3'}
          >
            <AnimatePresence>
              {todos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={viewType === 'grid' ? 'mb-4 break-inside-avoid' : 'w-full'}
                >
                  <TodoCard
                    todo={todo}
                    viewType={viewType}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  )
}
