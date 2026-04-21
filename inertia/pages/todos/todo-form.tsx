import type React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface TodoFormProps {
  labels: {
    id: number
    name: string
  }[]
  data: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    status: 'pending' | 'in-progress' | 'completed'
    isCompleted: boolean
    labels: number[]
  }
  setData: (
    field: string,
    value: string | boolean | number[]
  ) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing: boolean
}

export default function TodoForm({
  labels,
  data,
  setData,
  submit,
  processing,
  handleKeyDown,
  isEditing,
}: TodoFormProps) {
  return (
    <motion.div style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)' }}>
      <Card className="backdrop-blur-lg">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Todo' : 'New Todo'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input
              type="text"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              placeholder="Todo title"
              required
            />

            <Textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Todo description"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Priority</p>
                <Select value={data.priority} onChange={(e) => setData('priority', e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Status</p>
                <Select value={data.status} onChange={(e) => setData('status', e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                </Select>
              </div>  
            </div>

            <div>
              <p className="text-sm font-medium text-white mb-3">Labels</p>
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => {
                  const isSelected = data.labels.includes(label.id)

                  return (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() =>
                        setData(
                          'labels',
                          isSelected
                            ? data.labels.filter((id) => id !== label.id)
                            : [...data.labels, label.id]
                        )
                      }
                    >
                      <Badge variant={isSelected ? 'default' : 'secondary'} className="cursor-pointer px-3 py-1.5">
                        {label.name}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-white">
              <input
                type="checkbox"
                checked={data.isCompleted}
                onChange={(e) => setData('isCompleted', e.target.checked)}
                className="h-4 w-4 rounded border-none accent-[#0A84FF]"
              />
              Mark as completed
            </label>

            <Button type="submit" disabled={processing} className="w-full">
              {processing ? (isEditing ? 'Saving...' : 'Adding...') : isEditing ? 'Save Todo' : 'Add Todo'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
