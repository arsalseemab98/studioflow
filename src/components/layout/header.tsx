import { getUser } from "@/lib/supabase/get-user";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export async function Header() {
  const userData = await getUser();

  const initials = userData?.profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6">
      <div className="lg:ml-0 ml-12">
        <h2 className="text-sm font-medium text-zinc-500">
          {userData?.organization?.name || "My Studio"}
        </h2>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-xs text-zinc-500" disabled>
            {userData?.profile?.email}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <form action={logout}>
              <button type="submit" className="w-full text-left">
                Sign out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
