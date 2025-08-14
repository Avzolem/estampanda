import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function GET() {
  try {
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    const missingVars = [];
    if (!config.cloud_name || config.cloud_name === "your_cloud_name_here") {
      missingVars.push("CLOUDINARY_CLOUD_NAME");
    }
    if (!config.api_key || config.api_key === "your_api_key_here") {
      missingVars.push("CLOUDINARY_API_KEY");
    }
    if (!config.api_secret || config.api_secret === "your_api_secret_here") {
      missingVars.push("CLOUDINARY_API_SECRET");
    }

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: "Cloudinary credentials not configured",
        missingVariables: missingVars,
        instructions: {
          step1: "Go to https://cloudinary.com/console",
          step2: "Copy your Cloud Name, API Key, and API Secret",
          step3: "Update these values in your .env.local file",
          step4: "Restart your development server",
        },
      });
    }

    cloudinary.config(config);

    const testResult = await cloudinary.api.ping();

    const usage = await cloudinary.api.usage();

    return NextResponse.json({
      success: true,
      configured: true,
      message: "Cloudinary is properly configured!",
      cloudName: config.cloud_name,
      apiKeyLast4: config.api_key.slice(-4),
      connectionTest: testResult,
      accountInfo: {
        plan: usage.plan,
        credits: {
          used: usage.credits?.usage || 0,
          limit: usage.credits?.limit || 0,
        },
        storage: {
          used: usage.storage?.usage || 0,
          limit: usage.storage?.limit || 0,
        },
        bandwidth: {
          used: usage.bandwidth?.usage || 0,
          limit: usage.bandwidth?.limit || 0,
        },
      },
      folders: {
        designs: "estampanda/designs",
        users: "estampanda/users",
        mockups: "estampanda/mockups",
      },
    });
  } catch (error) {
    console.error("Cloudinary test error:", error);
    
    if (error.message?.includes("401")) {
      return NextResponse.json({
        success: false,
        configured: true,
        message: "Invalid Cloudinary credentials",
        error: "Authentication failed. Please check your API Key and Secret.",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Cloudinary connection test failed",
      error: error.message,
    });
  }
}