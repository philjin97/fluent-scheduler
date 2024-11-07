"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";



export default function Page() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  // 사용자 번호 및 이름. 로그인 시스템 대체. 
  const users = {"01082413315": "Phil", "01011112222": "Test"}

  // 입력한 전화번호를 조회하고 있으면, 이름을 보내줌. 
  function user_validation(username: string) {
    const userKeys = Object.keys(users) as (keyof typeof users)[]; // Cast the keys to the actual keys of the users object
    if (userKeys.includes(username as keyof typeof users)) {  // Ensure username is one of the keys
      return `${users[username as keyof typeof users]}`; // Access the value using the key
    }
    return '0';
  }

  // 로그인 
  async function TestLogin(){

      const current_user = user_validation(username)

      if (current_user == '0'){
        router.push('/')
      } else {
        router.push(`/schedule?user=${current_user}&student=false`);
      }
	}  


  return (
    
    <div className="h-[90vh] w-full bg-white flex flex-col items-center justify-center">
      <Card className="w-[15vw]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter Student ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e:any) => setUsername(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between ">
          <Button className="w-full" onClick={TestLogin}>
            Log in
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
};