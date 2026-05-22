declare namespace Express {
  export interface Request {
    id?: string;
    user?: {
      id: string;
      role: "CUSTOMER" | "ADMIN";
    };
  }
}

/*
Somewhere inside Express type definitions, there is already something like:

 declare namespace Express {
   export interface Request {
     body: any;
     params: any;
     query: any;
   }
 }

 So we can add the user object to the request object like this:

 declare namespace Express {
   export interface Request {
     user: {
       id: string;
       role: "CUSTOMER" | "ADMIN";
     };
   }
 }

 TypeScript sees:

same namespace
same interface name

Result internally becomes:

interface Request {
  body: any;
  params: any;
  query: any;

  id?: string;

  user?: {
    id: string;
    role: "CUSTOMER" | "ADMIN";
  };
}

THIS IS compile-time merging, not runtime merging.
*/