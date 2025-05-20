
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TicketForm from "@/components/TicketForm";
import TicketTracker from "@/components/TicketTracker";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("submit");
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="whistleblower-container">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-whistleblower-navy mb-4">
            สายตรงถึงหัวหน้าพยาบาล
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ส่งเรื่องร้องทุกข์และติดตามรายงานโดยไม่ต้องเปิดเผยตัวตน ไม่ต้องใช้เบอร์โทรศัพท์หรืออีเมล เพียงเก็บรหัสรายงานไว้เพื่อติดตามความคืบหน้า และใช้สำหรับสื่อสารกับหัวหน้าพยาบาลโดยตรงในระบบที่ปลอดภัย ตัวตนของคุณจะยังคงเป็นความลับตลอดกระบวนการ
          </p>
        </header>

        <div className="max-w-md mx-auto mb-8">
          <Tabs defaultValue="submit" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submit">ส่งรายงาน</TabsTrigger>
              <TabsTrigger value="track">ติดตามรายงาน</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="submit" className="m-0">
                <TicketForm />
              </TabsContent>
              <TabsContent value="track" className="m-0">
                <TicketTracker />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <footer className="text-center mt-12 text-sm text-gray-500">
          <div className="flex justify-center mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin" className="flex items-center text-whistleblower-navy">
                <Shield className="mr-2 h-4 w-4" />
                Administrator Access
              </Link>
            </Button>
          </div>
          <p>
            This platform is designed to protect your anonymity. No personal information is collected.
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} Whistleblower Reporting Platform
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
