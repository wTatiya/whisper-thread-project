
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyAdminPassword } from '@/data/ticketsData';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLoginSuccess: (username: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const adminData = verifyAdminPassword(username, password);
      if (adminData) {
        toast.success("เข้าสู่ระบบสำเร็จ!");
        onLoginSuccess(username);
      } else {
        toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("เกิดข้อผิดพลาดขณะเข้าสู่ระบบ กรุณาลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>Administrator Login</CardTitle>
        <CardDescription>
          Sign in to manage whistleblower reports
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-whistleblower-navy hover:bg-whistleblower-darknavy"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdminLogin;
