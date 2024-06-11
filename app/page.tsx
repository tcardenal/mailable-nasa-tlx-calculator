"use client";

import { useState } from "react";
import {
  subscales,
  subscalesToLong,
  subscalesToShort,
  pairwises,
} from "@/app/component/constant";

export default function Home() {
  function reWeight() {
    setStartWeight(true);
    setStartTask(false);
  }

  function getWeight(weightDict: { [id: string]: number }) {
    // update weightResult
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    setWeightResult(weightDict);
    setStartWeight(false);
    setStartTask(true);
  }

  function getScore(scoreDict: { [id: string]: number }) {
    // append current task result to scoreResult
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    setScoreResult([...scoreResult, scoreDict]);
    setTid(tid + 1);
  }

  const [startWeight, setStartWeight] = useState<boolean>(false);
  const [startTask, setStartTask] = useState<boolean>(false);
  const [pid, setPid] = useState<string>("");
  const [tid, setTid] = useState<number>(1);

  const [weightResult, setWeightResult] = useState<{ [id: string]: number }>({
    MD: -1,
    PD: -1,
    TD: -1,
    PF: -1,
    EF: -1,
    FR: -1,
  });

  const [scoreResult, setScoreResult] = useState<{ [id: string]: number }[]>(
    []
  );

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          NASA-TLX Calculator
        </h1>
        <svg
          className="size-8"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>GitHub</title>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </div>
      <div className="flex flex-col gap-16 items-start md:flex-row">
        <div className="flex flex-col gap-8 w-[32rem]">
          <label className="bg-white max-w-56 relative block rounded-md border p-2 border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
            <input
              type="text"
              value={pid}
              onInput={(e) => setPid(e.currentTarget.value)}
              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
              placeholder="Participant Name"
            />

            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
              Participant Name
            </span>
          </label>
          <div className="flex flex-row items-end gap-8">
            <WeightTable {...weightResult} />
            <Button type="button" name="Reweight" handler={reWeight} />
          </div>
          <ScoreTable data={scoreResult} weight={weightResult} />
        </div>
        {startWeight ? <WeightForm sendToParent={getWeight} /> : null}
        {startTask ? (
          <div className="flex flex-col ">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Task {tid}</h2>
            <ScoreForm sendToParent={getScore} />
          </div>
        ) : null}
      </div>
    </main>
  );
}

// Components
interface BtnProps {
  type?: "button" | "submit" | "reset";
  name: string;
  handler?: Function;
}
function Button({ type, name, handler }: BtnProps) {
  return (
    <span className="mt-4 h-fit w-fit inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
      <button
        type={type}
        onClick={
          handler
            ? () => {
                handler();
              }
            : undefined
        }
        className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:relative"
      >
        {name}
      </button>
    </span>
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
      pname={value}
      op1={subscalesToLong[value.split("-")[0]]}
      op2={subscalesToLong[value.split("-")[1]]}
    />
  ));

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className="min-w-80 max-w-[32rem] flex flex-col items-center"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">Set Weight</h2>
      <p className="w-full text-left text-gray-700 pb-2">
        Select the subscale from each of the 15 pairs that contributed the most
        to the workload of the task.
      </p>
      <p className="w-full text-left text-gray-700 pb-4">
        從 15 個配對中選擇對您認為最能反映工作負荷的子量表。
      </p>
      {pairList}

      <Button type="submit" name="Submit" />
    </form>
  );
}

interface SelectWeightProps {
  id: number;
  pname: string;
  op1: string;
  op2: string;
}
function SelectWeight({ id, pname, op1, op2 }: SelectWeightProps) {
  return (
    <div className="flex flex-row items-center">
      <p className="mr-2 text-sm">{id}.</p>
      <fieldset className="grid grid-cols-2 gap-4 my-2">
        <div>
          <label className="text-center w-36 block cursor-pointer rounded-lg border border-gray-100 bg-white px-2 py-1 text-sm font-medium  hover:border-gray-300 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
            <div>
              <p className="text-gray-700 text-xs">{op1}</p>
            </div>

            <input
              type="radio"
              name={pname}
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

            <input type="radio" name={pname} value={op2} className="sr-only" />
          </label>
        </div>
      </fieldset>
    </div>
  );
}

function WeightTable(data: { [id: string]: number }) {
  return (
    <div className="w-fit">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Weight</h2>
      <div className="flex flex-row gap-6 items-end">
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
    <div className="max-w-96">
      <form
        method="post"
        onSubmit={handleSubmit}
        className="flex flex-col items-start"
      >
        <ScoreSlider
          title="Mental Demand"
          question=" How mentally demanding was the task?"
          pname="MD"
          head="Very Low"
          tail="Very High"
        />
        <ScoreSlider
          title="Physical Demand"
          question="How physically demanding was the task?"
          pname="PD"
          head="Very Low"
          tail="Very High"
        />
        <ScoreSlider
          title="Temporal Demand"
          question=" How hurried or rushed was the pace of the task?"
          pname="TD"
          head="Very Low"
          tail="Very High"
        />
        <ScoreSlider
          title="Performance"
          question="How successful were you in accomplishing what you were asked to do?"
          pname="PF"
          head="Perfect"
          tail="Failure"
        />
        <ScoreSlider
          title="Effort"
          question="How hard did you have to work to accomplish your level of performance?"
          pname="EF"
          head="Very Low"
          tail="Very High"
        />
        <ScoreSlider
          title="Frustration"
          question="How insecure, discouraged, irritated, stressed, and annoyed were you?"
          pname="FR"
          head="Very Low"
          tail="Very High"
        />
        <div className="w-full flex flex-row gap-6 justify-end">
          <Button type="submit" name="Submit" />
        </div>
      </form>
    </div>
  );
}

interface ScoreSliderProps {
  title: string;
  question: string;
  pname: string;
  head: string;
  tail: string;
}
function ScoreSlider({ title, question, pname, head, tail }: ScoreSliderProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(parseInt(e.currentTarget.value, 10));
  }

  const [value, setValue] = useState<number>(50);

  return (
    <div className="w-full flex flex-col items-start gap-4 py-4 border-b-2 border-slate-300">
      <p className="w-full inline-flex justify-center text-gray-900">{title}</p>
      <p className="w-full text-sm text-gray-600">{question}</p>

      <div className="flex flex-row gap-8">
        <div className="flex flex-col items-center gap-2">
          <input
            type="range"
            name={pname}
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
  data: { [id: string]: number }[];
  weight: { [id: string]: number };
}
function ScoreTable({ data, weight }: ScoreTableProps) {
  let lineList: JSX.Element[] = [];

  data.forEach((dict, i) => {
    let wScore: number = 0,
      rScore: number = 0;
    subscales.forEach((value) => {
      wScore = wScore + dict[value] * weight[value];
      rScore = rScore + dict[value];
    });

    wScore = wScore / 15;
    rScore = rScore / 6;

    lineList.push(
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
            {i + 1}
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
            {wScore < 0 ? "NaN" : wScore.toFixed(4)}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-gray-700">
            {rScore.toFixed(4)}
          </td>
        </tr>
      </tbody>
    );
  });

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Result</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
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
                w-score
              </th>
              <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">
                r-score
              </th>
            </tr>
          </thead>

          {lineList}
        </table>
      </div>
    </div>
  );
}
