'use client';

import { useRouter } from 'next/navigation';
import HeroSection from '@/components/common/HeroSection';
import FeatureGrid from '@/components/common/FeatureGrid';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.pageWrapper}>
      <HeroSection />
      <button 
        onClick={() => router.push('/users')}
        className="btn text-white">Usuários</button> 
        {/* TODO: Mover essa merda de botão pra navbar,
          gambiarra pra teste apenas. */}
      <FeatureGrid />
    </div>
  )
}