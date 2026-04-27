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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Loader2, Search, Mail, ArrowRight, User, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MessagesPage() {
	const [messages, setMessages] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

	useEffect(() => {
		fetchMessages();
	}, []);

	async function fetchMessages() {
		try {
			const res = await api.get("/chat");
			setMessages(res.data);
		} catch (error) {
			console.error("Failed to fetch messages:", error);
		} finally {
			setLoading(false);
		}
	}

    async function handleDeleteMessage(id: string) {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await api.delete(`/chat/${id}`);
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            alert("Failed to delete message");
        }
    }

    const filteredMessages = messages.filter(m => 
        m.content?.toLowerCase().includes(search.toLowerCase()) || 
        m.sender?.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.receiver?.name?.toLowerCase().includes(search.toLowerCase())
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
					<h2 className="text-3xl font-bold tracking-tight text-white mb-1">Message Logs</h2>
					<p className="text-muted-foreground">Audit and monitor all user communications.</p>
				</div>
                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search messages..." 
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
                            <TableHead className="text-muted-foreground font-bold">Sender & Receiver</TableHead>
                            <TableHead className="text-muted-foreground font-bold">Content</TableHead>
                            <TableHead className="text-muted-foreground font-bold">Type</TableHead>
                            <TableHead className="text-muted-foreground font-bold">Sent At</TableHead>
                            <TableHead className="text-muted-foreground font-bold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMessages.map((msg) => (
                            <TableRow key={msg.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex flex-col items-end">
                                            <p className="text-xs font-bold text-white leading-none">{msg.sender?.name}</p>
                                            <p className="text-[10px] text-muted-foreground">@{msg.sender?.username}</p>
                                        </div>
                                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                            <ArrowRight size={12} />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <p className="text-xs font-bold text-white leading-none">{msg.receiver?.name}</p>
                                            <p className="text-[10px] text-muted-foreground">@{msg.receiver?.username}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[300px]">
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                        <p className="text-sm text-white/90 line-clamp-2 leading-relaxed">
                                            {msg.content}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-widest px-2">
                                        {msg.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs font-medium">
                                    {new Date(msg.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="glass-card border-white/10 text-white min-w-[180px]">
                                            <DropdownMenuLabel className="text-xs text-muted-foreground font-bold uppercase tracking-widest px-3 py-2">Moderation</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2.5 px-3 rounded-lg flex items-center">
                                                <User className="mr-2 h-4 w-4 text-blue-400" />
                                                <span>View Conversation</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2.5 px-3 rounded-lg flex items-center">
                                                <ShieldAlert className="mr-2 h-4 w-4 text-orange-400" />
                                                <span>Flag for Review</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            <DropdownMenuItem 
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 cursor-pointer py-2.5 px-3 rounded-lg"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete Message</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {filteredMessages.length === 0 && (
                    <div className="p-12 text-center">
                        <Mail className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground italic">No messages found matching your criteria.</p>
                    </div>
                )}
            </div>
		</div>
	);
}
