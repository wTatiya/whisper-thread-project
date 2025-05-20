
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyAdminPassword } from '@/data/ticketsData';
import { toast } from 'sonner';
import { Shield } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real application, this would be a secure authentication system
      // For demo purposes, we're using a simple password check
      if (verifyAdminPassword(password)) {
        toast.success("Login successful!");
        onLoginSuccess();
      } else {
        toast.error("Invalid administrator password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("There was an error during login. Please try again.");
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
            <label htmlFor="password" className="text-sm font-medium">
              Administrator Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter administrator password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 mr-2" />
            <p>For demo purposes, the password is: admin123</p>
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
