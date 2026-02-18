'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { WizardStepId } from './types'
import { WIZARD_STEPS } from './types'

interface StepIndicatorProps {
  currentStep: WizardStepId
  onStepClick?: (stepId: WizardStepId) => void
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav
      className="w-full"
      aria-label="مراحل فروش"
    >
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          const isLast = index === WIZARD_STEPS.length - 1
          const canGoTo = onStepClick && (isCompleted || isCurrent) && step.id < 4

          return (
            <li
              key={step.id}
              className="flex flex-1 items-center"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="flex flex-col items-center w-full">
                {/* Step circle - clickable when completed or current */}
                <motion.div
                  role={canGoTo ? 'button' : undefined}
                  tabIndex={canGoTo ? 0 : undefined}
                  aria-label={`${step.label}${isCurrent ? '، مرحله فعلی' : isCompleted ? '، تکمیل شده' : ''}`}
                  onClick={canGoTo ? () => onStepClick(step.id) : undefined}
                  onKeyDown={
                    canGoTo
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onStepClick(step.id)
                          }
                        }
                      : undefined
                  }
                  className={`
                    relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border-2 font-semibold text-sm
                    transition-colors duration-300
                    ${canGoTo ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2' : ''}
                    ${isCompleted
                      ? 'border-gold-500 bg-gold-500 text-white'
                      : isCurrent
                        ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/30 text-gold-700 dark:text-gold-300'
                        : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }
                  `}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.05 : 1,
                    boxShadow: isCurrent
                      ? '0 0 0 4px rgba(255, 175, 0, 0.2)'
                      : '0 0 0 0px transparent'
                  }}
                  whileTap={canGoTo ? { scale: 0.96 } : undefined}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {isCompleted ? (
                    <motion.span
                      initial={false}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <Check className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} aria-hidden />
                    </motion.span>
                  ) : (
                    <span aria-hidden>{step.id}</span>
                  )}
                </motion.div>
                {/* Label - hidden on very small screens */}
                <span
                  className={`
                    mt-2 text-xs font-medium text-center max-w-[4rem] sm:max-w-none
                    ${isCurrent ? 'text-gold-700 dark:text-gold-300' : isCompleted ? 'text-charcoal dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}
                  `}
                >
                  {step.label}
                </span>
              </div>
              {/* Connector line to next step */}
              {!isLast && (
                <div className="hidden sm:block flex-1 h-0.5 mx-1 min-w-[0.5rem] rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gold-500"
                    initial={false}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
