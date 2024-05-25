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
  const [mrtStationId, setMrtStationId] = useState<string>("");
  const [mrtName, setMrtName] = useState<string>("");
  const [lineName, setLineName] = useState<string>("");
  
  
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
        mrtStationId,
        mrtName,
        lineName,
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
              label="MRT ID 車站代號 請不要有任何空白鍵"
              type="text"
              value={mrtStationId}
              setValue={setMrtStationId}
            />

            <AuthInput
              label="MRT Name 車站名稱"
              type="text"
              value={mrtName}
              setValue={setMrtName}
            />

            <AuthInput
              label="Line Name 捷運線名稱，參考台北捷運路線圖的名字"
              type="text"
              value={lineName}
              setValue={setLineName}
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

