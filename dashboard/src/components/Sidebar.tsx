import { Users, FileText, AlertCircle, MessageSquare, Settings, Home, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const menuItems = [
	{ icon: Home, label: "Overview", href: "/" },
	{ icon: Users, label: "Users", href: "/users" },
	{ icon: FileText, label: "Posts", href: "/posts" },
	{ icon: MessageSquare, label: "Messages", href: "/messages" },
	{ icon: AlertCircle, label: "Reports", href: "/reports" },
];

export function Sidebar() {
    const handleLogout = async () => {
        await authClient.signOut();
        window.location.href = "/login";
    };

	return (
		<div className="w-60 glass border-r h-screen flex flex-col sticky top-0 z-50 overflow-y-auto shrink-0">
			<div className="p-6">
				<div className="flex items-center space-x-2.5 mb-8">
					<div className="w-8 h-8 bg-gradient-to-tr from-primary to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
						<span className="text-sm font-bold text-white">C</span>
					</div>
					<h1 className="text-xl font-bold tracking-tight text-gradient">ChatGo</h1>
				</div>
                
				<nav className="space-y-1">
					{menuItems.map((item) => (
						<NavLink
							key={item.label}
							to={item.href}
							className={({ isActive }) => cn(
								"flex items-center space-x-3 p-2.5 rounded-xl text-muted-foreground hover:text-white transition-all duration-300 group",
								isActive ? "bg-primary/10 text-primary shadow-sm" : "hover:bg-white/5"
							)}
						>
							<item.icon size={18} className={cn("transition-transform duration-300 group-hover:scale-110")} />
							<span className="font-medium text-[13px]">{item.label}</span>
						</NavLink>
					))}
				</nav>
			</div>

			<div className="mt-auto p-6 border-t border-white/5">
				<NavLink
					to="/settings"
					className={({ isActive }) => cn(
						"flex items-center space-x-3 p-2.5 rounded-xl text-muted-foreground hover:text-white transition-all duration-300 mb-2",
						isActive ? "bg-white/5 text-white" : "hover:bg-white/5"
					)}
				>
					<Settings size={18} />
					<span className="font-medium text-[13px]">Settings</span>
				</NavLink>
				<button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                >
					<LogOut size={18} />
					<span className="font-medium text-[13px]">Logout</span>
				</button>
			</div>
		</div>
	);
}
