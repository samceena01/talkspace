import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { signOut } from "next-auth/react";
// import AdbIcon from '@mui/icons-material/Adb';
import Link from "next/link";
import * as React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";
import { ITopNavigation, routes } from "../../lib/utils";

type NavigationBarPropsType = {
  topNavigations: ITopNavigation[];
};

type NavMenuItemProps = {
  href?: string;
  label: string;
  onMenuItemClick: () => void;
};

const NavMenuItem = (props: NavMenuItemProps) => {
  return (
    <MenuItem onClick={props.onMenuItemClick}>
      <Typography textAlign="center">
        {props.href ? (
          <Link href={props.href}>
            <a>{props.label}</a>
          </Link>
        ) : (
          props.label
        )}
      </Typography>
    </MenuItem>
  );
};

const NavigationBar = (props: NavigationBarPropsType) => {
  const { topNavigations } = props;

  const isAuthenticated = useAuth();
  const loggedUser = useUser();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#e0e0e0",
        marginBottom: "30px",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {topNavigations.map((menuItem) => {
              if (!isAuthenticated && menuItem.requiresAuth) return null;
              return (
                <Button
                  key={menuItem.label}
                  onClick={handleCloseNavMenu}
                  sx={{
                    color: "#202020",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  <Link href={`/${menuItem.href}`}>
                    <a>{menuItem.label}</a>
                  </Link>
                </Button>
              );
            })}
          </Box>

          {!isAuthenticated ? (
            <Box sx={{ flexGrow: 0 }}>
              <Button>
                <Link href={routes.signIn}>
                  <a>Sign In</a>
                </Link>
              </Button>
              <Button>
                <Link href={routes.signUp}>
                  <a>Sign Up</a>
                </Link>
              </Button>
            </Box>
          ) : null}
          {isAuthenticated ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Profile">
                <Typography
                  onClick={handleOpenUserMenu}
                  color="GrayText"
                  sx={{ userSelect: "none", cursor: "pointer" }}
                >
                  {loggedUser}{" "}
                  <IconButton sx={{ p: 0 }}>
                    <AccountCircleIcon />
                  </IconButton>
                </Typography>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {isAuthenticated ? (
                  <NavMenuItem
                    onMenuItemClick={() => {
                      signOut();
                      handleCloseNavMenu();
                    }}
                    label="Sign Out"
                  />
                ) : null}

                {!isAuthenticated ? (
                  <NavMenuItem
                    onMenuItemClick={handleCloseNavMenu}
                    href={routes.signIn}
                    label="Sign In"
                  />
                ) : null}
              </Menu>
            </Box>
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavigationBar;
