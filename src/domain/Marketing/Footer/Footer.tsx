import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { StyledFooter, StyledFooterSocials } from './Footer.style'

const Footer: FC = () => {
  return (
    <StyledFooter>
      <StyledFooterSocials>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://twitter.com/innatical'
          title='Twitter'
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://discord.gg/XTFJF5pNSG '
          title='Discord'
        >
          <FontAwesomeIcon icon={faDiscord} />
        </a>
      </StyledFooterSocials>
      <p>
        Made with{' '}
        <span role='img' aria-label='heart'>
          ❤️
        </span>{' '}
        in California & Minnesota
      </p>
      <h3>© 2021 Innatical LLC</h3>
    </StyledFooter>
  )
}

export default Footer
