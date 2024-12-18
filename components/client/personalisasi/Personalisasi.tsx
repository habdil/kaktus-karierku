"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type FormData = {
  major: string;
  interests: string[];
  hobbies: string[];
  dreamJob: string;
  currentStatus: string;
  skills: string[];
  strengths: string[];
  challenges: string[];
  workValues: string[];
  preferredWorkEnvironment: string;
};

interface CareerPersonalizationFormProps {
  setSubmitting: (value: boolean) => void;
}

const CareerPersonalizationForm = ({ setSubmitting }: CareerPersonalizationFormProps) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    major: "",
    interests: [],
    hobbies: [],
    dreamJob: "",
    currentStatus: "",
    skills: [],
    strengths: [],
    challenges: [],
    workValues: [],
    preferredWorkEnvironment: "",
  });
  
  const [tempInputs, setTempInputs] = useState({
    interests: "",
    hobbies: "",
    skills: "",
    strengths: "",
    challenges: "",
    workValues: "",
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayItemAdd = (field: keyof typeof tempInputs) => {
    if (tempInputs[field].trim()) {
      const fieldName = field as keyof FormData;
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] as string[]), tempInputs[field].trim()]
      }));
      setTempInputs(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayItemRemove = (field: keyof FormData, index: number) => {
    if (Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index)
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: keyof typeof tempInputs) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleArrayItemAdd(field);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const assessmentData = {
        answers: formData,
        clientId: "client-id", // TODO: Get from auth context
      };

      const response = await fetch("/api/client/career-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) throw new Error("Failed to submit assessment");
      router.push("/dashboard/career/results");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setSubmitting(false);
    }
  };

  const renderArrayInput = (field: keyof typeof tempInputs, label: string, placeholder: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={tempInputs[field]}
          onChange={e => setTempInputs(prev => ({ ...prev, [field]: e.target.value }))}
          onKeyPress={e => handleKeyPress(e, field)}
        />
        <Button 
          type="button" 
          onClick={() => handleArrayItemAdd(field)}
          variant="outline"
        >
          Tambah
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <AnimatePresence>
          {Array.isArray(formData[field as keyof FormData]) && (formData[field as keyof FormData] as string[]).map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Badge 
                variant="info" 
                className="pl-2 pr-1 py-1 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              >
                {item}
                <Button
                  type="button"
                  onClick={() => handleArrayItemRemove(field as keyof FormData, index)}
                  variant="ghost"
                  size="sm"
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Personalisasi Karir</CardTitle>
        <CardDescription>
          Langkah {step} dari {totalSteps} - Mari mulai perjalanan karir Anda
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="major">Jurusan/Program Studi</Label>
              <Input
                id="major"
                placeholder="Contoh: Teknik Informatika"
                value={formData.major}
                onChange={(e) => handleInputChange("major", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentStatus">Status Saat Ini</Label>
              <Select
                value={formData.currentStatus}
                onValueChange={(value) => handleInputChange("currentStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status Anda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Mahasiswa</SelectItem>
                  <SelectItem value="fresh_graduate">Fresh Graduate</SelectItem>
                  <SelectItem value="employed">Sudah Bekerja</SelectItem>
                  <SelectItem value="job_seeker">Mencari Kerja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {renderArrayInput("interests", "Minat", "Tambahkan minat Anda")}
            {renderArrayInput("hobbies", "Hobi", "Tambahkan hobi Anda")}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {renderArrayInput("skills", "Keterampilan", "Tambahkan keterampilan Anda")}
            {renderArrayInput("strengths", "Keunggulan", "Tambahkan keunggulan Anda")}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            {renderArrayInput("workValues", "Nilai Kerja", "Tambahkan nilai kerja yang Anda pegang")}
            <div className="space-y-2">
              <Label htmlFor="preferredWorkEnvironment">Lingkungan Kerja yang Diinginkan</Label>
              <Select
                value={formData.preferredWorkEnvironment}
                onValueChange={(value) => handleInputChange("preferredWorkEnvironment", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih lingkungan kerja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="corporate">Korporat</SelectItem>
                  <SelectItem value="government">Pemerintahan</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="remote">Remote/WFH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dreamJob">Pekerjaan Impian</Label>
              <Textarea
                id="dreamJob"
                placeholder="Ceritakan pekerjaan impian Anda dan mengapa Anda tertarik dengan pekerjaan tersebut"
                value={formData.dreamJob}
                onChange={(e) => handleInputChange("dreamJob", e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Sebelumnya
        </Button>

        {step < totalSteps ? (
          <Button onClick={handleNext} className="text-white">
            Selanjutnya
            <ChevronRight className="w-4 h-4 ml-2 texet-white" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="text-white">
            Submit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CareerPersonalizationForm;