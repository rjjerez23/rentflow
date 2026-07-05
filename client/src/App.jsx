import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  CalendarClock,
  Car,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  RotateCcw,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
} from 'lucide-react'
import './App.css'
import Badge from './components/Badge'
import Button from './components/Button'
import Card from './components/Card'
import ConfirmDialog from './components/ConfirmDialog'
import EmptyState from './components/EmptyState'
import Loader from './components/Loader'
import LoginPage from './components/LoginPage'
import Modal from './components/Modal'
import Pagination from './components/Pagination'
import ResourceForm from './components/ResourceForm'
import SearchInput from './components/SearchInput'
import Table from './components/Table'
import Toast from './components/Toast'
import { api, API_BASE_URL } from './services/api'
import { getFieldValue, resourceConfigs, resourceOrder } from './config/resources'
import { formatCurrency, formatDateTime } from './utils/formatters'

const navItems = [
  { key: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { key: 'users', label: 'Usuarios', icon: ShieldCheck },
  { key: 'customers', label: 'Clientes', icon: Users },
  { key: 'vehicles', label: 'Vehículos', icon: Car },
  { key: 'reservations', label: 'Reservas', icon: CalendarClock },
  { key: 'rentals', label: 'Alquileres', icon: WalletCards },
  { key: 'returns', label: 'Devoluciones', icon: RotateCcw },
  { key: 'reports', label: 'Reportes', icon: ClipboardList },
  { key: 'settings', label: 'Configuración', icon: Settings },
]

const initialData = resourceOrder.reduce((accumulator, key) => {
  accumulator[key] = []
  return accumulator
}, {})

const pageSize = 8
const emptyRecords = []

function buildInitialValues(config, record) {
  return config.fields.reduce((values, field) => {
    values[field.name] = getFieldValue(field, record)
    return values
  }, {})
}

function mapErrors(error) {
  if (!error.errors?.length) {
    return { form: error.message }
  }

  return error.errors.reduce((errors, item) => {
    errors[item.field] = item.message
    return errors
  }, {})
}

function Sidebar({ activeView, collapsed, mobileOpen, onNavigate, onToggleCollapse, onCloseMobile }) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">
          <Car size={20} aria-hidden="true" />
        </div>
        <strong>DriveFlow</strong>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              type="button"
              key={item.key}
              className={activeView === item.key ? 'nav-item nav-item-active' : 'nav-item'}
              onClick={() => {
                onNavigate(item.key)
                onCloseMobile()
              }}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
      <button type="button" className="collapse-button" onClick={onToggleCollapse}>
        {collapsed ? <ChevronRight size={16} aria-hidden="true" /> : <ChevronLeft size={16} aria-hidden="true" />}
        <span>{collapsed ? 'Expandir' : 'Contraer'}</span>
      </button>
    </aside>
  )
}

function Topbar({ title, subtitle, search, onSearch, onOpenMenu, onRefresh, onSignOut, health }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="mobile-menu" type="button" onClick={onOpenMenu}>
          <Menu size={20} aria-hidden="true" />
        </button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="topbar-actions">
        <SearchInput value={search} onChange={onSearch} placeholder="Buscar en el espacio de trabajo" />
        <Button variant="secondary" size="icon" icon={RefreshCw} onClick={onRefresh}>
          Actualizar
        </Button>
        <button className="icon-button" type="button" aria-label="Notificaciones">
          <Bell size={18} aria-hidden="true" />
        </button>
        <div className="profile-chip">
          <span>DF</span>
          <div>
            <strong>Admin</strong>
            <small>{health?.database === 'connected' ? 'En línea' : 'Sin conexión'}</small>
          </div>
        </div>
        <Button variant="ghost" size="icon" icon={LogOut} title="Cerrar sesión" aria-label="Cerrar sesión" onClick={onSignOut}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  )
}

function MetricCard({ label, value, icon: Icon, tone }) {
  return (
    <Card className="metric-card">
      <div className={`metric-icon metric-${tone}`}>
        <Icon size={20} aria-hidden="true" />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </Card>
  )
}

