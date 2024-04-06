// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    // Mount your public directory to the root of the server.
    public: '/',
    // Mount your src directory to '/_dist_'.
    src: '/_dist_',
  },
  plugins: [
    // Add plugins as needed, for example, @snowpack/plugin-svelte if you're using Svelte
  ],
  packageOptions: {
    /* Package options are mostly useful for configuring how Snowpack handles third-party packages. */
  },
  devOptions: {
    port: 8080, // Set the port to 8080 for the development server
    open: 'none', // Prevents automatically opening a new browser tab on start
  },
  buildOptions: {
    /* Build options let you configure the output of the `snowpack build` command. */
  },
  proxy: {
    // This is optional: Proxy API requests from the front-end to your backend server.
    // Adjust '/api' if your API endpoint has a different prefix.
    '/api': 'http://localhost:3000',
  },
};
