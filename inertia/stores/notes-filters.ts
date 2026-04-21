import { create } from 'zustand'

interface NotesFiltersState {
  searchQuery: string
  selectedLabelIds: number[]
  setSearchQuery: (query: string) => void
  toggleLabelId: (labelId: number) => void
  resetFilters: () => void
}

export const useNotesFiltersStore = create<NotesFiltersState>((set) => ({
  searchQuery: '',
  selectedLabelIds: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleLabelId: (labelId) =>
    set((state) => ({
      selectedLabelIds: state.selectedLabelIds.includes(labelId)
        ? state.selectedLabelIds.filter((id) => id !== labelId)
        : [...state.selectedLabelIds, labelId],
    })),
  resetFilters: () => set({ searchQuery: '', selectedLabelIds: [] }),
}))
