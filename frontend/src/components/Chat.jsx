import { useContext } from "react"
import { VisibilityContext } from "./VisibilityContext"

export function Chat() {
    const {isVisible} = useContext(VisibilityContext);

    return (
        <>
            {isVisible && 
            <div className="chat">
                <input className="chat-input" type = "text" placeholder="Type here" />
            </div>}
        </>
    )
}