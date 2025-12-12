'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import styles from '@/components/common/Navbar.module.css';
import { IoSearch } from 'react-icons/io5';
import { FaRegUserCircle, FaWallet, FaBars, FaTimes } from 'react-icons/fa';
import { BiMessageSquareDetail, BiSolidMoon } from 'react-icons/bi';
import { MdOutlineFileDownload } from 'react-icons/md';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { toggleChat } = useChat();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    // Define o estado inicial
    handleResize();

    // Adiciona o listener para mudanças de tamanho
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

        {/* HAMBURGUER */}
        <button className={styles.mobileMenuButton} onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* MENU EXCLUSIVO DESKTOP */}
        <div className={styles.navLinks}>
          <Link href="/buy-crypto" className={styles.navLink}>Compre Cripto</Link>
          <Link href="/currency" className={styles.navLink}>Moedas</Link>
          <Link href="/wallet" className={styles.navLink}>Carteira</Link>
          <Link href="/wallet/convert" className={styles.navLink}>Converter</Link>
          <Link href="/users" className={styles.navLink}>Usuários</Link>
        </div>
      </div>

      {/* DESKTOP - LADO DIREITO */}
      <div className={styles.navRight}>
        {isAuthenticated ? (
          <>
            <button className={styles.iconButton}><IoSearch size={20} /></button>
            <Link href="/deposit" className={styles.depositButton}>
              <MdOutlineFileDownload size={18} />
              Depositar
            </Link>
            <div className={styles.separator}></div>
            <div className={styles.iconGroup}>
              <Link href="/users/profile" className={styles.iconButton}><FaRegUserCircle size={20} /></Link>
              <Link href="/wallet" className={styles.iconButton}><FaWallet size={20} /></Link>
              <button onClick={toggleChat} className={styles.iconButton}>
                <BiMessageSquareDetail size={20} />
              </button>
            </div>
            <div className={styles.separator}></div>
            <div className={styles.iconGroup}>
              <button className={styles.iconButton}><BiSolidMoon size={20} /></button>
              <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
            </div>
          </>
        ) : (
          <>
            <Link href="/users/login" className={styles.loginButton}>Entrar</Link>
            <Link href="/users/create" className={styles.registerButton}>Cadastrar</Link>
          </>
        )}
      </div>

      {/* MOBILE MENU UNIFICADO */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <Link href="/buy-crypto" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Compre Cripto</Link>
        <Link href="/currency" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Moedas</Link>
        <Link href="/wallet" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Carteira</Link>
        <Link href="/wallet/convert" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Converter</Link>
        <Link href="/users" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Usuários</Link>

        {!isAuthenticated && (
          <>
            <Link href="/users/login" className={styles.loginButton} onClick={() => setIsMenuOpen(false)}>Entrar</Link>
            <Link href="/users/create" className={styles.registerButton} onClick={() => setIsMenuOpen(false)}>Cadastrar</Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <button className={styles.iconButton}><IoSearch size={20} /></button>
            <Link href="/deposit" className={styles.depositButton}>
              <MdOutlineFileDownload size={18} /> Depositar
            </Link>
            <Link href="/users/profile" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Perfil</Link>
            <Link href="/wallet" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Carteira</Link>
            <button onClick={toggleChat} className={styles.navLink}>Chat</button>
            <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
          </>
        )}
      </div>
    </nav>
  );
}
