gs = {
    study_metadata: {
        project: "stumpers",
        experiment: "crt-norming",
        experimentIdOSF: "VP2fMCsDAOrm",
        iteration: "v1",
        study_duration: "5-10 minutes",
        num_riddles: 6,
        response_min_chars: 10, // minimum length of response in characters
        response_min_seconds: 5, // minimum time in seconds to answer each riddle
        comprehension_max_attempts: 2, // number of attempts to answer comprehension questions
    },
    // Set to your deployed Cloudflare Worker URL. Set to "" to skip server-side verification (client-only mode)
    verifyWorkerUrl: "https://stumpers-verify.jchu10.workers.dev",
    session_info: {
        condition: "fixed", // "grouped", "mixed", "fixed", "shuffled"
        pot1: undefined, // email_address on landing
        pot2: undefined, // email_address on index
    },
    prolific_info: {
        prolificID: undefined,
        prolificStudyID: undefined,
        prolificSessionID: undefined
    }
}