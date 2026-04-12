import nextConfig from 'eslint-config-next'

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      // /studio/ uses the Sanity Studio router — <a> is correct, <Link> would break it
      '@next/next/no-html-link-for-pages': 'off',
      // App Router loads fonts in layout.tsx, not pages/_document.js
      '@next/next/no-page-custom-font': 'off',
    },
  },
]

export default eslintConfig
