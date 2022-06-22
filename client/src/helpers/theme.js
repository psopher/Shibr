import { yellow, grey, teal, pink, purple, orange, blueGrey  } from '@mui/material/colors'

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // palette values for light mode
        primary: orange,
        secondary: purple,
        text: {
          primary: grey[900],
          secondary: grey[900],
        },
        background: {
          default: '#e1e1e1',
          paper: '#ffffff',
        },
      }
      : {
        // palette values for dark mode
        primary: yellow,
        secondary: pink,
        text: {
          primary: grey[100],
          secondary: grey[100],
        },
        background: {
          default: teal[300],
          paper: blueGrey[900],
        },
      }),
  },
  typography: {
    fontFamily: 'Lato, Saira, Oxygen, Raleway, Arial',
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h1',
          h3: 'h1',
          h4: 'h2',
          h5: 'h2',
          h6: 'h2',
          subtitle1: 'p',
          subtitle2: 'p',
          body1: 'span',
          body2: 'span',
        },
      },
    },
  },
})

export default getDesignTokens