import { ThemeProvider } from "@/components/theme-provider";
import { ChangeEvent, useState } from "react";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Undo2, Plus, Minus } from "lucide-react";

function JsonViewer({ data }: { data: any }) {
  const [expanded, setExpanded] = useState(false);

  if (typeof data === "object" && data !== null) {
    return (
      <div className="text-gray-600">
        <button
          className="dark:bg-zinc-950 dark:text-white border border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer h-4 w-4 rounded-sm text-center text-xs mr-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <Minus className="h-3 w-3 rotate-0 scale-100" />
          ) : (
            <Plus className="h-3 w-3 rotate-0 scale-100" />
          )}
        </button>
        <span className="text-[#F2CAB8]">
          {Array.isArray(data) ? "[" : "{"}
        </span>
        {expanded ? (
          <ul className="list-none pl-5">
            {Object.entries(data).map(([key, value]) => (
              <li key={key}>
                <div>
                  <span className="mr-2">
                    <span className="ml-4 text-[#4E9590]">{key}</span>
                    <span className="text-[#00000] dark:text-gray-200">:</span>
                  </span>
                  <JsonViewer data={value} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <span className="ml-4">...</span>
        )}

        <span className="ml-4 text-[#F2CAB8]">
          {Array.isArray(data) ? "]" : "}"}
        </span>
      </div>
    );
  } else {
    return (
      <span className="text-[#00000] dark:text-gray-200">
        {JSON.stringify(data)}
      </span>
    );
  }
}

export default function App() {
  const [json, setJson] = useState<Object | null>(null);
  const [jsonTitle, setJsonTitle] = useState<string>();
  const [erro, setError] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setJsonTitle(file.name);
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;

        try {
          const jsonData = JSON.parse(content);
          console.log(jsonData);
          setJson(jsonData);
          setError(false);
        } catch (error) {
          console.error("Erro ao analisar o JSON:", error);
          setError(true);
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-screen h-screen flex flex-col items-center justify-center relative">
        <div className="w-full h-14 fixed top-0 flex items-center p-4">
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
        {json ? (
          <div className="max-w-[638px] w-full h-screen py-12 px-2 pb-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-[32px] font-[700]">{jsonTitle}</h3>
              <Button
                onClick={() => {
                  setJson(null);
                  setJsonTitle("");
                  setError(false);
                }}
                variant="outline"
                size="icon"
              >
                <Undo2 className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
              </Button>
            </div>
            <div>
              <JsonViewer data={json} />
            </div>
          </div>
        ) : (
          <div className="space-y-4 flex flex-col items-center justify-center">
            <h2 className="text-[48px] font-[700] text-center">
              JSON Tree Viewer
            </h2>
            <p className="text-[24px] font-[400] text-center">
              Simple JSON Viewer that runs completely on-client. No data
              exchange
            </p>

            <Label
              htmlFor="picture"
              className="dark:bg-zinc-950 dark:text-white border border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer px-4 py-2 rounded-md"
            >
              Load JSON
            </Label>
            <Input
              onChange={handleFileChange}
              id="picture"
              type="file"
              className="sr-only"
            />
            {erro && (
              <p className="text-[16px] font-[400] text-[#BF0E0E]">
                Invalid file. Please load a valid JSON file.
              </p>
            )}
          </div>
        )}
        <div className="w-full h-10 fixed bottom-0 flex items-center justify-center">
          <p>
            Feito com 💙 por{" "}
            <a
              href="https://filipeleonelbatista.vercel.app/links"
              target="_blank"
              rel="noreferer noopener"
              className="font-[700]"
            >
              Filipe Batista
            </a>
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}
