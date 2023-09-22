import React from "react";

type Props = {
  id?: string;
  style?: string;
  children: React.ReactNode;
};
const ComponentWrapper: React.FC<Props> = ({ id, style, children }) => {
  return (
    <section id={id} className={style}>
      <div className="w-full h-full max-w-[1460px] mx-auto md:px-10 px-4">
        {children}
      </div>
    </section>
  );
};

export default ComponentWrapper;
