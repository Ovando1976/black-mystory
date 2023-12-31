'use client'

import { Link } from 'react-router-dom'; // Change from next/link to react-router-dom
// No need for usePathname, as react-router's useLocation will be used instead.
import { useLocation } from 'react-router-dom';

import { cn } from '../lib/utils';
import { buttonVariants } from './ui/button';
import { IconMessage, IconUsers } from './ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from './ui/tooltip';

export function SidebarItem({ chat, children }) {
  const location = useLocation();  // Use react-router's useLocation hook
  const isActive = location.pathname === chat.path;

  if (!chat?.id) return null;

  return (
    <div className="relative">
      <div className="absolute left-2 top-1 flex h-6 w-6 items-center justify-center">
        {chat.sharePath ? (
          <Tooltip delayDuration={1000}>
            <TooltipTrigger
              tabIndex={-1}
              className="focus:bg-muted focus:ring-1 focus:ring-ring"
            >
              <IconUsers className="mr-2" />
            </TooltipTrigger>
            <TooltipContent>This is a shared chat.</TooltipContent>
          </Tooltip>
        ) : (
          <IconMessage className="mr-2" />
        )}
      </div>
      <Link
        to={chat.path}   // Change href to to for react-router-dom's Link component
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full pl-8 pr-16',
          isActive && 'bg-accent'
        )}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title}
        >
          <span className="whitespace-nowrap">{chat.title}</span>
        </div>
      </Link>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </div>
  );
}
