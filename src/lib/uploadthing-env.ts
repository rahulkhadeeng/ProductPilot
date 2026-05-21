export function assertUploadThingToken() {
  const token = process.env.UPLOADTHING_TOKEN;

  if (!token) {
    throw new Error(
      "Missing UPLOADTHING_TOKEN. Add the UploadThing token from your dashboard to .env."
    );
  }

  if (token.startsWith("sk_")) {
    throw new Error(
      "Invalid UPLOADTHING_TOKEN. This project uses UploadThing v7, which expects the dashboard token, not the old API key/secret value. Copy the full token from UploadThing dashboard settings into .env."
    );
  }
}
