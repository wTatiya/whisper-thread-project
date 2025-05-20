
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { getTicketByIdAndPassword, addComment, Ticket, Comment } from '@/data/ticketsData';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Lock, Search, MessageSquare } from "lucide-react";

const TicketTracker: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const foundTicket = getTicketByIdAndPassword(ticketId, password);
      if (foundTicket) {
        setTicket(foundTicket);
        toast.success("รายงานพบแล้ว!");
      } else {
        toast.error("ไม่พบรายงานด้วยรหัสและรหัสผ่านที่ให้มา");
        setTicket(null);
      }
    } catch (error) {
      console.error("Error retrieving ticket:", error);
      toast.error("เกิดข้อผิดพลาดในการดึงรายงานของคุณ โปรดลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !newComment.trim()) return;
    try {
      const comment = addComment(ticket.id, newComment, false);
      if (comment) {
        // Update the local ticket state
        setTicket({
          ...ticket,
          comments: [...ticket.comments, comment]
        });
        setNewComment('');
        toast.success("เพิ่มความเห็นสำเร็จ");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("ไม่สามารถเพิ่มความเห็นได้");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">ใหม่</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500">กำลังดำเนินการ</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">แก้ไขแล้ว</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">ปิดเรื่องแล้ว</Badge>;
      default:
        return <Badge>ไม่ทราบสถานะ</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'วันที่ไม่ถูกต้อง';
    }
  };

  const resetTracker = () => {
    setTicket(null);
    setTicketId('');
    setPassword('');
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      {!ticket ? (
        <Card>
          <CardHeader>
            <CardTitle>ติดตามรายงาน</CardTitle>
            <CardDescription>
              ป้อนรหัสรายงานและรหัสผ่านเพื่อดูสถานะและการตอบกลับ
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="ticketId" className="text-sm font-medium">
                  รหัสรายงาน
                </label>
                <Input
                  id="ticketId"
                  placeholder="ป้อนรหัสที่ได้รับเมื่อส่งรายงาน"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">รหัสผ่าน</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="ป้อนรหัสผ่านสำหรับเข้าถึง"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Lock className="w-4 h-4 mr-2" />
                <p>ข้อมูลการติดตามของคุณจะถูกเก็บเป็นความลับและปลอดภัย</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-whistleblower-navy hover:bg-whistleblower-darknavy"
                disabled={isLoading}
              >
                {isLoading ? (
                  "กำลังค้นหา..."
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> ค้นหารายงาน
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">{ticket.title}</CardTitle>
              {getStatusBadge(ticket.status)}
            </div>
            <CardDescription className="pt-2">
              ส่งเมื่อ {formatDate(ticket.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">การสื่อสาร</h3>
              
              {ticket.comments.length === 0 ? (
                <div className="p-3 text-center text-sm text-muted-foreground bg-gray-50 rounded-md">
                  ยังไม่มีการตอบกลับ โปรดกลับมาตรวจสอบในภายหลัง
                </div>
              ) : (
                <div className="space-y-3">
                  {ticket.comments.map((comment: Comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-md ${
                        comment.isAdmin
                          ? 'bg-blue-50 border border-blue-100 ml-4'
                          : 'bg-gray-50 border border-gray-100 mr-4'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold">
                          {comment.isAdmin
                            ? (comment.adminName && comment.adminTitle
                                ? `${comment.adminName} (${comment.adminTitle})`
                                : 'หัวหน้าพยาบาล')
                            : 'คุณ'}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {ticket.status !== 'closed' && (
                <form onSubmit={handleAddComment} className="mt-4">
                  <div className="space-y-2">
                    <label htmlFor="newComment" className="text-sm font-medium">
                      เพิ่มการตอบกลับ
                    </label>
                    <Textarea
                      id="newComment"
                      placeholder="เพิ่มรายละเอียดเพิ่มเติมหรือตอบคำถาม..."
                      rows={3}
                      className="resize-y"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full mt-3 bg-whistleblower-teal hover:bg-teal-500"
                    disabled={!newComment.trim()}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> ส่งข้อความ
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetTracker} variant="outline" className="w-full">
              ติดตามรายงานอื่น
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default TicketTracker;
