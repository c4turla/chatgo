import { useEffect, useState } from "react";
import { Users, FileText, AlertCircle, MessageSquare, TrendingUp, Loader2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function Overview() {
	const [stats, setStats] = useState<any>(null);
	const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [pendingReports, setPendingReports] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

	useEffect(() => {
		async function fetchData() {
			try {
				const [statsRes, usersRes, reportsRes] = await Promise.all([
					api.get("/stats"),
					api.get("/users"),
					api.get("/reports"),
				]);
				setStats(statsRes.data);
				setRecentUsers(usersRes.data.slice(0, 5));
                setPendingReports(reportsRes.data.filter((r: any) => r.status === 'pending').slice(0, 3));
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[70vh]">
				<Loader2 className="w-10 h-10 animate-spin text-primary" />
			</div>
		);
	}

	const statCards = [
		{ label: "Total Users", value: stats?.users || 0, icon: Users, color: "from-blue-500 to-cyan-400" },
		{ label: "Active Posts", value: stats?.posts || 0, icon: FileText, color: "from-emerald-500 to-teal-400" },
		{ label: "Messages", value: stats?.messages || 0, icon: MessageSquare, color: "from-purple-500 to-pink-400" },
		{ label: "Reports", value: stats?.reports || 0, icon: AlertCircle, color: "from-orange-500 to-red-400" },
	];

	return (
		<div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
			<header className="flex items-end justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight text-white mb-1">System Insights</h2>
					<p className="text-muted-foreground text-sm font-medium">Real-time pulse of your community discovery.</p>
				</div>
                <div className="hidden md:block">
                    <Button variant="outline" className="glass-card hover:bg-white/5 rounded-xl px-4 h-10 text-xs font-bold" onClick={() => window.print()}>
                        Export Analytics
                    </Button>
                </div>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{statCards.map((stat) => (
					<Card key={stat.label} className="glass-card border-none overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
						<CardContent className="p-6 relative z-10">
							<div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg shadow-black/20`}>
								    <stat.icon size={20} className="text-white" />
                                </div>
                                <div className="flex items-center space-x-1 text-emerald-400 text-[11px] font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                    <TrendingUp size={10} />
                                    <span>+0%</span>
                                </div>
							</div>
							<div>
								<p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-0.5">{stat.label}</p>
								<p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<Card className="glass-card border-none shadow-2xl">
					<CardHeader className="p-6 pb-0">
						<CardTitle className="text-lg font-bold text-white flex items-center">
                            <Users className="w-5 h-5 mr-2 text-primary" />
                            Recent Registrations
                        </CardTitle>
					</CardHeader>
					<CardContent className="p-6 pt-4 space-y-4">
						{recentUsers.map((user) => (
							<div key={user.id} className="flex items-center justify-between group cursor-pointer">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/5 flex items-center justify-center overflow-hidden">
										<img 
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                                            alt="avatar" 
                                            className="w-full h-full object-cover"
                                        />
									</div>
									<div>
										<p className="font-semibold text-white text-sm group-hover:text-primary transition-colors">{user.name}</p>
										<p className="text-[11px] text-muted-foreground font-medium">@{user.username} • {new Date(user.createdAt).toLocaleDateString()}</p>
									</div>
								</div>
								<Button variant="ghost" size="sm" className="rounded-lg h-8 text-[11px] font-bold hover:bg-white/5 text-muted-foreground hover:text-white" onClick={() => navigate('/users')}>
                                    Manage
                                </Button>
							</div>
						))}
                        {recentUsers.length === 0 && <p className="text-center text-muted-foreground py-4 text-xs">No users found.</p>}
                        <Button variant="link" className="w-full text-muted-foreground hover:text-white text-xs h-8 font-bold" onClick={() => navigate('/users')}>
                            View All Directory
                        </Button>
					</CardContent>
				</Card>

				<Card className="glass-card border-none shadow-2xl bg-orange-500/[0.02]">
					<CardHeader className="p-6 pb-0">
						<CardTitle className="text-lg font-bold text-orange-400 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Pending Reports
                        </CardTitle>
					</CardHeader>
					<CardContent className="p-6 pt-4 space-y-4">
						{pendingReports.map((report) => (
							<div key={report.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-400/20 transition-all duration-300">
								<div className="flex justify-between items-start mb-3">
                                    <p className="font-semibold text-white text-sm">New {report.postId ? 'Post' : 'User'} Report</p>
                                    <span className="text-[9px] uppercase tracking-wider font-bold bg-orange-400/10 text-orange-400 px-2 py-0.5 rounded-full animate-pulse">Action Required</span>
                                </div>
								<p className="text-xs text-muted-foreground mb-4 line-clamp-2 italic leading-relaxed">"{report.reason}"</p>
								<div className="flex space-x-2">
									<Button className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 h-9 text-xs font-bold transition-all active:scale-95" onClick={() => navigate('/reports')}>Review Details</Button>
									<Button variant="outline" className="flex-1 rounded-xl glass-card h-9 border-white/10 hover:bg-white/5 text-xs font-bold" onClick={() => navigate('/reports')}>Ignore</Button>
								</div>
							</div>
						))}
                        {pendingReports.length === 0 && (
                            <div className="py-12 text-center">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Loader2 className="w-6 h-6 text-emerald-400" />
                                </div>
                                <p className="text-muted-foreground italic text-sm">All reports are cleared. Good job!</p>
                            </div>
                        )}
                        {pendingReports.length > 0 && (
                            <Button variant="link" className="w-full text-muted-foreground hover:text-white text-xs h-8 font-bold" onClick={() => navigate('/reports')}>
                                Go to Resolution Center
                            </Button>
                        )}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
