'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Wizard Step Header ───────────────────────────────────────────────────────

interface WizardStepHeaderProps {
  steps: { label: string; icon: React.ReactNode }[];
  currentStep: number;
  completedSteps: number[];
}

export function WizardStepHeader({
  steps,
  currentStep,
  completedSteps,
}: WizardStepHeaderProps) {
  return (
    <nav aria-label="Form progress" className="mb-8">
      <ol className="flex items-center justify-between gap-1">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = currentStep === stepNumber;
          const isUpcoming = stepNumber > currentStep && !isCompleted;

          return (
            <li key={stepNumber} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center gap-1.5">
                <motion.div
                  initial={false}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold border-2 transition-colors',
                    isCompleted && 'bg-emerald-600 border-emerald-600 text-white',
                    isCurrent && 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/30',
                    isUpcoming && 'bg-white border-gray-300 text-gray-400 dark:bg-[#0f1a14] dark:border-gray-700 dark:text-gray-500'
                  )}
                  aria-label={`Step ${stepNumber}: ${step.label}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                  ) : (
                    <span aria-hidden>{stepNumber}</span>
                  )}
                </motion.div>

                <span
                  className={cn(
                    'hidden text-[11px] font-medium md:block whitespace-nowrap',
                    isCurrent && 'text-emerald-700 dark:text-emerald-400 font-semibold',
                    isCompleted && 'text-emerald-600 dark:text-emerald-500',
                    isUpcoming && 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="relative mx-1 h-0.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 -mt-5">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'left' }}
                    className="absolute inset-0 bg-emerald-600"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─── Wizard Step Container ────────────────────────────────────────────────────

interface WizardStepProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function WizardStep({ children, title, description, icon }: WizardStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}
