"use client";

import { useState } from "react";

// Run: npx shadcn-ui@latest add button
import { Button } from "@/components/ui/button";
// Run: npx shadcn-ui@latest add card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import AuthInput from "./AuthInput";

function AuthForm() {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: sign in logic
  };
  return (
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

          <Button type="submit" className="w-full">
            Sign {isSignIn ? "In" : "Up"}
          </Button>
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
  );
}

export default AuthForm;
