import {createContext} from "react";

const DAILY_PAGE = "daily"
const WEEKLY_PAGE = "weekly"
const RECORD_PAGE = "records"
const PageConstsContext = createContext({DAILY_PAGE, WEEKLY_PAGE, RECORD_PAGE})

export default PageConstsContext