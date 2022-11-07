"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "../components/select";
import Modal from "../components/modal";
import Toggle from "../components/Toggle";

type Form = {
  title: string;
  id: string;
  url?: string;
  questions?: [
    { name: string; qid: string; text: string; urlEncoded?: boolean }
  ];
};

const Main = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [copy, setCopy] = useState(false);
  const [forms, setForms] = useState<Form[]>([]);
  const [encoded, setEncoded] = useState<{ [key: string]: boolean }>({});
  const [source, setSource] = useState<Form>({
    title: "",
    id: "",
  });
  const [dest, setDest] = useState<Form>({
    title: "",
    id: "",
  });
  const [item, setItem] = useState<{ [key: string]: Form }>({});

  useEffect(() => {
    const token = localStorage.getItem("jToken");

    if (!token) {
      router.push("/auth");
    } else {
      //@ts-ignore
      JF.initialize({ apiKey: token });
      //@ts-ignore
      JF.getForms(function (response) {
        setForms(response);

        const jSource = localStorage.getItem("jSource");
        const jDest = localStorage.getItem("jDest");

        if (jSource) {
          const loadSource: Form = response.find((r: any) => r.id === jSource);
          setSource(loadSource);
        }

        if (jDest) {
          const loadDest: Form = response.find((r: any) => r.id === jDest);
          setDest(loadDest);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (source.id && !source.questions) {
      //@ts-ignore
      JF.getFormQuestions(source.id, function (response) {
        const fullForm = Object.assign({}, source, {
          questions: Object.values(response),
        });
        setSource(fullForm);
        localStorage.setItem("jSource", source.id);
      });
    }

    if (dest.id && !dest.questions) {
      //@ts-ignore
      JF.getFormQuestions(dest.id, function (response) {
        console.warn(response);
        const fullForm = Object.assign({}, dest, {
          questions: Object.values(response),
        });
        setDest(fullForm);
        localStorage.setItem("jDest", dest.id);
      });
    }

    console.warn(source, dest);
  }, [source, dest]);

  const generateURL = () => {
    let str = "?";

    if (!Object.keys(item).length) {
      return "";
    }

    Object.keys(item).forEach((k, i) => {
      if (i !== 0) {
        str += "&";
      }
      str += `${k}={${encoded[k] ? "URLEncoded:" : ""}${item[k].title}}`;
    });

    return str;
  };

  const copyToClipBoard = async () => {
    await navigator.clipboard.writeText(`${dest?.url}${generateURL()}`);
    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  const clearAll = () => {
    setSource({
      title: "",
      id: "",
    });

    setDest({
      title: "",
      id: "",
    });

    setItem({});
    setEncoded({});
    localStorage.removeItem("jSource");
    localStorage.removeItem("jDest");
  };

  const logout = () => {
    localStorage.removeItem("jToken");
    router.push("/auth");
  };

  return (
    <div className="absolute left-0 right-0 top-0 bottom-0 overflow-hidden bg-zinc-100">
      <div className="absolute bottom-5 left-5">
        <div
          onClick={logout}
          className="relative w-full h-full flex flex-col justify-center items-center bg-white p-5 rounded-full shadow cursor-pointer transition-all hover:bg-zinc-50 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </div>
      </div>
      <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-full p-20 overflow-auto md:overflow-hidden">
        <div className="w-full h-full flex flex-col justify-center md:w-1/3 lg:1/4">
          <div>
            <div>Source Form:</div>
            <Select
              selected={source}
              onChange={(value) => setSource(value)}
              options={forms}
            />
            {!!source.id && (
              <div
                onClick={() => setUrl(source.url || "")}
                className="text-sm text-blue-400 mt-1 cursor-pointer hover:text-blue-500 transition-all"
              >
                View Form
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 md:mt-8 md:mb-4 my-2 text-gray-600 md:animate-bounce"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
          <div>
            <div>Destination Form:</div>
            <Select
              selected={dest}
              onChange={(value) => setDest(value)}
              options={forms}
            />
            {!!dest.id && (
              <div
                onClick={() => setUrl(dest.url || "")}
                className="text-sm text-blue-400 mt-1 cursor-pointer hover:text-blue-500 transition-all"
              >
                View Form
              </div>
            )}
          </div>
          {(source.id || dest.id) && (
            <div className="flex justify-center md:mt-4">
              <div
                onClick={clearAll}
                className="p-5 bg-white hover:bg-zinc-50 transition-all hover:scale-110 cursor-pointer rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="grow flex flex-col">
          <div className="relative p-1 bg-zinc-200 rounded shadow mb-3 min-h-[32px]">
            <div className="text-gray-600 font-bold text-lg md:text-xl">
              {dest?.url}
              {generateURL()}
            </div>
            <div
              onClick={copyToClipBoard}
              className="absolute h-full flex right-1 top-0 items-center cursor-pointer"
            >
              {copy ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 01-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0113.5 1.5H15a3 3 0 012.663 1.618zM12 4.5A1.5 1.5 0 0113.5 3H15a1.5 1.5 0 011.5 1.5H12z"
                    clipRule="evenodd"
                  />
                  <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0116.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625v-12z" />
                  <path d="M10.5 10.5a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963 5.23 5.23 0 00-3.434-1.279h-1.875a.375.375 0 01-.375-.375V10.5z" />
                </svg>
              )}
            </div>
          </div>
          <div
            className={`grow bg-white shadow p-4 relative rounded overflow-auto ${
              dest.questions && source.questions
                ? "md:grid md:grid-cols-8 md:gap-4"
                : ""
            }`}
          >
            {dest.questions && source.questions ? (
              dest.questions.map((q) => (
                <div className="mt-4 md:col-span-4" key={q.qid}>
                  <div className="flex mb-2 justify-between items-center">
                    <div>{q.text}</div>
                    <div>
                      URL Encode:{" "}
                      <Toggle
                        checked={encoded[q.name]}
                        onChange={(value) =>
                          setEncoded(
                            Object.assign({}, encoded, { [q.name]: value })
                          )
                        }
                      />
                    </div>
                  </div>

                  <Select
                    selected={item[q.name]}
                    onChange={(value) =>
                      setItem(Object.assign({}, item, { [q.name]: value }))
                    }
                    options={
                      source.questions?.map((q) => ({
                        id: q.qid,
                        title: q.name,
                      })) || []
                    }
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col w-full h-full justify-center items-center">
                <div className="text-gray-600 text-lg">
                  Select a <span className="font-bold">Source</span> and
                  <span className="font-bold ml-1">Destination</span> to get
                  started
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 my-3 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal url={url} setUrl={setUrl} />
      <Script
        strategy="beforeInteractive"
        src="https://js.jotform.com/JotForm.js"
      />
    </div>
  );
};

export default Main;
