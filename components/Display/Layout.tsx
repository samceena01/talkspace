import { Grid, Paper, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import NavigationBar from "../Navigations/NavigationBar";
import { topNavigations } from "../../lib/utils";
import { commonJSXChildrenType } from "../../lib/types";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = (props: LayoutProps) => {
  return (
    <Box>
      <Grid>
        <NavigationBar topNavigations={topNavigations} />
      </Grid>

      <Container sx={{ marginBottom: 16 }}>{props.children}</Container>

      <Paper
        sx={{
          bottom: 0,
          left: 0,
          right: 0,
          position: "fixed",
          padding: "16px",
          textAlign: "center",
        }}
        elevation={3}
      >
        <Typography>
          Copyright, &copy; 2022. All Rights Reserved. TalkSpace Drawing App.
        </Typography>
      </Paper>
    </Box>
  );
};
