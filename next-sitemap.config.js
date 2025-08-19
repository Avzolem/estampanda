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
    "/api/*"
  ],
  additionalPaths: async (config) => [
    await config.transform(config, "/"),
    await config.transform(config, "/stickers/designer"),
    await config.transform(config, "/stickers/gallery"),
    await config.transform(config, "/stickers/materials"),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
  },
};
