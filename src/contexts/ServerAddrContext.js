import { createContext } from "react";

const ServerAddrContext = createContext(process.env.REACT_APP_API_URL);

export default ServerAddrContext