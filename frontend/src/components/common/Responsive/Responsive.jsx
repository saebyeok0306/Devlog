import React from "react";
import cn from "classnames";

import "./Responsive.scss";

function Responsive({ children, className, ...rest }) {
  return (
    <div className={cn("common", "responsive", className)} {...rest}>
      {children}
    </div>
  );
}

export default Responsive;
