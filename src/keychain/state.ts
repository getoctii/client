import { createContainer } from '@innatical/innstate'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Keychain as KeychainType } from '@innatical/inncryption'

const useKeychain = () => {
  const [keychain, setKeychain] = useState<KeychainType | null>()

  useEffect(() => {
    ;(async () => {
      if (keychain) {
        localStorage.setItem(
          'keychain',
          JSON.stringify(await keychain.toJWKChain())
        )
      } else if (keychain === null) {
        localStorage.removeItem('keychain')
      }
    })()
  }, [keychain])

  useEffect(() => {
    ;(async () => {
      const keychain = localStorage.getItem('keychain')

      if (keychain)
        setKeychain(await KeychainType.fromJWKChain(JSON.parse(keychain)))
    })()
  }, [])

  return { keychain, setKeychain }
}

export const Keychain = createContainer(useKeychain)
