"use client"

import React from 'react';
import CustomSyscallCard from '../components/CustomSyscallCard';
import DefaultCard from '../components/DefaultCard';
import SetupMessages from '../components/SetupMessages';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const blueprints = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Accordion type="single" collapsible className="w-full my-4 justify-center">
      <AccordionItem value="installation-instructions">
        <AccordionTrigger>What Are BluePrints?</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p>blueprints allows you to easily customize your subnet, each card contains a preconfigured subnet </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    
    <div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      
    <CustomSyscallCard />
    <DefaultCard/>
    </div>
    </div>

  );
};

export default blueprints;
