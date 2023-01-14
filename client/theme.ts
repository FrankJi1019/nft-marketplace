import { createTheme } from "@mui/material"

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            text: string;
        };
    }
    interface ThemeOptions {
        status?: {
            text?: string;
        };
    }
}

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
        MuiTextField: {
            defaultProps: {
                size: "small"
            }
        },
        MuiButton: {
            defaultProps: {
                variant: "contained"
            },
            variants: [
                {
                    props: {variant: "outlined"},
                    style: {
                        textTransform: "none"
                    }
                },
                {
                    props: {variant: "text"},
                    style: {
                        textTransform: "none"
                    }
                },
                {
                    props: {variant: "contained"},
                    style: {
                        textTransform: "none"
                    }
                }
            ]
        }
    }
})

export default theme
