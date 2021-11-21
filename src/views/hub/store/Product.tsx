import { Button } from '@/components/Form'
import { Header } from '@/components/Layout'
import styles from './Product.module.scss'
import { faChevronCircleLeft } from '@fortawesome/pro-solid-svg-icons'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Auth } from '@/state/auth'
import { getProduct } from '../../community/remote'
import { clientGateway } from '../../../utils/constants'
import { getPurchases } from '../../../user/remote'
import { BarLoader } from 'react-spinners'
import { useState, FC } from 'react'
import queryClient from '../../../utils/queryClient'

const Product: FC = () => {
  const auth = Auth.useContainer()
  const history = useHistory()
  const { productID } = useParams<{ productID: string }>()
  const { data: product } = useQuery(
    ['product', productID, auth.token],
    getProduct
  )
  const { data: purchases } = useQuery(
    ['purchases', auth.id, auth.token],
    getPurchases
  )

  const [loading, setLoading] = useState(false)
  return (
    <div className={styles.product}>
      <Header
        icon={faChevronCircleLeft}
        heading={product?.name ?? ''}
        subheading={'Store'}
        className={styles.backHeader}
        color={'secondary'}
        onClick={() => history.push('/hub/store')}
      />
      {product?.banner ? (
        <img
          className={styles.banner}
          src={product?.banner}
          alt={product?.banner}
        />
      ) : (
        <div className={styles.banner} />
      )}
      <div className={styles.main}>
        <div className={styles.info}>
          <h1>{product?.name}</h1>
          <h2>{product?.tagline}</h2>
          <p>{product?.description}</p>
        </div>
        <div className={styles.card}>
          <h1>Purchase</h1>
          <Button
            type='button'
            disabled={loading || !!purchases?.find((p) => p.id === productID)}
            onClick={async () => {
              try {
                setLoading(true)
                await clientGateway.post(
                  `/products/${productID}/purchase`,
                  {},
                  {
                    headers: {
                      Authorization: auth.token
                    }
                  }
                )
                await queryClient.refetchQueries([
                  'purchases',
                  auth.id,
                  auth.token
                ])
              } finally {
                setLoading(false)
              }
            }}
          >
            {loading ? (
              <BarLoader color='#ffffff' />
            ) : purchases?.find((p) => p.id === productID) ? (
              'Owned'
            ) : (
              'Get'
            )}
          </Button>
          <p>By purchasing this product, you agree to the Octii store TOS.</p>
        </div>
      </div>
    </div>
  )
}

export default Product
