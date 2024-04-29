import { ReactHTMLElement, useState } from "react"

// Run: npx shadcn-ui@latest add input label
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    label: string;
    type: React.HTMLInputTypeAttribute;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

function AuthInput({label, type, value, setValue} :Props) {
    return(
        <div>
            <Label>{label}</Label>
            <Input
                type={type}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
            />
        </div>
    )
}

export default AuthInput;
