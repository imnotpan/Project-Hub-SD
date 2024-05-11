import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = ({}) => {
  const [RegisterPageData, setRegisterPageData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegisterPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterPageData({
      ...RegisterPageData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !RegisterPageData.username ||
      !RegisterPageData.email ||
      !RegisterPageData.password
    ) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(RegisterPageData.email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }

    try {
      const url = `http://localhost:8000/user/register?user_name=${RegisterPageData.username}&user_email=${RegisterPageData.email}&user_password=${RegisterPageData.password}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Usuario registrado exitosamente.');
        navigate('/login');
      } else {
        console.error('Error al registrar usuario:', response.statusText);
        setError(`El correo ${RegisterPageData.email} ya tiene cuenta`);
      }
    } catch (error: any) {
      console.error('Error de red:', error.message);
    }
  };

  return (
    <div
      className="text-light p-4 container d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh' }}
    >
      <div
        className="card p-4  text-light"
        style={{ backgroundColor: '#303339', width: '50%' }}
      >
        <h2 className="mb-4 text-center">
          ¡Te damos la bienvenida a Project Hub!
        </h2>
        <h3 className="text-center">Crear una cuenta</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              className="form-control"
              onChange={handleRegisterPageChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleRegisterPageChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleRegisterPageChange}
            />
          </div>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <button
              type="submit"
              className="btn text-white w-100"
              style={{ backgroundColor: '#5864f2' }}
            >
              Registrarse
            </button>
            <span
              style={{ color: 'red', display: 'block', marginTop: '0.5rem' }}
            >
              {error}
            </span>
          </div>
        </form>
        <p className="mt-3 text-center">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-light">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;