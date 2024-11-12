import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios"
const DialogDemo = () => {
  const [roomname,setroomname] = useState("");
  const [roompassword,setroompassword] = useState("");
  const onclickHandler = async ()=> {
    console.log("New Room ");
    console.log("Here is room name:",roomname);
    console.log("Here is room passwrord:",roompassword);
    const res = await axios.post('/api/room',{
      roomname,
      roompassword
    })

    console.log("Response ",res);

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Fill in the details for your new room. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="roomName" className="text-left">
              Room Name
            </Label>
            <Input
              onChange={(e)=>{
                setroomname(e.target.value)
              }}
              id="roomName"
              className="w-full py-3 text-lg"
              placeholder="Enter room name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="roompassword" className="text-left">
              Room Password
            </Label>
            <Input
            onChange={(e)=>{
              setroompassword(e.target.value)
            }}
              id="roomDescription"
              className="w-full py-3 text-lg"
              placeholder="******"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onclickHandler} type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDemo;
