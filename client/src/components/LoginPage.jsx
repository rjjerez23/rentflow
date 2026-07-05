import { Car } from 'lucide-react'
import Button from './Button'
import Card from './Card'
import Input from './Input'

function LoginPage({ values, errors, onChange, onSubmit }) {
  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="login-brand">
          <div className="login-brand-mark">
            <Car size={20} aria-hidden="true" />
          </div>
          <strong>DriveFlow</strong>
        </div>

        <div className="login-panel-header">
          <h1>Iniciar sesión</h1>
          <p>Accede al panel de administración.</p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <Input
            label="Usuario"
            name="username"
            value={values.username}
            onChange={(event) => onChange('username', event.target.value)}
            error={errors.username}
            autoComplete="username"
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={values.password}
            onChange={(event) => onChange('password', event.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          {errors.form && <p className="form-error">{errors.form}</p>}

          <Button type="submit" className="login-submit">
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage
