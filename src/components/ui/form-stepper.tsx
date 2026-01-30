"use client";

import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: number;
  title: string;
  description?: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  allowClickNavigation?: boolean;
  variant?: "default" | "arrows" | "compact";
}

export function FormStepper({
  steps,
  currentStep,
  onStepClick,
  allowClickNavigation = false,
  variant = "arrows",
}: FormStepperProps) {
  const handleStepClick = (stepId: number) => {
    if (allowClickNavigation && onStepClick && stepId < currentStep) {
      onStepClick(stepId);
    }
  };

  if (variant === "compact") {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-500">Step</span>
          <span className="text-lg font-bold text-zim-green">{currentStep}</span>
          <span className="text-sm font-medium text-gray-500">of {steps.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-zim-green to-zim-green/80 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-center mt-2 text-sm font-medium text-gray-700">
          {steps[currentStep - 1]?.title}
        </p>
      </div>
    );
  }

  if (variant === "arrows") {
    return (
      <div className="w-full">
        {/* Mobile: Compact view */}
        <div className="md:hidden">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStepClick(step.id)}
                    disabled={!allowClickNavigation || step.id >= currentStep}
                    className={cn(
                      "relative flex items-center justify-center min-w-[2.5rem] h-10 text-sm font-semibold transition-all",
                      isCompleted && "bg-zim-green text-white",
                      isActive && "bg-zim-green text-white ring-2 ring-zim-green ring-offset-2",
                      !isCompleted && !isActive && "bg-gray-200 text-gray-500",
                      allowClickNavigation && step.id < currentStep && "cursor-pointer hover:opacity-80",
                      // Arrow shape using clip-path
                      !isLast && "pr-2",
                      "rounded-l-md",
                      !isLast ? "rounded-r-none" : "rounded-r-md"
                    )}
                    style={{
                      clipPath: !isLast
                        ? "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)"
                        : undefined,
                    }}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </button>
                  {!isLast && (
                    <div
                      className={cn(
                        "h-10 w-2 -ml-[1px]",
                        isCompleted ? "bg-zim-green" : "bg-gray-200"
                      )}
                      style={{
                        clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-center mt-3 text-base font-semibold text-gray-900">
            {steps[currentStep - 1]?.title}
          </p>
        </div>

        {/* Desktop: Full arrow stepper */}
        <div className="hidden md:block">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const isLast = index === steps.length - 1;

                return (
                  <li
                    key={step.id}
                    className={cn("relative", !isLast && "flex-1")}
                  >
                    <button
                      type="button"
                      onClick={() => handleStepClick(step.id)}
                      disabled={!allowClickNavigation || step.id >= currentStep}
                      className={cn(
                        "group flex items-center w-full",
                        allowClickNavigation && step.id < currentStep && "cursor-pointer"
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-medium w-full",
                          isLast ? "rounded-r-lg" : "",
                          index === 0 ? "rounded-l-lg" : "",
                          isCompleted && "bg-zim-green hover:bg-zim-green/90",
                          isActive && "bg-zim-green",
                          !isCompleted && !isActive && "bg-gray-100 group-hover:bg-gray-200"
                        )}
                      >
                        <span
                          className={cn(
                            "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                            isCompleted && "bg-white border-white text-zim-green",
                            isActive && "bg-white border-white text-zim-green",
                            !isCompleted && !isActive && "border-gray-300 text-gray-500 group-hover:border-gray-400"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-bold">{step.id}</span>
                          )}
                        </span>
                        <span
                          className={cn(
                            "ml-3 text-sm font-medium whitespace-nowrap",
                            isCompleted && "text-white",
                            isActive && "text-white",
                            !isCompleted && !isActive && "text-gray-500 group-hover:text-gray-700"
                          )}
                        >
                          {step.title}
                        </span>
                      </span>
                      {!isLast && (
                        <ChevronRight
                          className={cn(
                            "flex-shrink-0 h-5 w-5 -ml-1 mr-1",
                            isCompleted ? "text-zim-green" : "text-gray-300"
                          )}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Progress bar below */}
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-zim-green via-zim-green to-zim-yellow transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => handleStepClick(step.id)}
                disabled={!allowClickNavigation || step.id >= currentStep}
                className={cn(
                  "flex flex-col items-center",
                  allowClickNavigation && step.id < currentStep && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                    isCompleted && "bg-zim-green text-white",
                    isActive && "bg-zim-green text-white ring-4 ring-zim-green/30",
                    !isCompleted && !isActive && "bg-gray-200 text-gray-600"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center hidden sm:block",
                    isActive && "text-zim-green",
                    isCompleted && "text-zim-green",
                    !isCompleted && !isActive && "text-gray-500"
                  )}
                >
                  {step.title}
                </span>
              </button>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2 rounded-full transition-colors",
                    isCompleted ? "bg-zim-green" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
