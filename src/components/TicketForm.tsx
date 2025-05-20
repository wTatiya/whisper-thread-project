
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Lock, Shield } from "lucide-react";
import { addTicket } from '@/data/ticketsData';
import { toast } from 'sonner';

const TicketForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    ticketId?: string;
    password?: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate inputs
      if (!title.trim()) {
        toast.error("Please provide a title for your report.");
        setIsSubmitting(false);
        return;
      }
      
      if (!description.trim()) {
        toast.error("Please provide details for your report.");
        setIsSubmitting(false);
        return;
      }
      
      // Submit the ticket
      const { ticket, password } = addTicket(title, description);
      
      // Show success message with ticket ID and password
      setSubmissionResult({
        success: true,
        ticketId: ticket.id,
        password: password
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      toast.success("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error("There was an error submitting your report. Please try again.");
      setSubmissionResult({
        success: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionResult(null);
    setTitle('');
    setDescription('');
  };

  if (submissionResult?.success) {
    return (
      <Card className="w-full max-w-md mx-auto animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center text-green-600">Report Submitted</CardTitle>
          <CardDescription className="text-center">
            Your report has been submitted anonymously
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-50 rounded-md mb-4 border border-green-200">
            <p className="font-bold mb-2">Please save this information securely:</p>
            <p className="mb-2">
              <span className="font-semibold">Report ID:</span> {submissionResult.ticketId}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Access Password:</span> {submissionResult.password}
            </p>
            <div className="flex items-center text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <p className="text-sm">You will need both to check for responses or updates.</p>
            </div>
          </div>
          <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
            <Lock className="w-4 h-4 mr-1" />
            <p>This information is not stored anywhere except in your browser's local storage.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={resetForm} 
            className="w-full bg-whistleblower-navy hover:bg-whistleblower-darknavy"
          >
            Submit Another Report
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>Submit an Anonymous Report</CardTitle>
        <CardDescription>
          Your identity will be kept confidential
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Report Subject
            </label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Report Details
            </label>
            <Textarea
              id="description"
              placeholder="Provide as much relevant information as possible..."
              rows={6}
              className="resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 mr-2" />
            <p>Your submission is anonymous. No personal data is collected.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-whistleblower-navy hover:bg-whistleblower-darknavy"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TicketForm;
