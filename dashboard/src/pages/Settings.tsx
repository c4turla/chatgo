import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Shield, Bell, Globe, Save, RefreshCcw, Mail, MessageSquare, AlertTriangle, Key, Download, Trash2, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [config, setConfig] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            const res = await api.get("/settings");
            setConfig(res.data);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            await api.patch("/settings", config);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    }

    const updateConfig = (key: string, value: any) => {
        setConfig((prev: any) => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "api", label: "API & Data", icon: Globe },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Settings</h2>
                    <p className="text-muted-foreground text-sm font-medium">Global application configuration and system administration.</p>
                </div>
                {saved && (
                    <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl animate-in fade-in zoom-in">
                        <Check size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Changes Saved</span>
                    </div>
                )}
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 text-sm font-medium",
                                activeTab === tab.id 
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10" 
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    {activeTab === "general" && (
                        <Card className="glass-card border-none shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-xl font-bold text-white">Application Profile</CardTitle>
                                <CardDescription className="text-muted-foreground">Manage your application's public identity and basic settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">App Name</Label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                            value={config.app_name || "ChatGo Social"}
                                            onChange={(e) => updateConfig("app_name", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Support Email</Label>
                                        <input 
                                            type="email" 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                            value={config.support_email || "admin@chatgo.com"}
                                            onChange={(e) => updateConfig("support_email", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 space-y-6">
                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold text-white">Maintenance Mode</Label>
                                            <p className="text-[11px] text-muted-foreground italic">Temporarily disable access to the app for all non-admin users.</p>
                                        </div>
                                        <Switch 
                                            checked={config.maintenance_mode === "true"} 
                                            onCheckedChange={(val) => updateConfig("maintenance_mode", String(val))} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold text-white">Public Registration</Label>
                                            <p className="text-[11px] text-muted-foreground italic">Allow new users to sign up from the main site.</p>
                                        </div>
                                        <Switch 
                                            checked={config.public_registration !== "false"} 
                                            onCheckedChange={(val) => updateConfig("public_registration", String(val))} 
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button 
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-primary hover:bg-primary/90 text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "security" && (
                        <Card className="glass-card border-none shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-xl font-bold text-white text-red-400">Security Policies</CardTitle>
                                <CardDescription className="text-muted-foreground">Configure global security, session management, and encryption.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold text-white">Strict Session Verification</Label>
                                            <p className="text-[11px] text-muted-foreground italic">Verify IP address and user agent on every request.</p>
                                        </div>
                                        <Switch 
                                            checked={config.strict_session === "true"} 
                                            onCheckedChange={(val) => updateConfig("strict_session", String(val))} 
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold text-white">Global Two-Factor Auth</Label>
                                            <p className="text-[11px] text-muted-foreground italic">Enforce 2FA for all administrative accounts.</p>
                                        </div>
                                        <Switch 
                                            checked={config.global_2fa === "true"} 
                                            onCheckedChange={(val) => updateConfig("global_2fa", String(val))} 
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button 
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-primary hover:bg-primary/90 text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                                        Apply Policies
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "notifications" && (
                        <Card className="glass-card border-none shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-xl font-bold text-white">System Notifications</CardTitle>
                                <CardDescription className="text-muted-foreground">Control how and when admins receive system alerts.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-start justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="flex space-x-4">
                                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                                <Mail size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-sm font-bold text-white">Email Alerts</Label>
                                                <p className="text-[11px] text-muted-foreground">Get daily summaries and critical alerts via email.</p>
                                            </div>
                                        </div>
                                        <Switch 
                                            checked={config.notify_email !== "false"} 
                                            onCheckedChange={(val) => updateConfig("notify_email", String(val))} 
                                        />
                                    </div>

                                    <div className="flex items-start justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="flex space-x-4">
                                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                                <MessageSquare size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-sm font-bold text-white">Push Notifications</Label>
                                                <p className="text-[11px] text-muted-foreground">Real-time browser notifications for new reports.</p>
                                            </div>
                                        </div>
                                        <Switch 
                                            checked={config.notify_push === "true"} 
                                            onCheckedChange={(val) => updateConfig("notify_push", String(val))} 
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button 
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-primary hover:bg-primary/90 text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                                        Update Alerts
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "api" && (
                        <Card className="glass-card border-none shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-xl font-bold text-white">API & Data Management</CardTitle>
                                <CardDescription className="text-muted-foreground">Manage external connections and system data portability.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Admin API Key</Label>
                                    <div className="flex space-x-2">
                                        <div className="relative flex-1">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input 
                                                type="password" 
                                                readOnly 
                                                value={config.api_key || "ck_live_78234902384902384902384"} 
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-sm text-white font-mono"
                                            />
                                        </div>
                                        <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl px-4 h-auto text-xs font-bold" onClick={() => navigator.clipboard.writeText(config.api_key || "")}>
                                            Copy
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                        <div className="flex items-center space-x-3 text-white">
                                            <Download size={20} className="text-primary" />
                                            <h4 className="text-sm font-bold">Export User Data</h4>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">Download a complete CSV of all users and their metadata.</p>
                                        <Button size="sm" variant="outline" className="w-full rounded-lg border-white/10 text-[11px] h-9 font-bold">Download .CSV</Button>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                        <div className="flex items-center space-x-3 text-red-400">
                                            <Trash2 size={20} />
                                            <h4 className="text-sm font-bold">Flush System Cache</h4>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">Clear all server-side caches and temporary session data.</p>
                                        <Button size="sm" variant="outline" className="w-full rounded-lg border-red-500/10 text-red-400 hover:bg-red-500/5 text-[11px] h-9 font-bold">Flush All Cache</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
