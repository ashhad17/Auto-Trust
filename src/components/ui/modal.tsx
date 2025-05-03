
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div
        className={`relative w-full ${sizeClasses[size]} animate-scale-in rounded-lg bg-white p-6 shadow-xl`}
      >
        <div className="flex items-start justify-between mb-4">
          {title && <h3 className="text-xl font-semibold">{title}</h3>}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto rounded-full h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
