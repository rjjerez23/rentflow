import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) {
    return null
  }

  return (
    <div className="pagination">
      <Button
        variant="secondary"
        size="sm"
        icon={ChevronLeft}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </Button>
      <span>
        Page {page} of {pageCount}
      </span>
      <Button
        variant="secondary"
        size="sm"
        icon={ChevronRight}
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
