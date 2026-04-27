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
import { MoreHorizontal, Trash2, Loader2, Search, Eye, Heart, MessageCircle, MapPin, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PostsPage() {
	const [posts, setPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

	useEffect(() => {
		fetchPosts();
	}, []);

	async function fetchPosts() {
		try {
			const res = await api.get("/posts");
			setPosts(res.data);
		} catch (error) {
			console.error("Failed to fetch posts:", error);
		} finally {
			setLoading(false);
		}
	}

    async function handleDeletePost(id: string) {
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
        try {
            await api.delete(`/posts/admin/${id}`);
            setPosts(posts.filter(p => p.id !== id));
            setIsViewOpen(false);
        } catch (error) {
            alert("Failed to delete post");
        }
    }

    const filteredPosts = posts.filter(p => 
        p.caption?.toLowerCase().includes(search.toLowerCase()) || 
        p.author?.name?.toLowerCase().includes(search.toLowerCase())
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
					<h2 className="text-3xl font-bold tracking-tight text-white mb-1">Post Management</h2>
					<p className="text-muted-foreground">Monitor and moderate community content.</p>
				</div>
                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search posts..." 
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
                            <TableHead className="text-muted-foreground font-bold">Content</TableHead>
                            <TableHead className="text-muted-foreground font-bold">Author</TableHead>
                            <TableHead className="text-muted-foreground font-bold text-center">Engagement</TableHead>
                            <TableHead className="text-muted-foreground font-bold">Date</TableHead>
                            <TableHead className="text-muted-foreground font-bold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPosts.map((post) => (
                            <TableRow key={post.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <TableCell className="max-w-[300px]">
                                    <div className="flex items-center space-x-3">
                                        {post.mediaUrl && (
                                            <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 border border-white/5">
                                                <img src={post.mediaUrl} alt="post" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="overflow-hidden">
                                            <p className="text-sm text-white truncate font-medium">{post.caption || 'No caption'}</p>
                                            <p className="text-[10px] text-muted-foreground flex items-center mt-1">
                                                <MapPin size={10} className="mr-1" />
                                                {post.locationName || 'Unknown location'}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                                             <img 
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username}`} 
                                                alt="avatar" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="text-xs text-white/90">{post.author?.name}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center space-x-3">
                                        <span className="flex items-center text-[11px] text-muted-foreground">
                                            <Heart size={12} className="mr-1 text-red-400" />
                                            {post.likeCount}
                                        </span>
                                        <span className="flex items-center text-[11px] text-muted-foreground">
                                            <MessageCircle size={12} className="mr-1 text-blue-400" />
                                            {post.commentCount}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs font-medium">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="glass-card border-white/10 text-white min-w-[160px]">
                                            <DropdownMenuItem 
                                                onClick={() => { setSelectedPost(post); setIsViewOpen(true); }}
                                                className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2.5 px-3 rounded-lg flex items-center"
                                            >
                                                <Eye className="mr-2 h-4 w-4 text-cyan-400" />
                                                <span>View Post</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            <DropdownMenuItem 
                                                onClick={() => handleDeletePost(post.id)}
                                                className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 cursor-pointer py-2.5 px-3 rounded-lg"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete Post</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Post View Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="glass-card border-none text-white max-w-3xl p-0 overflow-hidden">
                    <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
                        {selectedPost?.mediaUrl ? (
                            <div className="md:w-3/5 bg-black/40 flex items-center justify-center p-4">
                                <img src={selectedPost.mediaUrl} alt="Post media" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                            </div>
                        ) : (
                            <div className="md:w-3/5 bg-white/5 flex items-center justify-center p-12">
                                <p className="text-muted-foreground italic text-sm">Text-only post</p>
                            </div>
                        )}
                        <div className="flex-1 flex flex-col p-8 bg-background/50">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPost?.author?.username}`} 
                                        alt="avatar" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-white leading-none">{selectedPost?.author?.name}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">@{selectedPost?.author?.username}</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <p className="text-white/90 text-sm leading-relaxed">{selectedPost?.caption}</p>
                                <div className="pt-4 space-y-2 border-t border-white/5">
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <MapPin size={12} className="mr-2" />
                                        {selectedPost?.locationName || 'No location attached'}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Calendar size={12} className="mr-2" />
                                        {selectedPost ? new Date(selectedPost.createdAt).toLocaleString() : ''}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between gap-4">
                                <div className="flex space-x-4">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white">{selectedPost?.likeCount}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">Likes</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white">{selectedPost?.commentCount}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">Comments</p>
                                    </div>
                                </div>
                                <Button variant="destructive" className="rounded-xl h-10 px-6 font-bold text-xs" onClick={() => handleDeletePost(selectedPost.id)}>
                                    Delete Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
		</div>
	);
}
