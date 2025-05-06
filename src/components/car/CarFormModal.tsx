// components/VehicleFormModal.tsx
import React, { useState } from "react";
import Modal  from "@/components/ui/modal";
import CarForm from "./carForm";

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId?: string; // For edit mode
}

export const CarFormModal: React.FC<CarFormModalProps> = ({
  isOpen,
  onClose,
  carId,
}) => {
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    // Optionally close the modal after a delay
    setTimeout(() => {
      onClose();
      setSuccess(false);
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={carId ? "Edit Car Listing" : "Create New Listing"}
      size="xl"
    >
      <div className="p-4">
        <CarForm 
        //   carId={carId} 
        //   onSuccess={handleSuccess} 
        //   onCancel={onClose}
        />
      </div>
    </Modal>
  );
};