import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Shield, User as UserIcon, Trash2, Loader2, Search, Calendar, Mail, MapPin, Hash, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
	const [users, setUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

	useEffect(() => {
		fetchUsers();
	}, []);

	async function fetchUsers() {
		try {
			const res = await api.get("/users");
			setUsers(res.data);
		} catch (error) {
			console.error("Failed to fetch users:", error);
		} finally {
			setLoading(false);
		}
	}

    async function handleUpdateRole(id: string, newRole: string) {
        try {
            await api.patch(`/users/${id}/role`, { role: newRole });
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            if (selectedUser?.id === id) setSelectedUser({ ...selectedUser, role: newRole });
        } catch (error) {
            alert("Failed to update role");
        }
    }

    async function handleDeleteUser(id: string) {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            setIsProfileOpen(false);
        } catch (error) {
            alert("Failed to delete user");
        }
    }

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(search.toLowerCase()) || 
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase())
    );

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[70vh]">
				<Loader2 className="w-10 h-10 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-700">
			<header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h2 className="text-3xl font-bold tracking-tight text-white mb-1">User Management</h2>
					<p className="text-muted-foreground">Manage accounts, roles, and permissions.</p>
				</div>
                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
			</header>

            <div className="glass-card rounded-2xl overflow-hidden border-none shadow-2xl">
                <Table>
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="text-muted-foreground font-bold">User</TableHead>
                            <TableHead className="text-muted-foreground font-bold">Role</TableHead>
                            <TableHead className="text-muted-foreground font-bold">Joined</TableHead>
                            <TableHead className="text-muted-foreground font-bold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/5 flex items-center justify-center overflow-hidden">
                                            <img 
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                                                alt="avatar" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">{user.name}</p>
                                            <p className="text-[11px] text-muted-foreground">@{user.username || 'n/a'}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={
                                        user.role === 'admin' ? "bg-primary/20 text-primary border-primary/20" : "bg-white/5 text-muted-foreground border-white/10"
                                    }>
                                        {user.role === 'admin' ? <Shield size={10} className="mr-1" /> : <UserIcon size={10} className="mr-1" />}
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs font-medium">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="glass-card border-white/10 text-white min-w-[180px]">
                                            <DropdownMenuLabel className="text-xs text-muted-foreground font-bold uppercase tracking-widest px-3 py-2">Quick Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            <DropdownMenuItem 
                                                onClick={() => { setSelectedUser(user); setIsProfileOpen(true); }}
                                                className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2.5 px-3 rounded-lg flex items-center"
                                            >
                                                <Info className="mr-2 h-4 w-4 text-cyan-400" />
                                                <span>View Full Profile</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => handleUpdateRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                                                className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2.5 px-3 rounded-lg flex items-center"
                                            >
                                                <Shield className="mr-2 h-4 w-4 text-primary" />
                                                <span>Make {user.role === 'admin' ? 'User' : 'Admin'}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            <DropdownMenuItem 
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 cursor-pointer py-2.5 px-3 rounded-lg"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete Account</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Profile Detail Dialog */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="glass-card border-none text-white max-w-2xl p-0 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-primary/30 to-cyan-500/20 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-3xl bg-background p-1.5 border border-white/10 shadow-2xl">
                                <div className="w-full h-full rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser?.username}`} 
                                        alt="avatar" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-16 p-8 space-y-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">{selectedUser?.name}</h3>
                                <p className="text-muted-foreground text-sm font-medium">@{selectedUser?.username} • {selectedUser?.role}</p>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" className="glass-card border-white/10 h-10 px-4 rounded-xl text-xs font-bold" onClick={() => handleUpdateRole(selectedUser?.id, selectedUser?.role === 'admin' ? 'user' : 'admin')}>
                                    Change Role
                                </Button>
                                <Button className="bg-red-500 hover:bg-red-600 text-white h-10 px-4 rounded-xl text-xs font-bold" onClick={() => handleDeleteUser(selectedUser?.id)}>
                                    Suspend
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 text-sm">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-white/90">{selectedUser?.email}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-white/90">Joined {selectedUser ? new Date(selectedUser.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : ''}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm">
                                    <Hash className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-white/90 text-xs font-mono">{selectedUser?.id}</span>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">User Bio</p>
                                <p className="text-sm text-white/80 leading-relaxed italic">
                                    {selectedUser?.bio || "No biography provided by user."}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-2xl font-bold text-white">0</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Posts</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-2xl font-bold text-white">0</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Friends</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-2xl font-bold text-white">0</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Reports</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
		</div>
	);
}
