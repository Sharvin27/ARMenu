export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold mb-4">AR Menu Demo</h1>
      <p className="mb-6 text-gray-600">
        Scan food items in Augmented Reality. Best viewed on a mobile device.
      </p>

      <a
        href="/ar"
        className="px-6 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold"
      >
        Launch AR Demo
      </a>
    </div>
  );
}
