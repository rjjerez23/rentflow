function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  type = 'button',
  className = '',
  title,
  'aria-label': ariaLabel,
  ...props
}) {
  const iconLabel = size === 'icon' && typeof children === 'string' ? children : undefined

  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      title={title || iconLabel}
      aria-label={ariaLabel || iconLabel}
      {...props}
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  )
}

export default Button
