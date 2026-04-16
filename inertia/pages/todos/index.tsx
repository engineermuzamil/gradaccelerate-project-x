import { Head, Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
import { PlusIcon, XIcon, ArrowLeft } from 'lucide-react'
import FlashMessage from '../flash-message'
import TodoCard from './todo-card'
import TodoForm from './todo-form'
import ViewSwitcher from './view-switcher'
import { clearTodoToken, getTodoToken, todoRequest } from './auth'

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
  const { labels: availableLabels } = usePage<{ todos: Todo[]; labels: Label[] }>().props
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [flash, setFlash] = useState<{ success?: string; error?: string }>({})
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)
  const [viewType, setViewType] = useState<ViewType>('grid')
  const [processing, setProcessing] = useState(false)
  const [data, setFormData] = useState({
    title: '',
    description: '',
    isCompleted: false,
    labels: [] as number[],
  })

  const sortTodos = (items: Todo[]) =>
    [...items].sort(
      (a, b) =>
        Number(a.isCompleted) - Number(b.isCompleted) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  const setData = (field: string, value: string | boolean | number[]) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const loadTodos = async () => {
    try {
      const todoItems = await todoRequest('/api/todos')
      setTodos(sortTodos(todoItems))
    } catch (error) {
      clearTodoToken()
      window.location.href = '/todos/login'
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = getTodoToken()

    if (!token) {
      window.location.href = '/todos/login'
      return
    }

    loadTodos()
  }, [])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      isCompleted: false,
      labels: [],
    })
    setEditingTodoId(null)
    setIsFormVisible(false)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setFlash({})

    try {
      if (editingTodoId !== null) {
        await todoRequest(`/api/todos/${editingTodoId}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
        setFlash({ success: 'Todo updated successfully' })
      } else {
        await todoRequest('/api/todos', {
          method: 'POST',
          body: JSON.stringify(data),
        })
        setFlash({ success: 'Todo created successfully' })
      }

      resetForm()
      await loadTodos()
    } catch (error) {
      setFlash({ error: error instanceof Error ? error.message : 'Todo request failed' })
    } finally {
      setProcessing(false)
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodoId(todo.id)
    setData('title', todo.title)
    setData('description', todo.description || '')
    setData('isCompleted', todo.isCompleted)
    setData('labels', todo.labels.map((label) => label.id))
    setIsFormVisible(true)
  }

  const handleDelete = async (id: number) => {
    setFlash({})

    try {
      await todoRequest(`/api/todos/${id}`, { method: 'DELETE' })
      setFlash({ success: 'Todo deleted successfully' })
      await loadTodos()
    } catch (error) {
      setFlash({ error: error instanceof Error ? error.message : 'Todo delete failed' })
    }
  }

  const handleToggleComplete = async (todo: Todo) => {
    setFlash({})

    try {
      await todoRequest(`/api/todos/${todo.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
          isCompleted: !todo.isCompleted,
          labels: todo.labels.map((label) => label.id),
        }),
      })

      await loadTodos()
    } catch (error) {
      setFlash({ error: error instanceof Error ? error.message : 'Todo update failed' })
    }
  }

  const toggleForm = () => {
    if (isFormVisible) {
      resetForm()
      return
    }

    setIsFormVisible(true)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      submit(e as never)
    }
  }

  const logout = async () => {
    try {
      await todoRequest('/api/auth/todos/logout', { method: 'POST' })
    } catch {
    } finally {
      clearTodoToken()
      window.location.href = '/todos/login'
    }
  }

  return (
    <>
      <Head title="Todos" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          <FlashMessage flash={flash} />
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
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-[#2C2C2E] text-white border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-colors duration-200"
              >
                Logout
              </button>
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

          {isLoading ? (
            <div className="text-[#98989D]">Loading todos...</div>
          ) : (
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
          )}
        </div>
      </div>
    </>
  )
}
