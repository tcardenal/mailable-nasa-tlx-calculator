"use client";

import { useState } from "react";
import {
  subscales,
  subscalesToLong,
  subscalesToShort,
  pairwises,
  CSVheader,
  closeSVG,
  downloadSVG,
} from "@/app/component/constant";

interface ResultDict {
  tid: number;
  tname: string;
  MD: number;
  PD: number;
  TD: number;
  PF: number;
  EF: number;
  FR: number;
  rScore: number;
  MD_w: number;
  PD_w: number;
  TD_w: number;
  PF_w: number;
  EF_w: number;
  FR_w: number;
  wScore: number;
}

export default function Home() {
  function getWeight(weightDict: { [id: string]: number }) {
    // update weightResult
    setWeight(weightDict);
    setStartWeight(false);
  }

  function getScore(scoreDict: { [id: string]: number }) {
    // calculate wScore and rScore
    let wScore: number = 0,
      rScore: number = 0;
    subscales.forEach((value) => {
      wScore = wScore + scoreDict[value] * weight[value];
      rScore = rScore + scoreDict[value];
    });
    wScore = wScore / 15;
    if (wScore < 0) wScore = -1;
    rScore = rScore / 6;

    // append result
    setResultDict([
      ...resultDict,
      {
        tid: tid,
        tname: tname,
        MD: scoreDict["MD"],
        PD: scoreDict["PD"],
        TD: scoreDict["TD"],
        PF: scoreDict["PF"],
        EF: scoreDict["EF"],
        FR: scoreDict["FR"],
        rScore: rScore,
        MD_w: weight["MD"],
        PD_w: weight["PD"],
        TD_w: weight["TD"],
        PF_w: weight["PF"],
        EF_w: weight["EF"],
        FR_w: weight["FR"],
        wScore: wScore,
      },
    ]);

    setTid(tid + 1);
    window.scroll({ top: 200, left: 0, behavior: "smooth" });
  }

  function handleCSV() {
    const csvData = resultDict.map((value) => [
      pname,
      value.tid,
      value.tname,
      value.MD,
      value.PD,
      value.TD,
      value.PF,
      value.EF,
      value.FR,
      value.rScore,
      value.MD_w,
      value.PD_w,
      value.TD_w,
      value.PF_w,
      value.EF_w,
      value.FR_w,
      value.wScore,
    ]);

    const csvRows = [CSVheader, ...csvData];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    let filename = sname + "_" + pname + ".csv";
    link.download = filename;
    link.click();
  }

  const [startWeight, setStartWeight] = useState<boolean>(false);

  const [sname, setSname] = useState<string>("");
  const [pname, setPname] = useState<string>("");
  const [tname, setTname] = useState<string>("");
  const [tid, setTid] = useState<number>(1);

  const [weight, setWeight] = useState<{ [id: string]: number }>({
    MD: -1,
    PD: -1,
    TD: -1,
    PF: -1,
    EF: -1,
    FR: -1,
  });

  const [resultDict, setResultDict] = useState<ResultDict[]>([]);

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full flex flex-row justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          NASA-TLX Calculator
        </h1>
        <a
          href={"https://github.com/Tanimal19/nasa-tlx-calculator"}
          target="_blank"
        >
          <svg
            className="size-8"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
      </div>
      <div className="w-full flex flex-col gap-2 lg:flex-row justify-start border-b-2 pb-6">
        <p className="flex-1 max-w-96">
          <a
            className="text-blue-500 hover:underline"
            href="https://humansystems.arc.nasa.gov/groups/tlx/"
            target="_blank"
          >
            NASA-TLX
          </a>{" "}
          is a subjective assessment tool for measuring perceived workload. This
          website is built to facilitate the recording of NASA-TLX scores.
        </p>
        <ul className="pl-4 list-disc flex-1 lg:w-[32rem]">
          <li>
            <p>
              <strong>Reweight</strong> button generates new weights.
            </p>
            <p>
              Please note that this will not apply to tasks that have already
              been measured.
            </p>
          </li>
          <li>
            <p>
              <strong>Reset</strong> button clears all existing task results.
            </p>
            <p>
              It is recommended to <strong>Download CSV </strong> before
              resetting.
            </p>
          </li>
        </ul>
      </div>
      {startWeight ? (
        <div className="z-10 absolute top-20 p-4 bg-[var(--background-color)] rounded-xl border-2">
          <div className="flex flex-row justify-between items-start">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Set Weight</h2>
            <button
              className="rounded hover:bg-pink-200"
              type="button"
              onClick={() => setStartWeight(false)}
            >
              {closeSVG}
            </button>
          </div>
          <WeightForm sendToParent={getWeight} />
        </div>
      ) : null}
      <div className="pl-8 flex flex-col items-center md:items-start xl:flex-row">
        <div className="flex flex-col py-6 xl:pr-12">
          <div className="flex flex-row justify-start gap-8 items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Task {tid}</h2>
            <TextInput
              placeholder="Task Name"
              key={tid}
              handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTname(e.currentTarget.value);
              }}
            />
          </div>
          <ScoreForm sendToParent={getScore} />
        </div>
        <div className="flex flex-col gap-4 w-[28rem] py-6 xl:px-8">
          <h2 className="text-xl font-bold text-gray-800 pr-4">
            Study Setting
          </h2>
          <TextInput
            placeholder="Study Name"
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSname(e.currentTarget.value);
            }}
          />
          <TextInput
            placeholder="Participant Name"
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPname(e.currentTarget.value);
            }}
          />
          <div className="w-fit my-2">
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex flex-row gap-2 cursor-pointer items-center -ml-6">
                <span className="-rotate-90 shrink-0 transition duration-300 group-open:rotate-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <h2 className="text-xl font-bold text-gray-800 pr-4">
                  Current Weight
                </h2>
                <div className="flex-1 inline-flex justify-end">
                  <Button
                    type="button"
                    placeholder="Reweight"
                    handler={() => {
                      setStartWeight(true);
                      window.scroll({ top: 20, left: 0, behavior: "smooth" });
                    }}
                  />
                </div>
              </summary>
              <WeightTable {...weight} />
            </details>
          </div>
          <div className="w-fit mb-2">
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex flex-row gap-2 cursor-pointer items-center -ml-6">
                <span className="-rotate-90 shrink-0 transition duration-300 group-open:rotate-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <h2 className="text-xl font-bold text-gray-800 pr-4">
                  Task Result
                </h2>
                <div className="flex-1 flex gap-4 justify-end">
                  <Button
                    type="button"
                    placeholder="Reset"
                    handler={() => {
                      setResultDict([]);
                      setTid(1);
                    }}
                  />
                  <Button
                    type="button"
                    placeholder="Download CSV"
                    handler={handleCSV}
                  />
                </div>
              </summary>
              <ScoreTable data={resultDict} />
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}

