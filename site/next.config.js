/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd', '@ant-design/icons', 'antd-style', '@gfazioli/mantine-split-pane'],
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  compiler: {
    // Strip semantic data-* attributes in production to prevent DOM-based agent cheating.
    // Preserved: id, data-cb, aria-* attributes.
    // Stripped: data-testid, data-task-id, data-canonical-type, data-library, data-view-mode, data-reference-id,
    //           data-icon-key, data-reference-icon-key (icon match tasks)
    reactRemoveProperties: process.env.NODE_ENV === 'production'
      ? {
          properties: [
            '^data-testid$',
            '^data-task-id$',
            '^data-canonical-type$',
            '^data-library$',
            '^data-view-mode$',
            '^data-reference-id$',
            '^data-icon-key$',
            '^data-reference-icon-key$',
          ],
        }
      : false,
  },
};

module.exports = nextConfig;
