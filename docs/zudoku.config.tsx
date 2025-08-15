import type { ZudokuConfig } from "zudoku";

/**
 * Developer Portal Configuration
 * For more information, see:
 * https://zuplo.com/docs/dev-portal/zudoku/configuration/overview
 */
const config: ZudokuConfig = {
  site: {
    title: "My Developer Portal",
    logo: {
      src: {
        light: "https://cdn.zuplo.com/assets/my-dev-portal-light.svg",
        dark: "https://cdn.zuplo.com/assets/my-dev-portal-dark.svg",
      },
    },
  },
  metadata: {
    title: "Developer Portal",
    description: "Developer Portal",
  },
  navigation: [
    {
      type: "category",
      label: "Documentation",
      items: [
        {
          type: "category",
          label: "Getting Started",
          icon: "sparkles",
          items: [
            {
              type: "doc",
              file: "introduction",
            },
            {
              type: "doc",
              file: "markdown",
            },
          ],
        },
        {
          type: "category",
          label: "Useful Links",
          collapsible: false,
          icon: "link",
          items: [
            {
              type: "link",
              label: "Zuplo Docs",
              to: "https://zuplo.com/docs/dev-portal/introduction",
            },
            {
              type: "link",
              label: "Developer Portal Docs",
              to: "https://zuplo.com/docs/dev-portal/introduction",
            },
          ],
        },
      ],
    },
    {
      type: "link",
      to: "/api",
      label: "API Reference",
    },
  ],
  redirects: [{ from: "/", to: "/api" }],
  apis: [
    {
      type: "file",
      input: "../config/routes.oas.json",
      path: "api",
    },
  ],
  authentication: {
    type: "supabase",
    provider: "google", // or any supported provider
    supabaseUrl: "https://gyokusiqtjaeofzkkkkd.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5b2t1c2lxdGphZW9memtra2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDcxNzcsImV4cCI6MjA3MDgyMzE3N30.4uxPtnWPAX8_0E8_q45ZfEWzQZ0ZKoiwwyeQYKXrkwQ",
    redirectToAfterSignUp: "/",
    redirectToAfterSignIn: "/",
    redirectToAfterSignOut: "/",
  },
 apiKeys: {
    enabled: true,
    deploymentName: process.env.ZUPLO_PUBLIC_DEPLOYMENT_NAME, // Note: Only required for local development
    createKey: async ({ apiKey, context, auth }) => {
      // process.env.ZUPLO_PUBLIC_SERVER_URL is only required for local development
      // import.meta.env.ZUPLO_SERVER_URL is automatically set when using a deployed environment, you do not need to set it
      const serverUrl = process.env.ZUPLO_PUBLIC_SERVER_URL || import.meta.env.ZUPLO_SERVER_URL; 
      const createApiKeyRequest = new Request(serverUrl + "/v1/developer/api-key", {
        method: "POST",
        body: JSON.stringify({
          ...apiKey,
          email: auth.profile?.email,
          metadata: {
            userId: auth.profile?.sub,
            name: auth.profile?.name,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const createApiKey = await fetch(
        await context.signRequest(createApiKeyRequest),
      );

      if (!createApiKey.ok) {
        throw new Error("Could not create API Key");
      } 

      return true;
    },
    // Get all consumers (API key holders) for the authenticated user
    getConsumers: async (context) => {
      const serverUrl = process.env.ZUPLO_PUBLIC_SERVER_URL || import.meta.env.ZUPLO_SERVER_URL;
      
      const request = new Request(serverUrl + "/v1/developer/get-consumers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await fetch(await context.signRequest(request));

      if (!response.ok) {
        throw new Error(`Failed to get consumers: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
  },
};

export default config;
