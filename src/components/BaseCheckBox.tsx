import React from "react";
import {
  ListItemPrefix,
  Checkbox,
  Typography,
} from "@material-tailwind/react";

interface BaseCheckBoxProps {
  title: string;
  price?: string;
  checkbox: boolean;
}
const BaseCheckBox: React.FC<BaseCheckBoxProps> = props => {
  return (
    <div>
      <label className="flex w-full cursor-pointer items-center justify-between px-3 py-2">
        <Typography className="text-black font-bold">{props.title}</Typography>
        <ListItemPrefix className="mr-3">
           <p> {props.price} </p>
          <Checkbox ripple={true} checked={props.checkbox} />
        </ListItemPrefix>
      </label>
    </div>
  );
};

export default BaseCheckBox;