// Components
interface BtnProps {
  type?: "button" | "submit" | "reset";
  placeholder: string;
  handler?: Function;
}
function Button({ type, placeholder, handler }: BtnProps) {
  return (
    <span className="h-fit w-fit inline-flex -space-x-px overflow-hidden rounded-md bg-slate-950">
      <button
        type={type}
        onClick={
          handler
            ? () => {
                handler();
              }
            : undefined
        }
        className="inline-block px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-white hover:bg-slate-700 focus:relative"
      >
        {placeholder}
      </button>
    </span>
  );
}

interface TextInputProps {
  placeholder: string;
  handler?: Function;
}
function TextInput({ placeholder, handler }: TextInputProps) {
  return (
    <label className="max-w-64 relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600">
      <input
        type="text"
        onInput={
          handler
            ? (e) => {
                handler(e);
              }
            : undefined
        }
        placeholder={placeholder}
        className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
      />

      <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
        {placeholder}
      </span>
    </label>
  );
}

interface ChildProps {
  sendToParent: Function;
}

// Weight
function WeightForm({ sendToParent }: ChildProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    let weightDict: { [id: string]: number } = {
      MD: 0,
      PD: 0,
      TD: 0,
      PF: 0,
      EF: 0,
      FR: 0,
    };
    pairwises.forEach((value) => {
      weightDict[subscalesToShort[formJson[value].toString()]] += 1;
    });

    sendToParent(weightDict);
  }

  const pairList = pairwises.map((value) => (
    <SelectWeight
      key={value}
      id={pairwises.indexOf(value) + 1}
      name={value}
      op1={subscalesToLong[value.split("-")[0]]}
      op2={subscalesToLong[value.split("-")[1]]}
    />
  ));

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className="max-w-[24em] xl:max-w-none xl:w-fit flex flex-col items-start"
    >
      <p className="text-left text-gray-700 pb-2">
        Select the subscale from each of the 15 pairs that contributed the most
        to the workload of the task.
      </p>
      <div className="grid grid-flow-row xl:grid-flow-col xl:grid-rows-5">
        {pairList}
      </div>
      <div className="w-full flex flex-row gap-6 justify-end pt-4">
        <Button type="submit" placeholder="Submit" />
      </div>
    </form>
  );
}

