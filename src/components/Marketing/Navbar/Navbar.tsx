import { Auth } from '@/views/authentication/state'
import styles from './Navbar.module.scss'
import { useCurrentUser } from '@/user/state'
import { FC } from 'react'
import { Link } from 'react-location'

const Navbar: FC = () => {
  const auth = Auth.useContainer()
  const user = useCurrentUser()
  console.log(auth)
  return (
    <div className={styles.navbar}>
      <div className={styles.marketing}>
        <picture>
          <img alt='Octii' src='/logo.svg' />
        </picture>
      </div>
      <Link to='/home' className={styles.title}>
        Octii
      </Link>
      <Link to='/login' className={styles.button}>
        {user?.username ?? 'Login'}
      </Link>
    </div>
  )
}

export default Navbar