function Dashboard({ data, loading }) {
  const activeRentals = data.rentals.filter((rental) => rental.rental_status_name?.toLowerCase() === 'active')
  const revenue = data.returns.reduce((total, item) => total + Number(item.total_charged || 0), 0)
  const fleetStatus = data.vehicles.reduce((accumulator, vehicle) => {
    const status = vehicle.vehicle_status_name || 'Desconocido'
    accumulator[status] = (accumulator[status] || 0) + 1
    return accumulator
  }, {})

  if (loading) {
    return <Loader label="Cargando panel" />
  }

  return (
    <div className="dashboard">
      <div className="metrics-grid">
        <MetricCard label="Vehículos totales" value={data.vehicles.length} icon={Car} tone="blue" />
        <MetricCard label="Alquileres activos" value={activeRentals.length} icon={WalletCards} tone="green" />
        <MetricCard label="Reservas" value={data.reservations.length} icon={CalendarClock} tone="amber" />
        <MetricCard label="Ingresos" value={formatCurrency(revenue)} icon={Gauge} tone="red" />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <header className="panel-header">
            <h2>Vehículos recientes</h2>
          </header>
          <div className="stack-list">
            {data.vehicles.slice(0, 5).map((vehicle) => (
              <div className="stack-item" key={vehicle.vehicle_id}>
                <div className="vehicle-thumb">
                  <span>{vehicle.brand_name?.charAt(0) || 'D'}</span>
                </div>
                <div>
                  <strong>{[vehicle.brand_name, vehicle.model_name].filter(Boolean).join(' ')}</strong>
                  <small>{vehicle.plate_number}</small>
                </div>
                <Badge>{vehicle.vehicle_status_name || 'Desconocido'}</Badge>
              </div>
            ))}
            {!data.vehicles.length && <EmptyState title="Aún no hay vehículos" description="Los registros de la flota aparecerán aquí." />}
          </div>
        </section>

        <section className="panel">
          <header className="panel-header">
            <h2>Alquileres recientes</h2>
          </header>
          <div className="stack-list">
            {data.rentals.slice(0, 5).map((rental) => (
              <div className="stack-item" key={rental.rental_id}>
                <div>
                  <strong>{rental.customer_name}</strong>
                  <small>{formatDateTime(rental.start_datetime)}</small>
                </div>
                <Badge>{rental.rental_status_name || 'Desconocido'}</Badge>
              </div>
            ))}
            {!data.rentals.length && <EmptyState title="Aún no hay alquileres" description="Los contratos de alquiler aparecerán aquí." />}
          </div>
        </section>

        <section className="panel fleet-panel">
          <header className="panel-header">
            <h2>Estado de la flota</h2>
          </header>
          <div className="status-grid">
            {Object.entries(fleetStatus).map(([status, count]) => (
              <div className="status-tile" key={status}>
                <Badge>{status}</Badge>
                <strong>{count}</strong>
              </div>
            ))}
            {!Object.keys(fleetStatus).length && <EmptyState title="Sin estado de flota" description="Los datos de estado de vehículos aparecerán aquí." />}
          </div>
        </section>
      </div>
    </div>
  )
}

function ResourceView({
  resourceKey,
  data,
  query,
  page,
  loading,
  onQueryChange,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
}) {
  const config = resourceConfigs[resourceKey]
  const records = data[resourceKey] ?? emptyRecords
  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return records
    }

    return records.filter((record) => JSON.stringify(record).toLowerCase().includes(normalizedQuery))
  }, [query, records])

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visibleRows = filteredRecords.slice((safePage - 1) * pageSize, safePage * pageSize)

  if (loading) {
    return <Loader label={`Cargando ${config.title.toLowerCase()}`} />
  }

  return (
    <section className="resource-view">
      <div className="resource-toolbar">
        <SearchInput value={query} onChange={onQueryChange} placeholder={config.searchPlaceholder} />
        <Button icon={Plus} onClick={onCreate}>
          {config.createLabel}
        </Button>
      </div>
      <Table
        columns={config.columns}
        rows={visibleRows}
        idKey={config.idKey}
        emptyTitle={`No se encontraron ${config.title.toLowerCase()}`}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <Pagination page={safePage} pageCount={pageCount} onPageChange={onPageChange} />
    </section>
  )
}

