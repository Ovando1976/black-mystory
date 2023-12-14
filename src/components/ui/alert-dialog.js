'use client'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { cn } from '../../lib/utils'
import { buttonVariants } from '../../components/ui/button'
// Removed the dynamic import related to Next.js

const AlertDialogTrigger = AlertDialogPrimitive.Trigger


const AlertDialogOverlay = React.forwardRef((props, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn('fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in')}
    {...props}
    ref={ref}
  />
))

const AlertDialogContent = React.forwardRef((props, ref) => (
  <div>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn('fixed z-50 grid w-full max-w-lg scale-100 gap-4 border bg-background p-6 opacity-100 shadow-lg animate-in fade-in-90 slide-in-from-bottom-10 sm:rounded-lg sm:zoom-in-90 sm:slide-in-from-bottom-0')}
      {...props}
    />
  </div>
))

const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)

const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
)

const AlertDialogTitle = React.forwardRef((props, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold')}
    {...props}
  />
))

const AlertDialogDescription = React.forwardRef((props, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground')}
    {...props}
  />
))

const AlertDialogAction = React.forwardRef((props, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants())}
    {...props}
  />
))

const AlertDialogCancel = React.forwardRef((props, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0')}
    {...props}
  />
))

const AlertDialog = ({ children, ...props }) => (
  <div {...props}>
      {children}
  </div>
);

AlertDialog.Trigger = AlertDialogTrigger;
AlertDialog.Content = AlertDialogContent;
AlertDialog.Header = AlertDialogHeader;
AlertDialog.Footer = AlertDialogFooter;
AlertDialog.Title = AlertDialogTitle;
AlertDialog.Description = AlertDialogDescription;
AlertDialog.Action = AlertDialogAction;
AlertDialog.Cancel = AlertDialogCancel;

export {
  AlertDialog,
  // You can keep or remove the individual exports as per your need
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
};