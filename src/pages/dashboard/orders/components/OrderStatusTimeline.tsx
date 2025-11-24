import { useState } from "react";
import { ChevDownIcon } from "../../../../components/btns/ChevDown";

interface dataProps {
  title: string;
  note: string;
  date: string;
  updated: boolean;
}

interface TimelineStepProps {
  data: dataProps[];
}

export const TimelineStep = ({ data }: TimelineStepProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`mt-5 ${open?'h-85': 'h-17'} overflow-hidden transition-all duration-300 flex items-start justify-between`}>
      <div>
        {data.map((datas, index) => {
          const isLast = index === data.length - 1;
          return (
            <div key={index} className="flex items-start gap-3 mb-3">
              <div className="flex flex-col gap-1 w-5 justify-center items-center">
                {datas.title === "Delivered" ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.40351 15.7974L9.90554 16.2852L9.40351 15.7974ZM8.59638 15.7974L9.09841 15.3096L8.59638 15.7974ZM8.99673 7.19756V6.49756C8.61013 6.49756 8.29673 6.81096 8.29673 7.19756H8.99673ZM9.00273 7.19756H9.70273C9.70273 6.81096 9.38933 6.49756 9.00273 6.49756V7.19756ZM9.00273 7.20399V7.90399C9.38933 7.90399 9.70273 7.59059 9.70273 7.20399H9.00273ZM8.99673 7.20399H8.29673C8.29673 7.59059 8.61013 7.90399 8.99673 7.90399V7.20399ZM14.2714 7.13573H13.5714C13.5714 8.60085 12.7648 10.3018 11.7183 11.8634C10.6886 13.4 9.5038 14.6897 8.90148 15.3096L9.40351 15.7974L9.90554 16.2852C10.5363 15.636 11.7854 14.2781 12.8814 12.6428C13.9605 11.0324 14.9714 9.03704 14.9714 7.13573H14.2714ZM8.59638 15.7974L9.09841 15.3096C8.49609 14.6897 7.31127 13.4 6.28154 11.8634C5.23505 10.3018 4.42852 8.60085 4.42852 7.13573H3.72852H3.02852C3.02852 9.03704 4.03936 11.0324 5.11854 12.6428C6.21446 14.2781 7.46358 15.636 8.09435 16.2852L8.59638 15.7974ZM3.72852 7.13573H4.42852C4.42852 4.56799 6.48309 2.50078 8.99994 2.50078V1.80078V1.10078C5.69413 1.10078 3.02852 3.81065 3.02852 7.13573H3.72852ZM8.99994 1.80078V2.50078C11.5168 2.50078 13.5714 4.56799 13.5714 7.13573H14.2714H14.9714C14.9714 3.81065 12.3058 1.10078 8.99994 1.10078V1.80078ZM9.40351 15.7974L8.90148 15.3096C8.92258 15.2878 8.9586 15.2705 8.99994 15.2705C9.04129 15.2705 9.0773 15.2878 9.09841 15.3096L8.59638 15.7974L8.09435 16.2852C8.59354 16.7989 9.40635 16.7989 9.90554 16.2852L9.40351 15.7974ZM9.89994 7.20078H9.19994C9.19994 7.31124 9.1104 7.40078 8.99994 7.40078V8.10078V8.80078C9.8836 8.80078 10.5999 8.08444 10.5999 7.20078H9.89994ZM8.99994 8.10078V7.40078C8.88949 7.40078 8.79994 7.31124 8.79994 7.20078H8.09994H7.39994C7.39994 8.08444 8.11629 8.80078 8.99994 8.80078V8.10078ZM8.09994 7.20078H8.79994C8.79994 7.09032 8.88949 7.00078 8.99994 7.00078V6.30078V5.60078C8.11629 5.60078 7.39994 6.31713 7.39994 7.20078H8.09994ZM8.99994 6.30078V7.00078C9.1104 7.00078 9.19994 7.09032 9.19994 7.20078H9.89994H10.5999C10.5999 6.31713 9.8836 5.60078 8.99994 5.60078V6.30078ZM8.99673 7.19756V7.89756H9.00273V7.19756V6.49756H8.99673V7.19756ZM9.00273 7.19756H8.30273V7.20399H9.00273H9.70273V7.19756H9.00273ZM9.00273 7.20399V6.50399H8.99673V7.20399V7.90399H9.00273V7.20399ZM8.99673 7.20399H9.69673V7.19756H8.99673H8.29673V7.20399H8.99673Z"
                      fill="#000"
                    />
                  </svg>
                ) : (
                  <div className="h-1.5 w-1.5 bg-black rounded-full" />
                )}
                {!isLast && (
                  <div className="border-l border-[#707070] border-dashed h-10"></div>
                )}
              </div>
              <div className="flex items-start flex-col gap-1">
                <p
                  className={`text-sm leading-4 ${
                    datas.updated === false ? "font-normal" : "font-extrabold"
                  }`}
                >
                  {datas.title}
                </p>
                <p className="text-primary font-bold text-xs">{datas.title}</p>
                <p className="text-sm leading-3 font-normal ">{datas.date}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div onClick={() => setOpen(!open)} className="flex cursor-pointer items-center text-primary text-sm gap-2">
        Hide details{" "}
        <ChevDownIcon open={open} color="#80011D" />
      </div>
    </div>
  );
};
