"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import { publicEnv } from "@/lib/env/public";

// Run: npx shadcn-ui@latest add button
import { Button } from "@/components/ui/button";
// Run: npx shadcn-ui@latest add card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import AuthInput from "./AuthInput";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import useMember from "@/hooks/useMember";


function AuthForm() {
  const { toast } = useToast();
  const {getMember,loading, errorMessage}= useMember();
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: sign in logic
    if(!isSignIn)
    {
      try {
        getMember({
          email,
          username,
        })
      }catch(e){
        toast({
          variant: "destructive",
          title: "SignIn Failed",
          action: <ToastAction altText="Try again">Got it</ToastAction>,
        })
      }

      if(errorMessage)
      {
        toast({
          variant: "destructive",
          title: errorMessage,
          action: <ToastAction altText="Try again">Got it</ToastAction>,
        })
      }
      return null;
    }
    

    if(!isSignIn && password != confirmPassword){
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "\"Password\" doesn't match with \"Confirmed Password\"",
        action: <ToastAction altText="Try again">Got it</ToastAction>,
      });
      return null;
    }

    signIn("credentials", {
      email,
      username,
      password,
      callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/main`,
    });

    
  };
  return (
    <>
      <Card className="min-w-[300px]">
        <CardHeader>
          <CardTitle className="flex flex-col items-center">
            Sign {isSignIn ? "In" : "Up"}
          </CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <AuthInput
              label="Email"
              type="text"
              value={email}
              setValue={setEmail}
            />

            <AuthInput
              label="Username"
              type="text"
              value={username}
              setValue={setUsername}
            />

            <AuthInput
              label="Password"
              type="password"
              value={password}
              setValue={setPassword}
            />
            {!isSignIn && (
              <AuthInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                setValue={setConfirmPassword}
              />
            )}
            
            {!loading && (<Button type="submit" className="w-full">
              Sign {isSignIn ? "In" : "Up"}
            </Button>)}
            {loading && (<Button className="w-full">
              Hold On...
            </Button>)}
          </form>

          {/* <div className="flex w-full items-center gap-1 py-2">
            <div className="h-[1px] grow border-t"></div>
              <p>or</p>
            <div className="h-[1px] grow border-t"></div>
          </div> */}
          <div className="text-sm text-gray-500 py-4">
            {isSignIn ? (
              <span>
                Do not have an account?{" "}
                <a
                  className="cursor-pointer hover:underline"
                  onClick={() => setIsSignIn(false)}
                >
                  Sign Up
                </a>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <a
                  className="cursor-pointer hover:underline"
                  onClick={() => setIsSignIn(true)}
                >
                  Sign In
                </a>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default AuthForm;

