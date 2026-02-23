export default function DashboardPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome back, Sarah!</h1>
        <div className="text-gray-600">{new Date().toLocaleDateString()}</div>
      </div>
    </div>
  );
}
