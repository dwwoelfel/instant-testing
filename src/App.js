import { useState } from "react";

// 1. Import Instant
import { useInit, useQuery, tx, transact, id } from "instant-local-throwaway";

// 2. Get your app id
const APP_ID = "698e42a5-2a0f-43b5-94d6-1316dcdf1ae5";

function App() {
  // 3. Init
  const [isLoading, error, auth] = useInit({
    appId: APP_ID,
    websocketURI: "wss://instant-server.herokuapp.com/api",
    apiURI: "https://instant-server.herokuapp.com/api"
  });
  if (isLoading) {
    return <div>...</div>;
  }
  if (error) {
    return <div>Oi! {error?.message}</div>;
  }
  return <Main />;
}

// 5. Make queries to your heart's content!
// Checkout InstaQL for examples
// https://paper.dropbox.com/doc/InstaQL--BgBK88TTiSE9OV3a17iCwDjCAg-yVxntbv98aeAovazd9TNL
function Main() {
  const data = useQuery({ puns: {} });
  const [punText, setPunText] = useState("");
  const [state, setState] = useState("submission");
  return (
    <div style={{ margin: "auto", width: 720 }}>
      <h1>Welcome to Pundumpster</h1>
      {state === "submission" ? (
        <>
          <div>Submit a pun for a free pun rating.</div> <br />
          <p>
            <textarea
              style={{ fontFamily: "sans-serif" }}
              onChange={(e) => setPunText(e.target.value)}
              cols={80}
              rows={10}
            />
          </p>
          <button
            onClick={(e) => {
              if (punText && punText.trim()) {
                const punId = id();

                transact([tx.puns[punId].update({ text: punText })]);
                setPunText("");
                setState("rating");
              }
            }}
          >
            Submit
          </button>
        </>
      ) : null}
      {state === "rating" ? (
        <>
          <div>Ugh, that was terrible.</div>
        </>
      ) : null}
      {state !== "view" ? (
        <>
          <div style={{ marginTop: 20 }}>
            <button onClick={() => setState("view")}>View submissions</button>
          </div>
        </>
      ) : null}
      {state === "view" ? (
        <>
          <div>
            {data.puns.map((d) => (
              <p key={d.id}>{d.text}</p>
            ))}
            <div style={{ marginTop: 20 }}>
              <button onClick={() => setState("submission")}>
                Contribute a pun
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default App;
