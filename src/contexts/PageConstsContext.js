import {createContext} from "react";

const DAILY_PAGE = "daily"
const WEEKLY_PAGE = "weekly"
const PageConstsContext = createContext({DAILY_PAGE, WEEKLY_PAGE})

export default PageConstsContext