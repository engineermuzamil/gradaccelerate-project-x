import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, Circle, PencilIcon, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Label {
  id: number
  name: string
}

interface Todo {
  id: number
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
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
  const createdAgo = formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })
  const updatedAgo = todo.updatedAt ? formatDistanceToNow(new Date(todo.updatedAt), { addSuffix: true }) : null
  const priorityVariant =
    todo.priority === 'high' ? 'default' : todo.priority === 'medium' ? 'secondary' : 'outline'

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 ${
          viewType === 'grid' ? 'rounded-xl' : 'rounded-lg'
        }`}
        style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
      >
        <CardContent className={`p-5 ${viewType === 'list' ? 'flex items-start gap-4' : ''}`}>
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
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" size="icon" onClick={() => onEdit(todo)}>
                  <PencilIcon size={16} />
                </Button>
                <Button type="button" variant="secondary" size="icon" onClick={() => onDelete(todo.id)} className="text-[#FF6B6B] hover:text-[#FF8787]">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            {todo.description && (
              <p className={`text-sm mb-4 ${viewType === 'grid' ? 'line-clamp-3' : 'line-clamp-1'} ${todo.isCompleted ? 'text-[#7D7D82]' : 'text-[#E5E5EA]'}`}>
                {todo.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={priorityVariant}>Priority: {todo.priority}</Badge>
              <Badge variant="secondary">Status: {todo.status}</Badge>
            </div>

            {todo.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {todo.labels.map((label) => (
                  <Badge key={label.id}>{label.name}</Badge>
                ))}
              </div>
            )}

            <div className="text-xs text-[#98989D] mt-4 space-y-1">
              <p>Created {createdAgo}</p>
              {updatedAgo && <p>Updated {updatedAgo}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
