import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Mail, ChevronRight, Github } from "lucide-react";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const { data, error: authError } = await authClient.signIn.email({
				email,
				password,
			});

			if (authError) {
				setError(authError.message || "Invalid credentials");
			} else {
				window.location.href = "/";
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full flex bg-background">
            {/* Left Side: Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
                <img 
                    src="/login-bg.png" 
                    alt="Login Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-transparent to-black/60" />
                
                <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                            <span className="text-2xl font-black text-primary">C</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">ChatGo Admin</h1>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-5xl font-black text-white leading-tight mb-6">
                            Manage the future of <span className="text-cyan-300">Discovery.</span>
                        </h2>
                        <p className="text-xl text-white/80 font-medium">
                            The most advanced management portal for real-time community interactions and social networking.
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 text-white/60 text-sm font-medium">
                        <span>© 2026 ChatGo Technologies</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span>Privacy Policy</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-background relative">
                {/* Mobile Background Glows */}
                <div className="lg:hidden absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="lg:hidden absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/5 blur-[80px] -z-10 rounded-full -translate-x-1/2 translate-y-1/2" />

                <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-white tracking-tight">Welcome back</h3>
                        <p className="text-muted-foreground font-medium">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="admin@chatgo.com"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                                    <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in shake duration-300">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl py-7 font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <div className="flex items-center justify-center">
                                    <span>Sign in to Dashboard</span>
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-4 text-muted-foreground font-bold tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="rounded-2xl py-6 border-white/10 hover:bg-white/5 font-bold h-12">
                            <Github className="mr-2 w-5 h-5" />
                            GitHub
                        </Button>
                        <Button variant="outline" className="rounded-2xl py-6 border-white/10 hover:bg-white/5 font-bold h-12">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="mr-2 w-5 h-5" alt="Google" />
                            Google
                        </Button>
                    </div>
                </div>
            </div>
		</div>
	);
}
