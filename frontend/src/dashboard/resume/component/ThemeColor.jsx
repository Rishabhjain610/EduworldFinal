import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";
import { LayoutGrid } from "lucide-react";
import { ResumeContext } from "../../../context/ResumeContext";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const ThemeColor = () => {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
    "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF71A1",
    "#71A1FF", "#A171FF", "#FFA133", "#ffffff", "#000000"
  ];

  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);
  const [selectedColor, setSelectedColor] = useState();
  const [open, setOpen] = useState(false);

  const onColorSelect = (color) => {
    setOpen(false); // Close dropdown immediately
    setSelectedColor(color);
    setResumeInfo({
      ...resumeInfo,
      themeColor: color
    });
    toast.success("Theme Color Updated");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent open={open}>
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((item, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer hover:border-black border ${
                selectedColor === item ? "border-black" : ""
              }`}
              style={{
                background: item,
              }}
            ></div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeColor;