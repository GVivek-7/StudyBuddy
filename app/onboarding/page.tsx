"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const subjects = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Business",
  "Economics",
  "Psychology",
  "Sociology",
  "History",
  "Literature",
  "Philosophy",
  "Art",
  "Music",
  "Medicine",
  "Law",
  "Political Science",
  "Environmental Science",
  "Statistics"
];

const universities = [
  "Stanford University",
  "Harvard University",
  "MIT",
  "UC Berkeley",
  "UCLA",
  "University of Michigan",
  "New York University",
  "Columbia University",
  "University of Chicago",
  "University of Washington",
  "Other"
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    university: '',
    major: '',
    subjects: [] as string[],
    bio: '',
    studyPreferences: [] as string[],
    profileImage: null as File | null,
  });
  const router = useRouter();

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => {
      if (prev.subjects.includes(subject)) {
        return {
          ...prev,
          subjects: prev.subjects.filter(s => s !== subject)
        };
      } else {
        return {
          ...prev,
          subjects: [...prev.subjects, subject]
        };
      }
    });
  };

  const handlePreferenceToggle = (preference: string) => {
    setFormData(prev => {
      if (prev.studyPreferences.includes(preference)) {
        return {
          ...prev,
          studyPreferences: prev.studyPreferences.filter(p => p !== preference)
        };
      } else {
        return {
          ...prev,
          studyPreferences: [...prev.studyPreferences, preference]
        };
      }
    });
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleComplete = () => {
    // In a real app, you would submit the data to your backend here
    router.push('/messages');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold">StudyBuddy</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-2">Set Up Your Profile</h1>
            <p className="text-gray-600 text-center">
              Let's create your profile to help you find the perfect study partners
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            {[1, 2, 3].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    s <= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
                <span className="text-sm mt-2">
                  {s === 1 ? 'Basic Info' : s === 2 ? 'Subjects' : 'Preferences'}
                </span>
              </div>
            ))}
          </div>

          <Card className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Select 
                      value={formData.university} 
                      onValueChange={(value) => setFormData({...formData, university: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your university" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities.map((uni) => (
                          <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="major">Major/Field of Study</Label>
                    <Input 
                      id="major" 
                      placeholder="e.g., Computer Science" 
                      value={formData.major}
                      onChange={(e) => setFormData({...formData, major: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell potential study partners about yourself..." 
                      className="h-32"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Share your academic interests, study habits, and what you're looking for in a study partner.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleNext}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Subjects</h2>
                <p className="text-gray-600 mb-4">
                  Select the subjects you're studying or interested in finding study partners for.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {subjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox 
                        id={subject} 
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={() => handleSubjectToggle(subject)}
                      />
                      <Label htmlFor={subject} className="font-normal">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Study Preferences</h2>
                <p className="text-gray-600 mb-4">
                  Tell us about your study habits and preferences to help find compatible study partners.
                </p>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Study Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Visual learner",
                      "Auditory learner",
                      "Reading/writing learner",
                      "Kinesthetic learner",
                      "Group study",
                      "Individual study",
                      "Teaching others",
                      "Problem-solving focused",
                      "Discussion-based learning",
                      "Flashcards and memorization",
                      "Project-based learning",
                      "Early morning studier",
                      "Late night studier"
                    ].map((preference) => (
                      <div key={preference} className="flex items-center space-x-2">
                        <Checkbox 
                          id={preference} 
                          checked={formData.studyPreferences.includes(preference)}
                          onCheckedChange={() => handlePreferenceToggle(preference)}
                        />
                        <Label htmlFor={preference} className="font-normal">
                          {preference}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleComplete}>
                    Complete Setup
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}