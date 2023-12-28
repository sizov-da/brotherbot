import React, {useState} from "react";


// import EcharGraph from "./EcharGraph";
import EcharCalendar from "./CalendarModule/EcharCalendar";
import { Pagination, Placeholder, DatePicker,Text} from "@vkontakte/vkui";




const CalendarModule = () => {
   const [currentPage, setCurrentPage] = useState<number | undefined>(1);
   const handleChange = React.useCallback((page: React.SetStateAction<number | undefined>) => {
      setCurrentPage(page);
   }, []);


   return(<>
       <Placeholder>
           <h2> График загрузки </h2>
         <DatePicker
             min={{ day: 1, month: 1, year: 1901 }}
             max={{ day: 1, month: 1, year: 2006 }}
             defaultValue={{ day: 2, month: 4, year: 1994 }}
             onDateChange={(value) => {
                console.log(value);
             }}
         />
      </Placeholder>
      <EcharCalendar/>
      <Placeholder><Pagination
          currentPage={currentPage}
          siblingCount={0}
          boundaryCount={1}
          totalPages={12}
          disabled={false}
          onChange={handleChange}
      /></Placeholder>
   </>)

};

export default CalendarModule ;
