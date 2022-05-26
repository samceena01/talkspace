import { nanoid } from "nanoid";

type Navigation = {
  requiresAuth?: boolean;
};

export interface ITopNavigation extends Navigation {
  label: string;
  href: string;
}

export const routes = {
  home: "main",
  profile: "profile",
  create: "create",
  signIn: "/api/auth/signin",
  signUp: "/auth/signup",
};

export const topNavigations: ITopNavigation[] = [
  {
    href: routes.home,
    label: "Home",
  },
  {
    href: routes.create,
    label: "Create",
    requiresAuth: true,
  },
];

export const randomId = (size = 8) => {
  const id = nanoid(size);
  return id.replace(/_/g, "-").toLowerCase();
};
