import {
  Button,
  Divider,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Layout } from "../../components/Display/Layout";
import { useRedirectToHome } from "../../hooks/useRedirectToHome";
import { routes } from "../../lib/utils";

type FormValues = {
  username: string;
  password: string;
  confirmPassword: string;
};

const SignupPage: NextPage = () => {
  useRedirectToHome();
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { username, password } = values;

    const isValid = Object.keys(values).every((key) => !validate(key));

    if (!isValid) {
      return;
    }

    try {
      await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      router.push(routes.signIn);
    } catch (error) {}
  };

  const validate = (value: string) => {
    switch (value) {
      case "username":
        return Boolean(values.username && values.username.length < 3);
      case "password":
        return Boolean(values.password && values.password.length < 6);
      case "confirmPassword":
        return Boolean(
          values.confirmPassword && values.confirmPassword !== values.password
        );
    }
  };

  return (
    <Layout>
      <Grid
        container
        sx={{ margin: "0 auto" }}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} sm={8}>
          <FormControl>
            <Typography variant="h2" sx={{ mb: 4 }}>
              Create an account
            </Typography>

            <TextField
              error={validate("username")}
              name="username"
              required
              id="outlined-username"
              label="Username"
              value={values.username}
              onChange={handleChange}
            />

            <Divider sx={{ mb: 2, mt: 2 }} />

            <TextField
              required
              error={validate("password")}
              name="password"
              id="outlined-password"
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange}
            />
            <Divider sx={{ mb: 2, mt: 2 }} />

            <TextField
              required
              error={validate("confirmPassword")}
              name="confirmPassword"
              id="outlined-confirm-password"
              label="Confirm Password"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
            />

            <Divider sx={{ mb: 2, mt: 2 }} />

            <Button onClick={handleSubmit} size="large" variant="contained">
              Sign up
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default SignupPage;
