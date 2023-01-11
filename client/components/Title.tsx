import {FC} from "react";
import {Box, Typography} from "@mui/material";

interface TitleProps {
  text: string
}

const Title: FC<TitleProps> = ({text}) => {
  return (
    <Box>
      <Typography variant={"h1"} sx={{fontSize: 50}}>
        {text}
      </Typography>
    </Box>
  )
}

export default Title
