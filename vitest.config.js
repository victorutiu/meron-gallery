import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    exclude: [
      "e2e/**",
      "node_modules/**",
      "test-results/**"
    ],
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "server.js",
        "graphql/**"
      ]
    }
  }
})