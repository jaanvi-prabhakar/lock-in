export default function SettingsPage() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Account</h2>
        <div className="space-y-2 text-sm">
          <p>Email: your.email@example.com</p>
          <button className="text-blue-600 hover:underline">Change password</button>
          <button className="text-red-600 hover:underline block">Delete account</button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-blue-500" defaultChecked />
            Email me XP updates
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-blue-500" />
            Push notifications for check-ins
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Preferences</h2>
        <div className="space-y-2 text-sm">
          <label className="block">
            Theme:
            <select className="ml-2 p-1 border rounded">
              <option>System</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </label>
        </div>
      </section>
    </main>
  );
}
