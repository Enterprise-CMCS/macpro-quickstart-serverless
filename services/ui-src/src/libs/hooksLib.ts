import { useState } from "react";

export function useFormFields(initialState: any) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event: any) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
    },
  ];
}
