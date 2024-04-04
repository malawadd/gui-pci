import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function SetupMessages() {
  return (
    <Accordion type="single" collapsible className="w-full my-4 justify-center">
      <AccordionItem value="installation-instructions">
        <AccordionTrigger>Make sure the following packages are installed</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p>Install system packages:</p>
            <pre>sudo apt install build-essential clang cmake pkg-config libssl-dev protobuf-compiler git curl.</pre>
            
            <p>Install Rust. See <a href="https://www.rust-lang.org/tools/install" className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">instructions</a>.</p>
            
            <p>Install cargo-make:</p>
            <pre>cargo install --force cargo-make</pre>
            
            <p>Install Docker. See <a href="https://docs.docker.com/engine/install/ubuntu/" className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">instructions</a>.</p>
            
            <p>Install Foundry. See <a href="https://book.getfoundry.sh/getting-started/installation" className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">instructions</a>.</p>
            
            <p>Also install the following dependencies:</p>
            <pre>sudo apt update && sudo apt install build-essential libssl-dev mesa-opencl-icd ocl-icd-opencl-dev</pre>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
