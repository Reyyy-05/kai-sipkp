import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    position?: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      position: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    position: string;
  }
}
