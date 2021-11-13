import { clientGateway } from '../utils/constants'
import {
  EncryptedMessage,
  JsonWebKeyChain,
  Keychain,
  SymmetricKey
} from '@innatical/inncryption'

type LoginResponse = {
  authorization: string
}

export const login = async (
  values: { email: string; password: string },
  promptForCode: () => Promise<string>
) => {
  const { data: challenge } = await clientGateway.post<{
    challenge: string
    salt: number[]
    encryptedKeychain: EncryptedMessage
  }>('/users/challenge', {
    email: values.email
  })
  const key = await SymmetricKey.generateFromPassword(
    values.password,
    challenge.salt
  )

  const keychain = await Keychain.fromJWKChain(
    (await key.decrypt(challenge.encryptedKeychain)) as JsonWebKeyChain
  )

  const signed = await keychain.signing.sign(challenge.challenge)
  return {
    token: (
      await clientGateway.post<{ token: string }>('/users/login', {
        email: values.email,
        signedChallenge: signed
      })
    ).data?.token,
    keychain
  }
}

export const register = async (values: {
  email: string
  username: string
  password: string
}) => {
  const keychain = await Keychain.generate()
  const salt = SymmetricKey.generateSalt()
  const key = await SymmetricKey.generateFromPassword(values.password, salt)

  return {
    token: (
      await clientGateway.post<{ token: string }>('/users/register', {
        email: values.email,
        username: values.username,
        encryptedKeychain: await key.encrypt(await keychain.toJWKChain()),
        publicKeychain: await keychain.toJWKPublicChain(),
        salt
      })
    ).data?.token,
    keychain
  }
}
