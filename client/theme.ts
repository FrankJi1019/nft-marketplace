import { createTheme } from "@mui/material"

const theme = createTheme({
    palette: {
        primary: {
            main: "#C4D7F2",
            dark: "#96b8e8"
        },
        secondary: {
            main: "#AFDEDC",
            dark: "#92d3cf"
        }
    },
    components: {
        MuiButton: {
            defaultProps: {
                variant: "contained"
            }
        }
    }
})

export default theme
