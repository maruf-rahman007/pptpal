import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const DialogDemo = () => {
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
              id="roomName"
              className="w-full py-3 text-lg"
              placeholder="Enter room name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="roomDescription" className="text-left">
              Room Description
            </Label>
            <Input
              id="roomDescription"
              className="w-full py-3 text-lg"
              placeholder="Enter room description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDemo;
