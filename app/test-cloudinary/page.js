import UploadDesign from "@/components/UploadDesign";

export const metadata = {
  title: "Test Cloudinary Upload - Estampanda",
  description: "Test page for Cloudinary integration",
};

export default function TestCloudinaryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Test Cloudinary Upload
          </h1>
          <p className="text-gray-600">
            Upload a test image to verify Cloudinary integration
          </p>
        </div>

        <UploadDesign
          onUploadComplete={(design) => {
            console.log("Upload complete:", design);
          }}
        />

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">
              ⚠️ Important: Configure Cloudinary First
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              Before testing, update your Cloudinary credentials in .env.local:
            </p>
            <ul className="text-sm text-yellow-700 space-y-1 ml-4">
              <li>• CLOUDINARY_CLOUD_NAME</li>
              <li>• CLOUDINARY_API_KEY</li>
              <li>• CLOUDINARY_API_SECRET</li>
            </ul>
            <p className="text-sm text-yellow-700 mt-3">
              Get these from your{" "}
              <a
                href="https://cloudinary.com/console"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                Cloudinary Dashboard
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              📝 Test Instructions
            </h3>
            <ol className="text-sm text-blue-700 space-y-2 ml-4 list-decimal">
              <li>Update .env.local with your Cloudinary credentials</li>
              <li>Restart the development server (npm run dev)</li>
              <li>Upload a test image using the form above</li>
              <li>Check the browser console for upload results</li>
              <li>Verify the image appears in your Cloudinary Media Library</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}