declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      JWT_SECRET: string;
      PORT: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
