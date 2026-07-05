function Loader({ label = 'Cargando' }) {
  return (
    <div className="loader" role="status">
      <span aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

export default Loader
