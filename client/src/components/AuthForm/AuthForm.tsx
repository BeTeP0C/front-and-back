'use client';

import { useState, FormEvent } from 'react';
import styles from './AuthForm.module.scss';

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (data: { email: string; password: string; first_name: string; last_name: string }) => Promise<void>;
  error: string | null;
  loading: boolean;
}

export default function AuthForm({ onLogin, onRegister, error, loading }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await onLogin(email, password);
    } else {
      await onRegister({ email, password, first_name: firstName, last_name: lastName });
    }
  };

  const toggle = () => {
    setIsLogin(!isLogin);
    setEmail(''); setPassword(''); setFirstName(''); setLastName('');
  };

  return (
    <div className={styles.auth}>
      <div className={styles.container}>
        <h1 className={styles.logo}>TechStore</h1>
        <p className={styles.subtitle}>{isLogin ? 'Войдите в аккаунт' : 'Создайте аккаунт'}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input className={styles.input} placeholder="Имя" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} required />
              <input className={styles.input} placeholder="Фамилия" value={lastName}
                onChange={(e) => setLastName(e.target.value)} required />
            </>
          )}
          <input className={styles.input} type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <input className={styles.input} type="password" placeholder="Пароль" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={6} />

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className={styles.toggle}>
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          <button type="button" className={styles.toggleBtn} onClick={toggle}>
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
}
