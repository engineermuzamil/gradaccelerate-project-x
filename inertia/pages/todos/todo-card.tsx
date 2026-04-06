import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, Circle, PencilIcon, Trash2 } from 'lucide-react'

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

interface TodoCardProps {
  todo: Todo
  viewType: 'grid' | 'list'
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
  onToggleComplete: (todo: Todo) => void
}

export default function TodoCard({ todo, viewType, onEdit, onDelete, onToggleComplete }: TodoCardProps) {
  const timeAgo = formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })

  return (
    <motion.div
      className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 border border-[#3A3A3C] ${
        viewType === 'grid' ? 'rounded-xl' : 'rounded-lg'
      }`}
      style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`p-5 ${viewType === 'list' ? 'flex items-start gap-4' : ''}`}>
        <div className={viewType === 'list' ? 'flex-1' : ''}>
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex items-start gap-3">
            <button type="button" onClick={() => onToggleComplete(todo)} className="mt-0.5">
              {todo.isCompleted ? (
                <CheckCircle2 size={20} className="text-[#30D158]" />
              ) : (
                <Circle size={20} className="text-[#8E8E93]" />
              )}
            </button>
            <div>
              <h2 className={`text-lg font-medium ${todo.isCompleted ? 'text-[#98989D] line-through' : 'text-white'}`}>
                {todo.title}
              </h2>
              <p className="text-xs text-[#98989D] mt-1">{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => onEdit(todo)} className="text-[#0A84FF] hover:text-[#3B9BFF] transition-colors duration-200">
              <PencilIcon size={16} />
            </button>
            <button type="button" onClick={() => onDelete(todo.id)} className="text-[#FF6B6B] hover:text-[#FF8787] transition-colors duration-200">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {todo.description && (
          <p className={`text-sm mb-4 ${viewType === 'grid' ? 'line-clamp-3' : 'line-clamp-1'} ${todo.isCompleted ? 'text-[#7D7D82]' : 'text-[#E5E5EA]'}`}>{todo.description}</p>
        )}

        {todo.labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {todo.labels.map((label) => (
              <span key={label.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#0A84FF]/15 text-[#6FB2FF] border border-[#0A84FF]/30">
                {label.name}
              </span>
            ))}
          </div>
        )}
        </div>
      </div>
    </motion.div>
  )
}
