import { StoreFeatured, StoreHeader } from '@/domain/Hub'
import styles from './Store.module.scss'
import { useMedia } from 'react-use'
import { Header } from '@/components/Layout'
import { useHistory } from 'react-router-dom'
import { FC } from 'react'

const Store: FC = () => {
  const isMobile = useMedia('(max-width: 740px)')
  const history = useHistory()
  return (
    <div className={styles.store}>
      {isMobile && (
        <>
          <Header
            heading='Store'
            subheading='Hub'
            onBack={() => history.push('/hub')}
          />
          <br />
        </>
      )}
      <StoreHeader />
      <StoreFeatured />
    </div>
  )
}

export default Store