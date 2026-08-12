import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { CAL_LINK } from "@/lib/links";

type BookACallButtonProps = Omit<ButtonProps, "asChild" | "children"> & {
  children?: ReactNode;
};

/** Every "Book a Call" surface site-wide routes through here so the
 * destination, new-tab behavior, and arrow icon stay in one place instead
 * of five slightly-different copies. */
export function BookACallButton({ children = "Book a Call", ...props }: BookACallButtonProps) {
  return (
    <Button asChild {...props}>
      <a href={CAL_LINK} target="_blank" rel="noreferrer">
        {children}
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.75}
        />
      </a>
    </Button>
  );
}
