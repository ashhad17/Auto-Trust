
// import React from "react";
// import { X } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
//   title?: string;
//   size?: "sm" | "md" | "lg" | "xl";
// }

// const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   children,
//   title,
//   size = "md",
// }) => {
//   if (!isOpen) return null;

//   const sizeClasses = {
//     sm: "max-w-md",
//     md: "max-w-lg",
//     lg: "max-w-2xl",
//     xl: "max-w-4xl",
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
//       <div
//         className={`relative w-full ${sizeClasses[size]} animate-scale-in rounded-lg bg-white p-6 shadow-xl`}
//       >
//         <div className="flex items-start justify-between mb-4">
//           {title && <h3 className="text-xl font-semibold">{title}</h3>}
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onClose}
//             className="ml-auto rounded-full h-8 w-8"
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Modal;

// components/ui/modal.tsx
import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";
import exp from "constants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

//for export default
 const Modal: React.FC<ModalProps> = ({

  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-4xl",
    full: "max-w-full",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500/75 backdrop-blur-sm"></div>
        </div>

        {/* This element tricks the browser into centering the modal contents */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal container */}
        <div
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full max-h-[90vh]`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* Header */}
          {title && (
            <div className="bg-white px-6 py-4 border-b sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  {title}
                </h3>
                {showCloseButton && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Scrollable content area */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-6 py-4">
            {children}
          </div>

          {/* Footer - optional */}
          {/* <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sticky bottom-0 border-t">
            <Button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default Modal;