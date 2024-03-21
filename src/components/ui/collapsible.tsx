'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import React from 'react'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = ({ children }: { children: React.ReactNode }) => (
  <CollapsiblePrimitive.CollapsibleContent className="data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down overflow-hidden">
    {children}
  </CollapsiblePrimitive.CollapsibleContent>
)

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
