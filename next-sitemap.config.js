module.exports = {
  siteUrl: process.env.SITE_URL || "https://estampanda.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  exclude: [
    "/twitter-image.*",
    "/opengraph-image.*",
    "/icon.*",
    "/admin",
    "/admin/*",
    "/api/*",
    "/cart",
    "/login",
  ],
  additionalPaths: async (config) => [
    await config.transform(config, "/"),
    await config.transform(config, "/stickers/designer"),
    await config.transform(config, "/stickers/materials"),
    await config.transform(config, "/products"),
    await config.transform(config, "/how-it-works"),
    await config.transform(config, "/precios"),
    await config.transform(config, "/contact"),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/cart", "/login"],
      },
    ],
  },
};
