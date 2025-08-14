export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Documentation</h1>
      <p className="text-white/80 mt-2">Follow these steps to install and run the loader safely.</p>
      <ol className="list-decimal ml-5 mt-4 space-y-2 text-white/80">
        <li>Disable antivirus or add an exclusion for the install folder.</li>
        <li>Download the loader from the Downloads page.</li>
        <li>Run the loader, login with Discord when prompted.</li>
        <li>Select your game and configure features.</li>
      </ol>
      <h2 className="text-2xl font-semibold mt-8">Support</h2>
      <p className="text-white/80 mt-2">Join our Discord for help and live status updates.</p>
    </div>
  );
}


