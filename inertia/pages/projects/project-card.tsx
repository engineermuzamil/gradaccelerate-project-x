import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { PencilIcon } from 'lucide-react'

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string | null;
}

interface ProjectCardProps {
  project: Project
  viewType: 'grid' | 'list'
  onEdit: (project: Project) => void
}

const statusConfig = {
  'pending': { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'completed': { label: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
}

export default function ProjectCard({ project, viewType, onEdit }: ProjectCardProps) {
  const timeAgo = formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })
  const status = statusConfig[project.status]

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
      <div className={`p-5 ${viewType === 'list' ? 'flex items-center gap-4' : ''}`}>
        <div className={viewType === 'list' ? 'flex-1' : ''}>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-medium text-white">{project.title}</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="text-[#0A84FF] hover:text-[#3B9BFF] transition-colors duration-200"
              >
                <PencilIcon size={16} />
              </button>
              <span className="text-xs text-[#98989D]">{timeAgo}</span>
            </div>
          </div>
          <p className={`text-[#98989D] text-sm mb-3 ${viewType === 'grid' ? 'line-clamp-3' : 'line-clamp-1'}`}>
            {project.description}
          </p>
          {/* Status Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {viewType === 'grid' && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#2C2C2E] to-transparent" />
      )}
    </motion.div>
  )
}
