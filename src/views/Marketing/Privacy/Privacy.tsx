import { FC } from 'react'
import { Navbar, Footer } from '@/domain/Marketing'
import styles from './Privacy.module.scss'

const Privacy: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.centered}>
        <Navbar />
        <div>
          <h1>Privacy Policy</h1>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Privacy
