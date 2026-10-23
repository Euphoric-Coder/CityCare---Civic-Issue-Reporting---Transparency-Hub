import {
  Users,
  Shield,
  Zap,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Mail,
} from "lucide-react";

export function ProvisioningStats({ overview }) {
  const monthlyQuota = overview?.monthlyQuota || {
    yearMonth: new Date().toISOString().slice(0, 7),
    count: 0,
    limit: 1000,
    remaining: 1000,
    isLimitReached: false,
  };

  const percentUsed = Math.min(
    100,
    Math.round(((monthlyQuota.count || 0) / (monthlyQuota.limit || 1000)) * 100)
  );

  const stats = [
    {
      label: "Total Accounts",
      value: overview?.totalProvisioned || 0,
      subtext: "Pre-provisioned across system",
      icon: Users,
      gradient: "from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800/60",
      iconBg: "bg-blue-500 text-white",
    },
    {
      label: "Unit Officers",
      value: overview?.unitOfficersCount || 0,
      subtext: "Department ward leads",
      icon: Shield,
      gradient: "from-cyan-500/10 to-teal-500/10 border-cyan-200 dark:border-cyan-800/60",
      iconBg: "bg-cyan-500 text-white",
    },
    {
      label: "Field Officers",
      value: overview?.fieldOfficersCount || 0,
      subtext: "Ground resolution teams",
      icon: Zap,
      gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800/60",
      iconBg: "bg-emerald-500 text-white",
    },
    {
      label: "City Admins",
      value: overview?.cityAdminsCount || 0,
      subtext: "Municipal administrators",
      icon: Building2,
      gradient: "from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800/60",
      iconBg: "bg-purple-500 text-white",
    },
    {
      label: "Pending First Login",
      value: overview?.pendingFirstLogin || 0,
      subtext: "Temporary credentials active",
      icon: Clock,
      gradient: "from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800/60",
      iconBg: "bg-amber-500 text-white",
    },
    {
      label: "Active Accounts",
      value: overview?.activeAccounts || 0,
      subtext: "Approved & active officers",
      icon: CheckCircle2,
      gradient: "from-emerald-500/10 to-green-500/10 border-emerald-200 dark:border-emerald-800/60",
      iconBg: "bg-emerald-600 text-white",
    },
    {
      label: "Disabled Accounts",
      value: overview?.disabledAccounts || 0,
      subtext: "Access restricted",
      icon: XCircle,
      gradient: "from-rose-500/10 to-red-500/10 border-rose-200 dark:border-rose-800/60",
      iconBg: "bg-rose-500 text-white",
    },
    {
      label: "Bulk Imports",
      value: overview?.totalImportsCount || 0,
      subtext: "CSV onboarding operations",
      icon: FileSpreadsheet,
      gradient: "from-sky-500/10 to-blue-500/10 border-sky-200 dark:border-sky-800/60",
      iconBg: "bg-sky-500 text-white",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Monthly Resend Quota Tracker */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl text-indigo-300 shrink-0 shadow-sm">
              <Mail size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black tracking-wide">
                  Monthly Resend Provisioning Quota
                </h4>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 font-mono">
                  {monthlyQuota.yearMonth}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Automatic onboarding email delivery via Resend capped at 1,000 provisioned officers & admins per month
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-start sm:self-auto">
            <div className="text-left sm:text-right">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Monthly Used</div>
              <div className="text-xl font-black text-white mt-0.5 font-mono">
                <span className="text-emerald-400">{(monthlyQuota.count || 0).toLocaleString()}</span>
                <span className="text-slate-500 text-sm font-normal"> / {(monthlyQuota.limit || 1000).toLocaleString()}</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Remaining</div>
              <div
                className={`text-xl font-black font-mono mt-0.5 ${
                  monthlyQuota.remaining <= 0
                    ? "text-rose-400"
                    : monthlyQuota.remaining < 100
                    ? "text-amber-400"
                    : "text-cyan-400"
                }`}
              >
                {(monthlyQuota.remaining ?? 1000).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 relative z-10">
          <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                monthlyQuota.remaining <= 0
                  ? "bg-rose-500"
                  : monthlyQuota.remaining < 100
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
              }`}
              style={{
                width: `${percentUsed}%`,
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mt-2">
            <span>{percentUsed}% quota consumed this month</span>
            <span>{monthlyQuota.remaining ?? 1000} slots remaining until monthly reset</span>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-white dark:bg-slate-900/90 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 ${stat.gradient}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-2.5 sm:p-3 rounded-2xl shadow-sm ${stat.iconBg}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-2 truncate">
                {stat.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
