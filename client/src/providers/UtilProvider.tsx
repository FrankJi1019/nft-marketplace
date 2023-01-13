import {Alert, Box, Button, IconButton, Snackbar} from "@mui/material";
import {createContext, FC, ReactNode, useContext, useState} from "react";
import CloseIcon from '@mui/icons-material/Close';

interface UtilProviderProps {
  children: ReactNode
}

interface ContextValue {
  notify: (message: string) => void
}

const context = createContext({
  notify: () => {}
} as ContextValue)

const UtilProvider: FC<UtilProviderProps> = ({children}) => {

  const [notificationMessage, setNotificationMessage] = useState("")

  return (
    <context.Provider
      value={{
        notify: (message: string) => setNotificationMessage(message)
      }}
    >
      <Snackbar
        anchorOrigin={{vertical: "top", horizontal: "right"}}
        open={Boolean(notificationMessage)}
        autoHideDuration={5 * 1000}
        onClose={() => setNotificationMessage("")}
      >
        <Alert severity={"success"} sx={{display: "flex", alignItems: "center"}}>
          {notificationMessage}
          <IconButton onClick={() => setNotificationMessage("")} sx={{pl: 1}}>
            <CloseIcon />
          </IconButton>
        </Alert>
      </Snackbar>
      {children}
    </context.Provider>
  )
}

export default UtilProvider

export const useUtil = () => useContext(context)
