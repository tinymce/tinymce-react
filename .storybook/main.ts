export default {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  core: {
    disableTelemetry: true
  },
  docs: {
    autodocs: "tag",
  },
  framework: {
    name: "@storybook/react-vite",
    options: {}
  }
};