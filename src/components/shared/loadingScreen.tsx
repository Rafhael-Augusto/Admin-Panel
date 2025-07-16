import { Loader } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className=" h-[screen]  ">
      <div className=" flex items-center justify-center h-[50vh]">
        <Loader className="h-10 w-10 animate-spin text-primary" />
      </div>
    </div>
  );
}
