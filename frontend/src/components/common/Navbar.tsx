'use client';

import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import styles from '@/components/common/Navbar.module.css';
import { IoSearch } from 'react-icons/io5';
import { FaRegUserCircle, FaWallet } from 'react-icons/fa';
import { BiMessageSquareDetail, BiSolidMoon } from 'react-icons/bi';
import { MdOutlineFileDownload } from 'react-icons/md';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { toggleChat } = useChat();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/users/login');
      router.refresh();
    } catch (error) {
      console.error('Falha ao fazer logout:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <div className={styles.logo}>
          <Link href="/">Binance Clone</Link>
        </div>
        <div className={styles.navLinks}>
          <div className={styles.navLink}>
            <span>Compre Cripto</span>
          </div>
          <div className={styles.navLink}>
            <Link href="/currency">
              <span>Moedas</span>
            </Link>
          </div>
          <div className={styles.navLink}>
            <Link href="/wallet">
              <span>Carteira</span>
            </Link>
          </div>
          <div className={styles.navLink}>
            <Link href="/wallet/convert">
              <span>Converter</span>
            </Link>
          </div>
          <div className={styles.navLink}>
            <Link href="/users">
              <span>Usuarios</span>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.navRight}>
        {isAuthenticated ? (
          <>
            <button className={styles.iconButton}>
              <IoSearch size={20} />
            </button>
            <button className={styles.depositButton}>
              <MdOutlineFileDownload size={18} />
              Depositar
            </button>
            <div className={styles.separator}></div>
            <div className={styles.iconGroup}>
              <Link href="/users/profile" className={styles.iconButton}>
                <FaRegUserCircle size={20} />
              </Link>
              <Link href="/wallet" className={styles.iconButton}>
                <FaWallet size={20} />
              </Link>
              <button onClick={toggleChat} aria-label="Abrir chat" className={styles.iconButton}>
                <BiMessageSquareDetail size={20} />
              </button>
            </div>
            <div className={styles.separator}></div>
            <div className={styles.iconGroup}>
              <button className={styles.iconButton}>
                <BiSolidMoon size={20} />
              </button>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Sair
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/users/login" className={styles.loginButton}>
              Entrar
            </Link>
            <Link href="/users/create" className={styles.registerButton}>
              Cadastrar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
