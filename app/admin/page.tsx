import AdminAnalytics from "./components/AdminAnalytics";
import AdminSettings from "./components/AdminSettings";

export default function AdminPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black text-[#102013]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#4c616c]">
          System overview and settings
        </p>

        {/* Points Settings */}
        <div className="mt-8">
          <h2 className="text-xl font-extrabold text-[#102013]">
            Points Settings
          </h2>
          <p className="mt-1 text-sm text-[#4c616c]">
            Configure points earned per report condition.
          </p>
          <AdminSettings />
        </div>

        {/* Analytics */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#102013]">
              System Analytics
            </h2>
            <p className="text-xs text-[#4c616c]">Refreshes every 30s</p>
          </div>
          <AdminAnalytics />
        </div>
      </div>
    </div>
  );
}