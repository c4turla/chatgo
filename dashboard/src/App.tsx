import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Overview from "./pages/Overview";
import UsersPage from "./pages/Users";
import PostsPage from "./pages/Posts";
import MessagesPage from "./pages/Messages";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";
import { authClient } from "./lib/auth-client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function App() {
    const { data: session, isPending, error } = authClient.useSession();

    useEffect(() => {
        if (error) {
            console.error("Auth session error:", error);
        }
    }, [error]);

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground text-xs animate-pulse">Initializing Dashboard...</p>
            </div>
        );
    }

    const isAuthenticated = !!session;
    const isAdmin = session?.user?.role === "admin";

    if (isAuthenticated && !isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background p-8 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
                    <span className="text-4xl">🚫</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-muted-foreground mb-8 max-w-md">Your account does not have administrator privileges. Please contact the system owner if you believe this is an error.</p>
                <Button onClick={() => authClient.signOut().then(() => window.location.href = "/login")}>
                    Back to Login
                </Button>
            </div>
        );
    }

	return (
		<Router>
			<div className="flex bg-background h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
                {!isAuthenticated ? (
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                ) : (
                    <>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/5 blur-[100px] -z-10 rounded-full -translate-x-1/2 translate-y-1/2" />
                        
                        <Sidebar />
                        <main className="flex-1 p-12 overflow-y-auto max-w-[1600px] mx-auto">
                            <Routes>
                                <Route path="/" element={<Overview />} />
                                <Route path="/users" element={<UsersPage />} />
                                <Route path="/posts" element={<PostsPage />} />
                                <Route path="/messages" element={<MessagesPage />} />
                                <Route path="/reports" element={<ReportsPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="*" element={
                                    <div className="flex flex-col items-center justify-center h-[70vh] text-muted-foreground animate-in fade-in zoom-in duration-500">
                                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                                            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">Module under construction</h3>
                                        <p>We're polishing this section for a better experience.</p>
                                    </div>
                                } />
                            </Routes>
                        </main>
                    </>
                )}
			</div>
		</Router>
	);
}

function Button({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-2xl font-bold transition-all"
        >
            {children}
        </button>
    )
}

export default App;