interface SelectWeightProps {
  id: number;
  name: string;
  op1: string;
  op2: string;
}
function SelectWeight({ id, name, op1, op2 }: SelectWeightProps) {
  return (
    <div className="flex flex-row items-center px-2 py-1 rounded-xl hover:bg-slate-100">
      <p className="mr-2 text-sm">{id}.</p>
      <fieldset className="grid grid-cols-2 gap-4 my-2">
        <div>
          <label className="text-center w-36 block cursor-pointer rounded-lg border border-gray-100 bg-white px-2 py-1 text-sm font-medium  hover:border-gray-300 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
            <div>
              <p className="text-gray-700 text-xs">{op1}</p>
            </div>

            <input
              type="radio"
              name={name}
              value={op1}
              className="sr-only"
              required
            />
          </label>
        </div>
        <div>
          <label className="text-center w-36 block cursor-pointer rounded-lg border border-gray-100 bg-white px-2 py-1 text-sm font-medium hover:border-gray-300 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
            <div>
              <p className="text-gray-700 text-xs">{op2}</p>
            </div>

            <input type="radio" name={name} value={op2} className="sr-only" />
          </label>
        </div>
      </fieldset>
    </div>
  );
}

function WeightTable(data: { [id: string]: number }) {
  return (
    <div className="my-4 flex flex-row gap-6 items-end">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                MD
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                PD
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                TD
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                PF
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                EF
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                FR
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-center">
            <tr>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {data["MD"] == -1 ? "NaN" : data["MD"].toString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {data["PD"] == -1 ? "NaN" : data["PD"].toString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {data["TD"] == -1 ? "NaN" : data["TD"].toString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {data["PF"] == -1 ? "NaN" : data["PF"].toString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {data["EF"] == -1 ? "NaN" : data["EF"].toString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {data["FR"] == -1 ? "NaN" : data["FR"].toString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Score
function ScoreForm({ sendToParent }: ChildProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    let scoreDict: { [id: string]: number } = {
      MD: 0,
      PD: 0,
      TD: 0,
      PF: 0,
      EF: 0,
      FR: 0,
    };
    Object.keys(subscalesToLong).forEach((value) => {
      scoreDict[value] = parseInt(formJson[value].toString(), 10);
    });

    sendToParent(scoreDict);
  }

  return (
    <div className="w-fit">
      <form
        method="post"
        onSubmit={handleSubmit}
        className="flex flex-col items-start"
      >
        <div className="grid grid-flow-row md:grid-flow-col md:grid-rows-3 gap-4">
          <ScoreSlider
            title="1. Mental Demand"
            question=" How mentally demanding was the task? 此任務的腦力需求怎麼樣?"
            name="MD"
            head="Very Low"
            tail="Very High"
          />
          <ScoreSlider
            title="2. Physical Demand"
            question="How physically demanding was the task? 此任務的體力需求怎麼樣?"
            name="PD"
            head="Very Low"
            tail="Very High"
          />
          <ScoreSlider
            title="3. Temporal Demand"
            question=" How hurried or rushed was the pace of the task? 此任務的節奏讓你感到匆忙嗎?"
            name="TD"
            head="Very Low"
            tail="Very High"
          />
          <ScoreSlider
            title="4. Performance"
            question="How successful were you in accomplishing what you were asked to do? 你在此任務上做的有多成功?"
            name="PF"
            head="Perfect"
            tail="Failure"
          />
          <ScoreSlider
            title="5. Effort"
            question="How hard did you have to work to accomplish your level of performance? 為了在這項任務上達到你的吮平，你需要付出多大的努力?"
            name="EF"
            head="Very Low"
            tail="Very High"
          />
          <ScoreSlider
            title="6. Frustration"
            question="How insecure, discouraged, irritated, stressed, and annoyed were you? 你有多不安、沮喪、煩躁、緊張和惱怒?"
            name="FR"
            head="Very Low"
            tail="Very High"
          />
        </div>

        <div className="w-full flex flex-row gap-6 justify-end pt-4">
          <Button type="submit" placeholder="Submit" />
        </div>
      </form>
    </div>
  );
}

interface ScoreSliderProps {
  title: string;
  question: string;
  name: string;
  head: string;
  tail: string;
}
function ScoreSlider({ title, question, name, head, tail }: ScoreSliderProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(parseInt(e.currentTarget.value, 10));
  }

  const [value, setValue] = useState<number>(50);

  return (
    <div className="w-96 flex flex-col items-start gap-4 py-4">
      <p className="w-full inline-flex justify-center text-gray-900">{title}</p>
      <p className="w-full text-sm text-gray-600">{question}</p>

      <div className="flex flex-row gap-8">
        <div className="flex flex-col items-center gap-2">
          <input
            type="range"
            name={name}
            min="0"
            max="100"
            step="5"
            list="markers"
            onChange={handleChange}
            className="w-72 accent-blue-500"
          />
          <datalist id="markers">
            <option value="0"></option>
            <option value="20"></option>
            <option value="40"></option>
            <option value="60"></option>
            <option value="80"></option>
            <option value="100"></option>
          </datalist>
          <div className="w-72 flex flex-row justify-between">
            <p className="text-xs text-gray-600">{head}</p>
            <p className="text-xs text-gray-600">{tail}</p>
          </div>
        </div>
        <p className="w-10">{value}</p>
      </div>
    </div>
  );
}

interface ScoreTableProps {
  data: ResultDict[];
}
function ScoreTable({ data }: ScoreTableProps) {
  let lineList: JSX.Element[] = [];

  data.forEach((dict, i) => {
    lineList.push(
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td className="overflow-hidden whitespace-nowrap text-ellipsis max-w-20 px-2 py-2 font-medium text-gray-900">
            {dict["tname"]}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-gray-700">
            {dict["MD"]}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-gray-700">
            {dict["PD"]}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-gray-700">
            {dict["TD"]}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-gray-700">
            {dict["PF"]}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-gray-700">
            {dict["EF"]}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-gray-700">
            {dict["FR"]}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-gray-700">
            {dict["rScore"].toFixed(4)}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-gray-700">
            {dict["wScore"] == -1 ? "NaN" : dict["wScore"].toFixed(4)}
          </td>
        </tr>
      </tbody>
    );
  });

  return (
    <div className="mt-4 w-fit max-w-full overflow-clip rounded-lg border border-gray-200">
      <table className="divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
              Task
            </th>
            <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
              MD
            </th>
            <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
              PD
            </th>
            <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
              TD
            </th>
            <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
              PF
            </th>
            <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
              EF
            </th>
            <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
              FR
            </th>
            <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
              r-score
            </th>
            <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
              w-score
            </th>
          </tr>
        </thead>

        {lineList}
      </table>
    </div>
  );
}
