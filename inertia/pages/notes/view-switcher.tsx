import { motion } from 'framer-motion'
import { LayoutGridIcon, ListIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type ViewType = 'grid' | 'list'

interface ViewSwitcherProps {
  currentView: ViewType
  onChange: (view: ViewType) => void
}

export default function ViewSwitcher({ currentView, onChange }: ViewSwitcherProps) {
  return (
    <Card className="flex flex-row gap-1 p-1 rounded-lg">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          type="button"
          variant={currentView === 'grid' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => onChange('grid')}
          className={currentView === 'grid' ? '' : 'text-[#98989D] hover:text-white'}
        >
          <LayoutGridIcon size={18} />
        </Button>
      </motion.div>
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          type="button"
          variant={currentView === 'list' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => onChange('list')}
          className={currentView === 'list' ? '' : 'text-[#98989D] hover:text-white'}
        >
          <ListIcon size={18} />
        </Button>
      </motion.div>
    </Card>
  )
}
