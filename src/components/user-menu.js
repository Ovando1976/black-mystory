//import Image from 'next/image';
//import { signOut } from 'next-auth/react'; // Commented out for now.

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/drop-down-menu';
import { IconExternalLink } from './ui/icons';

function getUserInitials(name) {
    const [firstName, lastName] = name.split(' ');
    return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2);
}

export function UserMenu({ user }) {
  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            {user?.image ? (
              <img // Updated to regular img tag.
                className="w-6 h-6 transition-opacity duration-300 rounded-full select-none ring-1 ring-zinc-100/10 hover:opacity-80"
                src={user?.image}
                alt={user.name ?? 'Avatar'}
              />
            ) : (
              <div className="flex items-center justify-center text-xs font-medium uppercase rounded-full select-none h-7 w-7 shrink-0 bg-muted/50 text-muted-foreground">
                {user?.name ? getUserInitials(user?.name) : null}
              </div>
            )}
            <span className="ml-2">{user?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[180px]">
          <DropdownMenuItem className="flex-col items-start">
            <div className="text-xs font-medium">{user?.name}</div>
            <div className="text-xs text-zinc-500">{user?.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem as="a" href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between w-full text-xs">
            Vercel Homepage
            <IconExternalLink className="w-3 h-3 ml-auto" />
          </DropdownMenuItem>
          {/* Commented out for now. Replace with your authentication signOut method. */}
          {/* 
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-xs"
          >
            Log Out
          </DropdownMenuItem>
          */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
