import { Navigate } from "react-router-dom";
export default function Protectme({children}) {
    const user_id = sessionStorage.getItem("user_id")

    if (!user_id){
        return <Navigate to = "/"/>
    }
    return children;
}