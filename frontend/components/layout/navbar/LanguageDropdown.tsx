import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";

function LangDropdown() {
  const [language, setLanguage] = useState("English");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between w-full">
          <DropdownMenuLabel className="text-[1rem]">
            {language}
          </DropdownMenuLabel>
          {/* Optionally, you could add an icon or arrow here */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 flex flex-col">
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          <DropdownMenuRadioItem value="English">English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Arabic">Arabic</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LangDropdown;
