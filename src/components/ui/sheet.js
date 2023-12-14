'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'

import { cn } from '../../lib/utils'
import { IconClose } from './icons'

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = ({
  className,
  children}) => (
  <SheetPrimitive.Portal
    className={cn('fixed inset-0 z-50 flex', className)}
    
  >
    {children}
  </SheetPrimitive.Portal>
)
SheetPortal.displayName = SheetPrimitive.Portal.displayName

const SheetOverlay = (({ className, children}, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
      className
    )}
    
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const SheetContent = (({ className, children}, ref) => (
  <SheetPortal>
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 h-full border-r bg-background p-6 opacity-100 shadow-lg data-[state=closed]:animate-slide-to-left data-[state=open]:animate-slide-from-left',
        className
      )}
      
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <IconClose />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className}) => (
  <div className={cn('flex flex-col space-y-2', className)}  />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({
  className}) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    
  />
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = (({ className}, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = (({ className }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
}
