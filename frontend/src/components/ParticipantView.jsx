import './Components.css'

export function ParticipantView({participant, key}) {
    return (
        <>
            <div className="participant-view" key={key}>
                <div className="participant-video"></div>
                <div className="participant-name">
                    {participant.displayName}
                </div>
            </div>
        </>
    )
}