function PlaceholderView({ title }) {
  return (
    <section className="placeholder-view">
      <EmptyState title={title} description="Esta área está reservada para el próximo hito de DriveFlow." />
    </section>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('driveflow-authenticated') !== 'false')
  const [loginValues, setLoginValues] = useState({ username: '', password: '' })
  const [loginErrors, setLoginErrors] = useState({})
  const [activeView, setActiveView] = useState('dashboard')
  const [data, setData] = useState(initialData)
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [queries, setQueries] = useState({})
  const [pages, setPages] = useState({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [modalState, setModalState] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [confirmState, setConfirmState] = useState(null)
  const [toast, setToast] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [healthResult, ...resourceResults] = await Promise.allSettled([
        api.getHealth(),
        ...resourceOrder.map((resourceKey) => api.list(resourceConfigs[resourceKey].endpoint)),
      ])

      if (healthResult.status === 'fulfilled') {
        setHealth(healthResult.value)
      }

      const nextData = { ...initialData }
      resourceOrder.forEach((resourceKey, index) => {
        const result = resourceResults[index]
        if (result.status === 'fulfilled') {
          nextData[resourceKey] = result.value.data || []
        }
      })
      setData(nextData)
    } catch (error) {
      setToast({
        type: 'danger',
        title: 'Error de conexión',
        message: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const handleLoginChange = (name, value) => {
    setLoginValues((current) => ({ ...current, [name]: value }))
    setLoginErrors((current) => ({ ...current, [name]: undefined, form: undefined }))
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!loginValues.username.trim()) {
      nextErrors.username = 'El usuario es requerido.'
    }
    if (!loginValues.password) {
      nextErrors.password = 'La contraseña es requerida.'
    }

    if (Object.keys(nextErrors).length) {
      setLoginErrors(nextErrors)
      return
    }

    localStorage.setItem('driveflow-authenticated', 'true')
    setIsAuthenticated(true)
    setLoginValues({ username: '', password: '' })
    setLoginErrors({})
  }

  const handleSignOut = () => {
    localStorage.setItem('driveflow-authenticated', 'false')
    setIsAuthenticated(false)
    setMobileSidebarOpen(false)
    setModalState(null)
    setConfirmState(null)
    setToast(null)
  }

  const activeConfig = resourceConfigs[activeView]
  const title = activeConfig?.title || (activeView === 'dashboard' ? 'Panel' : navItems.find((item) => item.key === activeView)?.label)
  const subtitle = activeConfig?.description || 'Una vista operativa clara para DriveFlow.'
  const activeQuery = queries[activeView] || ''

  const openCreateModal = () => {
    const values = buildInitialValues(activeConfig)
    setModalState({ resourceKey: activeView, record: null })
    setFormValues(values)
    setFormErrors({})
  }

  const openEditModal = (record) => {
    const values = buildInitialValues(activeConfig, record)
    setModalState({ resourceKey: activeView, record })
    setFormValues(values)
    setFormErrors({})
  }

  const closeModal = () => {
    setModalState(null)
    setFormValues({})
    setFormErrors({})
  }

  const handleFormChange = (name, value) => {
    setFormValues((current) => ({ ...current, [name]: value }))
    setFormErrors((current) => ({ ...current, [name]: undefined, form: undefined }))
  }

  const buildPayload = (config, values, isEditing) => {
    return config.fields.reduce((payload, field) => {
      const value = values[field.name]

      if (isEditing && field.name === 'password' && !value) {
        return payload
      }

      payload[field.name] = value
      return payload
    }, {})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!modalState) {
      return
    }

    const config = resourceConfigs[modalState.resourceKey]
    const isEditing = Boolean(modalState.record)
    const id = modalState.record?.[config.idKey]
    const payload = buildPayload(config, formValues, isEditing)

    setSaving(true)
    try {
      if (isEditing) {
        await api.update(config.endpoint, id, payload)
      } else {
        await api.create(config.endpoint, payload)
      }

      await loadData()
      closeModal()
      setToast({
        type: 'success',
        title: isEditing ? `${config.singular} actualizado` : `${config.singular} creado`,
        message: `Los datos de ${config.title.toLowerCase()} están actualizados.`,
      })
    } catch (error) {
      setFormErrors(mapErrors(error))
      setToast({
        type: 'danger',
        title: 'La solicitud falló',
        message: error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  const openDeleteDialog = (record) => {
    setConfirmState({
      resourceKey: activeView,
      record,
    })
  }

  const handleDelete = async () => {
    if (!confirmState) {
      return
    }

    const config = resourceConfigs[confirmState.resourceKey]
    const id = confirmState.record[config.idKey]
    setSaving(true)
    try {
      await api.remove(config.endpoint, id)
      await loadData()
      setConfirmState(null)
      setToast({
        type: 'success',
        title: `${config.singular} actualizado`,
        message: config.deleteMessage,
      })
    } catch (error) {
      setToast({
        type: 'danger',
        title: 'La solicitud falló',
        message: error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleNavigate = (key) => {
    setActiveView(key)
    setPages((current) => ({ ...current, [key]: 1 }))
  }

  if (!isAuthenticated) {
    return (
      <div className="app app-auth">
        <LoginPage values={loginValues} errors={loginErrors} onChange={handleLoginChange} onSubmit={handleLoginSubmit} />
      </div>
    )
  }

  return (
    <div className="app">
      {mobileSidebarOpen && <button className="sidebar-scrim" type="button" onClick={() => setMobileSidebarOpen(false)} aria-label="Cerrar navegación" />}
      <Sidebar
        activeView={activeView}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onNavigate={handleNavigate}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <main className="main">
        <Topbar
          title={title}
          subtitle={subtitle}
          search={activeQuery}
          onSearch={(value) => {
            setQueries((current) => ({ ...current, [activeView]: value }))
            setPages((current) => ({ ...current, [activeView]: 1 }))
          }}
          onOpenMenu={() => setMobileSidebarOpen(true)}
          onRefresh={loadData}
          onSignOut={handleSignOut}
          health={health}
        />
        {health?.database !== 'connected' && (
          <div className="connection-banner">
            API base: {API_BASE_URL}. Estado de la base de datos: {health?.database || 'desconocido'}.
          </div>
        )}
        <div className="content">
          {activeView === 'dashboard' && <Dashboard data={data} loading={loading} />}
          {resourceConfigs[activeView] && (
            <ResourceView
              resourceKey={activeView}
              data={data}
              query={activeQuery}
              page={pages[activeView] || 1}
              loading={loading}
              onQueryChange={(value) => {
                setQueries((current) => ({ ...current, [activeView]: value }))
                setPages((current) => ({ ...current, [activeView]: 1 }))
              }}
              onPageChange={(page) => setPages((current) => ({ ...current, [activeView]: page }))}
              onCreate={openCreateModal}
              onEdit={openEditModal}
              onDelete={openDeleteDialog}
            />
          )}
          {(activeView === 'reports' || activeView === 'settings') && <PlaceholderView title={title} />}
        </div>
      </main>

      {modalState && (
        <Modal
          title={modalState.record ? `Editar ${resourceConfigs[modalState.resourceKey].singular}` : resourceConfigs[modalState.resourceKey].createLabel}
          onClose={closeModal}
        >
          <ResourceForm
            config={resourceConfigs[modalState.resourceKey]}
            values={formValues}
            errors={formErrors}
            optionData={data}
            saving={saving}
            isEditing={Boolean(modalState.record)}
            onChange={handleFormChange}
            onCancel={closeModal}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}

      {confirmState && (
        <ConfirmDialog
          title={`Confirmar ${resourceConfigs[confirmState.resourceKey].singular}`}
          message={resourceConfigs[confirmState.resourceKey].deleteMessage}
          confirmLabel="Continuar"
          loading={saving}
          onCancel={() => setConfirmState(null)}
          onConfirm={handleDelete}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

export default App
