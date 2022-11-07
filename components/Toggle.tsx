import { useState } from "react";
import { Switch } from "@headlessui/react";

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

const Toggle = ({ checked, onChange }: Props) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`${
        checked ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span
        className={`${
          checked ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
};

export default Toggle;
