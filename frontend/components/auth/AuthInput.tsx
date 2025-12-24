import { Input } from "@/components/ui/input";
import { FieldError } from "react-hook-form";

interface AuthInputProps {
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: FieldError | string | undefined;
  // For react-hook-form integration
  registerField?: any;
}

export default function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  error,
  registerField,
}: AuthInputProps) {
  return (
    <div>
      <Input
        className="pl-7 py-7 rounded-2xl placeholder:text-muted"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...(registerField ? registerField : {})}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
}
