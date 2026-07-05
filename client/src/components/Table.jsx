import { Edit2, Trash2 } from 'lucide-react'
import Badge from './Badge'
import Button from './Button'
import EmptyState from './EmptyState'
import { getDisplayValue } from '../config/resources'

function VehicleCell({ row }) {
  return (
    <div className="vehicle-cell">
      <div className="vehicle-thumb">
        <span>{row.brand_name?.charAt(0) || 'D'}</span>
      </div>
      <div>
        <strong>{[row.brand_name, row.model_name].filter(Boolean).join(' ') || 'Vehículo'}</strong>
        <small>{row.plate_number || 'Sin placa'}</small>
      </div>
    </div>
  )
}

function Table({ columns, rows, idKey, onEdit, onDelete, emptyTitle }) {
  if (!rows.length) {
    return <EmptyState title={emptyTitle} />
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th className="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[idKey]}>
              {columns.map((column) => {
                const value = getDisplayValue(column, row)

                return (
                  <td key={column.key}>
                    {column.type === 'vehicle' && <VehicleCell row={row} />}
                    {column.type === 'status' && <Badge>{value}</Badge>}
                    {!column.type && value}
                  </td>
                )
              })}
              <td>
                <div className="row-actions">
                  <Button variant="ghost" size="icon" icon={Edit2} onClick={() => onEdit(row)}>
                    Editar
                  </Button>
                  <Button variant="ghost-danger" size="icon" icon={Trash2} onClick={() => onDelete(row)}>
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
