import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function BlueprintMessages() {
  return (
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
  );
}
