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
    DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Loader2, Search, AlertCircle, CheckCircle2, XCircle, User, FileText, Calendar, ShieldCheck, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
	const [reports, setReports] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

	useEffect(() => {
		fetchReports();
	}, []);

	async function fetchReports() {
		try {
			const res = await api.get("/reports");
			setReports(res.data);
		} catch (error) {
			console.error("Failed to fetch reports:", error);
		} finally {
			setLoading(false);
		}
	}

    async function handleUpdateStatus(id: string, newStatus: string) {
        try {
            await api.patch(`/reports/${id}/status`, { status: newStatus });
            setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
            if (selectedReport?.id === id) setSelectedReport({ ...selectedReport, status: newStatus });
        } catch (error) {
            alert("Failed to update status");
        }
    }

    async function handleDeleteReport(id: string) {
        if (!confirm("Are you sure you want to delete this report record?")) return;
        try {
            await api.delete(`/reports/${id}`);
            setReports(reports.filter(r => r.id !== id));
            setIsViewOpen(false);
        } catch (error) {
            alert("Failed to delete report");
        }
    }

    const filteredReports = reports.filter(r => 
        r.reason?.toLowerCase().includes(search.toLowerCase()) || 
        r.reporter?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.reportedUser?.name?.toLowerCase().includes(search.toLowerCase())
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
					<h2 className="text-3xl font-bold tracking-tight text-white mb-1">Moderation Reports</h2>
					<p className="text-muted-foreground">Review and resolve community reports.</p>
				</div>
                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search reports..." 
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
                            <TableHead className="text-muted-foreground font-bold">Status</TableHead>
                            <TableHead className="text-muted-foreground font-bold">Reporter</TableHead>
                            <TableHead className="text-muted-foreground font-bold">Reason</TableHead>
                            <TableHead className="text-muted-foreground font-bold">Type</TableHead>
                            <TableHead className="text-muted-foreground font-bold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReports.map((report) => (
                            <TableRow key={report.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <TableCell>
                                    <Badge variant="outline" className={cn(
                                        "text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5",
                                        report.status === 'pending' ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
                                        report.status === 'resolved' ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
                                        "text-red-400 bg-red-400/10 border-red-400/20"
                                    )}>
                                        {report.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-xs text-white/90 font-medium">{report.reporter?.name}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[250px]">
                                    <p className="text-sm text-white/80 truncate italic">"{report.reason}"</p>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-white/5 text-[10px] text-muted-foreground border-white/10 uppercase">
                                        {report.postId ? "Post" : "User"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="glass-card border-white/10 text-white min-w-[180px]">
                                            <DropdownMenuItem 
                                                onClick={() => { setSelectedReport(report); setIsViewOpen(true); }}
                                                className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2.5 px-3 rounded-lg flex items-center"
                                            >
                                                <AlertCircle className="mr-2 h-4 w-4 text-cyan-400" />
                                                <span>Review Details</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            <DropdownMenuItem 
                                                onClick={() => handleUpdateStatus(report.id, 'resolved')}
                                                className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2.5 px-3 rounded-lg flex items-center"
                                            >
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" />
                                                <span>Mark Resolved</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                                                className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2.5 px-3 rounded-lg flex items-center"
                                            >
                                                <XCircle className="mr-2 h-4 w-4 text-red-400" />
                                                <span>Dismiss Report</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            <DropdownMenuItem 
                                                onClick={() => handleDeleteReport(report.id)}
                                                className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 cursor-pointer py-2.5 px-3 rounded-lg"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete Record</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {filteredReports.length === 0 && (
                    <div className="p-12 text-center">
                        <ShieldCheck className="w-12 h-12 text-emerald-400/20 mx-auto mb-4" />
                        <p className="text-muted-foreground italic">No reports found. Everything looks clean!</p>
                    </div>
                )}
            </div>

            {/* Report View Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="glass-card border-none text-white max-w-xl p-8 overflow-hidden">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold flex items-center space-x-3">
                            <Flag className="text-primary w-6 h-6" />
                            <span>Report Details</span>
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reporter</p>
                                <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <User size={16} className="text-primary" />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold truncate">{selectedReport?.reporter?.name}</p>
                                        <p className="text-[10px] text-muted-foreground">@{selectedReport?.reporter?.username}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reported {selectedReport?.postId ? "Post Content" : "User"}</p>
                                <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                    {selectedReport?.postId ? <FileText size={16} className="text-cyan-400" /> : <User size={16} className="text-orange-400" />}
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold truncate">
                                            {selectedReport?.postId ? `Post ID: ${selectedReport.postId.slice(0, 8)}...` : selectedReport?.reportedUser?.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {selectedReport?.postId ? "Moderation required" : `@${selectedReport?.reportedUser?.username}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Report Reason</p>
                            <p className="text-base text-white/90 leading-relaxed italic">
                                "{selectedReport?.reason}"
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center space-x-4">
                                <Calendar size={18} className="text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-white/90 font-medium">Submitted On</p>
                                    <p className="text-[11px] text-muted-foreground">{selectedReport ? new Date(selectedReport.createdAt).toLocaleString() : ''}</p>
                                </div>
                            </div>
                            <Badge variant="outline" className={cn(
                                "text-[10px] uppercase font-bold tracking-widest px-3 py-1",
                                selectedReport?.status === 'pending' ? "text-orange-400 border-orange-400/20" :
                                selectedReport?.status === 'resolved' ? "text-emerald-400 border-emerald-400/20" :
                                "text-red-400 border-red-400/20"
                            )}>
                                {selectedReport?.status}
                            </Badge>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button 
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 font-bold transition-all"
                                onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                            >
                                <CheckCircle2 size={18} className="mr-2" />
                                Resolve
                            </Button>
                            <Button 
                                variant="outline" 
                                className="flex-1 border-white/10 text-white hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/20 rounded-xl h-12 font-bold transition-all"
                                onClick={() => handleUpdateStatus(selectedReport.id, 'dismissed')}
                            >
                                <XCircle size={18} className="mr-2" />
                                Dismiss
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
		</div>
	);
}
