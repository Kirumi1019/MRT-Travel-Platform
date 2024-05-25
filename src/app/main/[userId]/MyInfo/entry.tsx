"use client"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import useMember from '@/hooks/useMember';

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table"

import { useState } from "react";

type Props = {
  email: string,
  username: string,
  displayId: string,
}

function Entry(info: Props) {
  const { toast } = useToast()
  const [email, setEmail] = useState(info.email);
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState(info.username);
  const {updateMember,loading}= useMember();
  

  const handleSubmit = async () => {
    try {
        await updateMember({
          email,
          password,
          username,
          displayId: info.displayId,
        })
    }catch(e){
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        action: <ToastAction altText="Try again">Got it</ToastAction>,
      })
    }
  }
  
  return (
    <>
    
      <TableRow key={info.username}>
        <TableCell> 
          <TextField
              required
              id={'email'+info.email}
              defaultValue={info.email}
              onChange={(e) => {setEmail(e.target.value)}}
            />
        </TableCell>
        
        <TableCell>
          <TextField className="w-full"
              required
              id={'userName'+info.username}
              defaultValue={info.username}
              onChange={(e) => {setUserName(e.target.value)}}
            />
        </TableCell>

        <TableCell>
          <TextField
              required
              id={'password'+info.username}
              defaultValue={''}
              onChange={(e) => {setPassword(e.target.value)}}
            />
        </TableCell>
        
        <TableCell>
          <Button disabled={loading} onClick={handleSubmit} variant="outlined"
            endIcon={<SendIcon />}>
            {loading && ('Updating...')}
            {!loading && ('Save')}
          </Button>
        </TableCell>
        
      </TableRow>
      
      </>
  );
}
export default Entry;
  