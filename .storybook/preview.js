import { ThemeProvider } from 'styled-components'
import OctiiTheme from '../src/themes/octii.json'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  layout: 'centered',
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: OctiiTheme.light.backgrounds.primary
      },
      {
        name: 'dark',
        value: OctiiTheme.dark.backgrounds.primary
      }
    ]
  }
}

const getTheme = (themeName) => {
  return OctiiTheme[themeName]
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: ['light', 'dark'],
      showName: true
    }
  }
}

const withThemeProvider = (Story, context) => {
  const theme = getTheme(context.globals.theme)
  return (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  )
}

export const decorators = [withThemeProvider]
