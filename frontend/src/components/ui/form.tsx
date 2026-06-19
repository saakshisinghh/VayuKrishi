'use client';
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { Controller, FormProvider, useFormContext, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
const Form = FormProvider;
type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = { name: TName };
const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);
const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ ...props }: ControllerProps<TFieldValues, TName>) => {
  return <FormFieldContext.Provider value={{ name: props.name }}><Controller {...props} /></FormFieldContext.Provider>;
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;
  return { id, name: fieldContext.name, formItemId: `${id}-form-item`, formDescriptionId: `${id}-form-item-description`, formMessageId: `${id}-form-item-message`, ...fieldState };
};
type FormItemContextValue = { id: string };
const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const id = React.useId();
  return <FormItemContext.Provider value={{ id }}><div ref={ref} className={cn('space-y-2', className)} {...props} /></FormItemContext.Provider>;
});
FormItem.displayName = 'FormItem';
const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField();
  return <LabelPrimitive.Root ref={ref} className={cn('text-sm font-medium', className)} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = 'FormLabel';
const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(({ ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId } = useFormField();
  return <Slot ref={ref} id={formItemId} aria-describedby={formMessageId} {...props} />;
});
FormControl.displayName = 'FormControl';

// Namespaces searched (in order) when a validation message looks like a translation
// key (e.g. "validation.pincode_invalid") rather than literal text.
const MESSAGE_NAMESPACES = ['cropRecommendation', 'auth'] as const;

function useTranslatedFormMessage(rawMessage: string): string {
  const tCropRecommendation = useTranslations('cropRecommendation');
  const tAuth = useTranslations('auth');
  const translators: Record<(typeof MESSAGE_NAMESPACES)[number], (key: string) => string> = {
    cropRecommendation: (key) => tCropRecommendation(key as never),
    auth: (key) => tAuth(key as never),
  };

  if (!rawMessage.includes('.')) return rawMessage;

  for (const ns of MESSAGE_NAMESPACES) {
    try {
      const translated = translators[ns](rawMessage);
      if (translated && translated !== rawMessage && !translated.startsWith(ns)) {
        return translated;
      }
    } catch {
      // key not found in this namespace, try the next one
    }
  }
  return rawMessage;
}

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const rawMessage = error ? String(error?.message ?? '') : '';
  const translated = useTranslatedFormMessage(rawMessage);
  const body = error ? translated : children;
  if (!body) return null;
  return <p ref={ref} id={formMessageId} className={cn('text-sm font-medium text-destructive', className)} {...props}>{body}</p>;
});
FormMessage.displayName = 'FormMessage';
export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, useFormField };