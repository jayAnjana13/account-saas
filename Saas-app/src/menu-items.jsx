export const MENU = {
  items: [
    {
      id: "signin",
      title: "SignIn",
      type: "item",
      url: "/signin",
    },
    {
      id: "signup",
      title: "SignUp",
      type: "item",
      url: "/signup",
    },
    {
      id: "verifying",
      title: "Verifying",
      type: "item",
      url: "/verifying/:token",
    },
    {
      id: "forgotPassword",
      title: "ForgotPassword",
      type: "item",
      url: "/forgot-password",
    },
    {
      id: "logout",
      title: "LogOut",
      type: "item",
      url: "/logout",
    },
    {
      id: "home",
      title: "Home",
      type: "item",
      url: "/home",
    },
    {
      id: "dashboard",
      title: "Dashboard",
      type: "item",
      url: "/dashboard",
    },
    {
      id: "clients",
      title: "Clients",
      type: "group",
      children: [
        {
          id: "client-list",
          title: "Client List",
          type: "item",
          url: "/clients/client-list",
        },
      ],
    },
    {
      id: "billings",
      title: "Billings",
      type: "group",
      children: [
        {
          id: "invoices",
          title: "Dashboard",
          type: "item",
          url: "/billings/dashboard",
        },
        {
          id: "invoices",
          title: "Invoices",
          type: "item",
          url: "/billings/invoices",
        },
        {
          id: "invoices",
          title: "Invoices",
          type: "item",
          url: "/billings/client-invoices",
        },
      ],
    },
    {
      id: "profile",
      title: "Profile",
      type: "group",
      children: [
        {
          id: "profile",
          title: "Profile",
          type: "item",
          url: "/profiles/profile",
        },
      ],
    },
  ],
};
