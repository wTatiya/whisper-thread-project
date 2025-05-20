
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTickets, getTicketById, updateTicket, addComment, Ticket, Comment } from '@/data/ticketsData';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MessageSquare, Search, RefreshCcw } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTickets = () => {
    try {
      const allTickets = getTickets();
      setTickets(allTickets.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast.error("Failed to load reports");
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSelectTicket = (id: string) => {
    try {
      const ticket = getTicketById(id);
      if (ticket) {
        setSelectedTicket(ticket);
      }
    } catch (error) {
      console.error("Error selecting ticket:", error);
      toast.error("Failed to load report details");
    }
  };

  const handleStatusChange = (status: string) => {
    if (!selectedTicket) return;
    
    try {
      const updatedTicket = {
        ...selectedTicket,
        status: status as 'new' | 'in-progress' | 'resolved' | 'closed'
      };
      
      if (updateTicket(updatedTicket)) {
        setSelectedTicket(updatedTicket);
        loadTickets();
        toast.success(`Status updated to ${status}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newComment.trim()) return;
    
    setLoading(true);
    try {
      const comment = addComment(selectedTicket.id, newComment, true);
      if (comment) {
        setSelectedTicket({
          ...selectedTicket,
          comments: [...selectedTicket.comments, comment]
        });
        
        // Refresh tickets list
        loadTickets();
        
        setNewComment('');
        toast.success("Response sent successfully");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to send response");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">Closed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports Dashboard</h2>
        <Button 
          variant="outline" 
          onClick={loadTickets}
          className="flex items-center"
        >
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-1 h-[32rem] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Reports List</CardTitle>
            <CardDescription>
              {tickets.length} total report{tickets.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow 
                      key={ticket.id}
                      className={selectedTicket?.id === ticket.id ? 'bg-gray-100' : ''}
                    >
                      <TableCell className="text-xs">
                        {format(new Date(ticket.createdAt), 'MM/dd/yy')}
                      </TableCell>
                      <TableCell>
                        {truncateText(ticket.title, 25)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(ticket.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSelectTicket(ticket.id)}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 h-[32rem] flex flex-col">
          {selectedTicket ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{selectedTicket.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={selectedTicket.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardDescription className="pt-2">
                  Report ID: {selectedTicket.id} • Submitted on {formatDate(selectedTicket.createdAt)}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="overflow-auto flex-1 space-y-4">
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Communication Thread</h3>
                  
                  {selectedTicket.comments.length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted-foreground bg-gray-50 rounded-md">
                      No responses yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedTicket.comments.map((comment: Comment) => (
                        <div 
                          key={comment.id} 
                          className={`p-3 rounded-md ${
                            comment.isAdmin 
                              ? 'bg-blue-50 border border-blue-100 mr-4' 
                              : 'bg-gray-50 border border-gray-100 ml-4'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold">
                              {comment.isAdmin ? 'Administrator' : 'Reporter'}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4 bg-gray-50">
                <form onSubmit={handleAddComment} className="w-full">
                  <div className="space-y-2">
                    <label htmlFor="newAdminComment" className="text-sm font-medium">
                      Send Response
                    </label>
                    <Textarea
                      id="newAdminComment"
                      placeholder="Type your response to the reporter..."
                      rows={2}
                      className="resize-none"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full mt-2 bg-whistleblower-navy"
                    disabled={loading || !newComment.trim() || selectedTicket.status === 'closed'}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> Send Response
                  </Button>
                </form>
              </CardFooter>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center p-6">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Report Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a report from the list to view details and respond.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
