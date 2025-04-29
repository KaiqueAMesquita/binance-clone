import Header from '../components/common/Header';
import HeroSection from '@/components/common/HeroSection';
import FeatureGrid from '@/components/common/FeatureGrid';
import styles from './page.module.css'
export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      <HeroSection />
      <FeatureGrid />
    </div>
  )
}