"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CareerPlanDialogProps {
  trigger?: React.ReactNode;
}

interface CareerData {
  major: string | null;
  interests: string[];
  hobbies: string[];
  dreamJob: string | null;
  careerPlans: string[];
}

export function CareerPlanDialog({ trigger }: CareerPlanDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CareerData>({
    major: "",
    interests: [],
    hobbies: [],
    dreamJob: "",
    careerPlans: [],
  });
  const [newInterest, setNewInterest] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [newCareerPlan, setNewCareerPlan] = useState("");

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const response = await fetch("/api/client/navbar/career");
        const data = await response.json();
        if (response.ok) {
          setFormData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch career data:", error);
      }
    };

    if (isOpen) {
      fetchCareerData();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/client/navbar/career", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast({
        title: "Success",
        description: "Career plan updated successfully",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update career plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field: 'interests' | 'hobbies' | 'careerPlans', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      if (field === 'interests') setNewInterest('');
      if (field === 'hobbies') setNewHobby('');
      if (field === 'careerPlans') setNewCareerPlan('');
    }
  };

  const removeItem = (field: 'interests' | 'hobbies' | 'careerPlans', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>My Career Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Major */}
          <div className="space-y-2">
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              value={formData.major || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
              placeholder="Enter your major"
            />
          </div>

          {/* Dream Job */}
          <div className="space-y-2">
            <Label htmlFor="dreamJob">Dream Job</Label>
            <Input
              id="dreamJob"
              value={formData.dreamJob || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, dreamJob: e.target.value }))}
              placeholder="What's your dream job?"
            />
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label htmlFor="interests">Interests</Label>
            <div className="flex gap-2">
              <Input
                id="interests"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('interests', newInterest);
                  }
                }}
              />
              <Button type="button" onClick={() => addItem('interests', newInterest)}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.interests.map((interest, index) => (
                <Badge key={index} variant="info" className="flex items-center gap-1">
                  {interest}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeItem('interests', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Hobbies */}
          <div className="space-y-2">
            <Label htmlFor="hobbies">Hobbies</Label>
            <div className="flex gap-2">
              <Input
                id="hobbies"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                placeholder="Add a hobby"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('hobbies', newHobby);
                  }
                }}
              />
              <Button type="button" onClick={() => addItem('hobbies', newHobby)}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.hobbies.map((hobby, index) => (
                <Badge key={index} variant="info" className="flex items-center gap-1">
                  {hobby}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeItem('hobbies', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

        {/* Career Plans */}
        <div className="space-y-2">
        <Label htmlFor="careerPlans">Career Plans</Label>
        <div className="space-y-2">
            <Textarea
            id="careerPlans"
            value={formData.careerPlans.join('\n')}
            onChange={(e) => {
                const plans = e.target.value.split('\n').filter(plan => plan.trim());
                setFormData(prev => ({
                ...prev,
                careerPlans: plans
                }));
            }}
            placeholder="Describe your career plans..."
            className="min-h-[120px] resize-none"
            />
        </div>
        </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}