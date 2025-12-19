"use client";

import { useState } from "react";

export interface InternationalTraining {
  id: number;
  specialization: string;
  clinicName: string;
  country: string;
  year: string;
  duration: string;
}

export interface ProfileFormData {
  // Personal Info
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  workPhone: string;
  
  // Education - Bachelor
  bachelorUniversity: string;
  bachelorCountry: string;
  bachelorGraduationDate: string;
  
  // Education - Master/Residency
  masterUniversity: string;
  masterCountry: string;
  masterSpecialization: string;
  masterGraduationDate: string;
  
  // Professional Info
  yearsOfExperience: string;
  academicDegree: string;
  professionalCategory: string;
  
  // Specializations
  specialization1: string;
  specialization2: string;
  specialization3: string;
  keywords: string;
  
  // Work Locations
  clinic1Name: string;
  clinic1Address: string;
  clinic2Name: string;
  clinic2Address: string;
  
  // Social Media
  socialConsent: string;
  facebookUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  facebookPublic: boolean;
  instagramPublic: boolean;
  telegramPublic: boolean;
  linkedinPublic: boolean;
  youtubePublic: boolean;
}

export function useProfileForm() {
  const [formData, setFormData] = useState<ProfileFormData>({
    // Personal Info
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    workPhone: "",
    
    // Education - Bachelor
    bachelorUniversity: "",
    bachelorCountry: "",
    bachelorGraduationDate: "",
    
    // Education - Master/Residency
    masterUniversity: "",
    masterCountry: "",
    masterSpecialization: "",
    masterGraduationDate: "",
    
    // Professional Info
    yearsOfExperience: "",
    academicDegree: "Yo'q",
    professionalCategory: "Yo'q",
    
    // Specializations
    specialization1: "",
    specialization2: "",
    specialization3: "",
    keywords: "",
    
    // Work Locations
    clinic1Name: "",
    clinic1Address: "",
    clinic2Name: "",
    clinic2Address: "",
    
    // Social Media
    socialConsent: "Roziman",
    facebookUrl: "",
    instagramUrl: "",
    telegramUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    facebookPublic: false,
    instagramPublic: false,
    telegramPublic: false,
    linkedinPublic: false,
    youtubePublic: false,
  });

  // File states
  const [bachelorDiploma, setBachelorDiploma] = useState<File | null>(null);
  const [masterDiploma, setMasterDiploma] = useState<File | null>(null);
  const [academicDegreeCertificate, setAcademicDegreeCertificate] = useState<File | null>(null);
  const [categoryCertificate, setCategoryCertificate] = useState<File | null>(null);

  // International training state
  const [internationalTraining, setInternationalTraining] = useState<InternationalTraining[]>([
    {
      id: 1,
      specialization: "",
      clinicName: "",
      country: "",
      year: "",
      duration: "",
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleTrainingChange = (id: number, field: string, value: string) => {
    setInternationalTraining((prev) =>
      prev.map((training) =>
        training.id === id ? { ...training, [field]: value } : training
      )
    );
  };

  const addTraining = () => {
    const newId = Math.max(...internationalTraining.map((t) => t.id)) + 1;
    setInternationalTraining((prev) => [
      ...prev,
      {
        id: newId,
        specialization: "",
        clinicName: "",
        country: "",
        year: "",
        duration: "",
      },
    ]);
  };

  const removeTraining = (id: number) => {
    if (internationalTraining.length > 1) {
      setInternationalTraining((prev) =>
        prev.filter((training) => training.id !== id)
      );
    }
  };

  return {
    formData,
    setFormData,
    bachelorDiploma,
    setBachelorDiploma,
    masterDiploma,
    setMasterDiploma,
    academicDegreeCertificate,
    setAcademicDegreeCertificate,
    categoryCertificate,
    setCategoryCertificate,
    internationalTraining,
    setInternationalTraining,
    handleInputChange,
    handleTextareaChange,
    handleSelectChange,
    handleCheckboxChange,
    handleTrainingChange,
    addTraining,
    removeTraining,
  };
}