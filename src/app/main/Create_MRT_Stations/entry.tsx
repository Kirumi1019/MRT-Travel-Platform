"use client";

import { useEffect, useState } from "react";

// Run: npx shadcn-ui@latest add button
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import AuthInput from "@/app/_components/AuthInput";
import useMRT from "@/hooks/useMRT";


function AuthForm() {
  const { toast } = useToast();
  const {registerMRT, loading, errorMessage}= useMRT();
  const [mrtId, setMrtId] = useState<string>("");
  const [mrtName, setMrtName] = useState<string>("");
  
  /*
  Since async function will be skipped and the code below will continue be executed,
  errorMessage from the server will not trigger rerender 
  and the errorMessage will only be toasted the next rerender.
  However, using useEffect can help. Whenever errorMessage changed, useEffect will be called.
  Then, the toast will be called.
  */ 
  useEffect(() => {
    if(errorMessage)
      {
        toast({
          variant: "destructive",
          title: errorMessage,
          action: <ToastAction altText="Try again">Got it</ToastAction>,
        });
      }
  }, [errorMessage, toast]) 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerMRT({
        mrtId,
        mrtName,
      });
    }catch(e){
      toast({
        variant: "destructive",
        title: "Request Failed",
        action: <ToastAction altText="Try again">Got it</ToastAction>,
      })
    }
  };

  return (
    <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <AuthInput
              label="MRT ID"
              type="text"
              value={mrtId}
              setValue={setMrtId}
            />

            <AuthInput
              label="MRT Name"
              type="text"
              value={mrtName}
              setValue={setMrtName}
            />
            
            {!loading && (<Button type="submit" className="w-full">
              Sent
            </Button>)}
            {loading && (<Button className="w-full">
              Hold On...
            </Button>)}
          </form>
    </>
  );
}

export default AuthForm;

