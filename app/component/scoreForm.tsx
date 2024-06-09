"use client";

import { useState } from "react";
import { subscales } from "@/app/component/constant";

export default function ScoreForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    let tmp: { [id: string]: number } = {
      MD: 0,
      PD: 0,
      TD: 0,
      PF: 0,
      EF: 0,
      FR: 0,
    };
    Object.keys(subscales).forEach((value) => {
      tmp[value] = parseInt(formJson[value].toString(), 10);
    });

    setScoreResult(tmp);
  }

  const [scoreResult, setScoreResult] = useState<{ [id: string]: number }>({
    MD: 0,
    PD: 0,
    TD: 0,
    PF: 0,
    EF: 0,
    FR: 0,
  });

  console.log(scoreResult);

  return (
    <div className="w-fit">
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
        <span className="mt-6 w-fit inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
          <button
            type="submit"
            className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:relative"
          >
            Submit
          </button>
        </span>
      </form>
    </div>
  );
}

interface SSProps {
  title: string;
  question: string;
  pname: string;
  head: string;
  tail: string;
}
function ScoreSlider({ title, question, pname, head, tail }: SSProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(parseInt(e.currentTarget.value, 10));
  }

  const [value, setValue] = useState<number>(50);

  return (
    <div className="flex flex-col items-start gap-4 px-2 py-6 border-b-2 border-slate-300">
      <div className="w-full flex flex-row items-center">
        <p className="w-48 text-lg">{title}</p>
        <p className="w-96 text-sm">{question}</p>
      </div>
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
            <p className="text-xs">{head}</p>
            <p className="text-xs">{tail}</p>
          </div>
        </div>
        <p className="w-10">{value}</p>
      </div>
    </div>
  );
}
