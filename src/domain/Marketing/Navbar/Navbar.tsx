import { useCurrentUser } from '@/hooks/users'
import { FC } from 'react'
import { Link } from 'react-location'
import {
  StyledNavbar,
  StyledNavbarButton,
  StyledNavbarMarketing,
  StyledNavbarTitle
} from './Navbar.style'

const Navbar: FC = () => {
  const user = useCurrentUser()
  return (
    <StyledNavbar>
      <StyledNavbarMarketing>
        <picture>
          <img alt='Octii' src='/logo.svg' />
        </picture>
        <Link to='/home'>
          <StyledNavbarTitle>Octii</StyledNavbarTitle>
        </Link>
      </StyledNavbarMarketing>
      <Link to='/login'>
        <StyledNavbarButton>{user?.username ?? 'Login'}</StyledNavbarButton>
      </Link>
    </StyledNavbar>
  )
}

export default Navbar
