import { Fragment, useState } from "react";
import "./App.css";

function getVotes(item) {
  return Number.isFinite(item.votes) ? item.votes : 0;
}

function getVotePercent(item, totalVotes) {
  if (totalVotes === 0) {
    return 0;
  }

  return Math.round((getVotes(item) / totalVotes) * 100);
}

const starterItems = [
  {
    id: 1,
    name: "Midnight Door",
    team: "Horror Team",
    theme: "horror",
    description: "A scary trailer with dark mystery scenes",
    votes: 0,
  },
  {
    id: 2,
    name: "Laugh Street",
    team: "Comedy Team",
    theme: "comedy",
    description: "A funny trailer with bright and silly moments",
    votes: 0,
  },
];

function DuelCard({ item, votePercent, isLeader, onVote }) {
  return (
    <article className={`duel-card ${item.theme} ${isLeader ? "leader" : ""}`}>
      <p className="team-label">{item.team}</p>
      <h2>{item.name}</h2>
      <p className="description">{item.description}</p>

      <div className="vote-count">
        <span>{getVotes(item)}</span>
        <p>votes</p>
      </div>

      {isLeader && <p className="leader-badge">Winner</p>}

      <button type="button" onClick={() => onVote(item.id)}>
        Vote {item.name}
      </button>
    </article>
  );
}

function App() {
  const [items, setItems] = useState(starterItems);

  const totalVotes = items.reduce((total, item) => total + getVotes(item), 0);
  const topVotes = Math.max(...items.map((item) => getVotes(item)));
  const leaders = items.filter((item) => getVotes(item) === topVotes);
  const hasVotes = items.some((item) => getVotes(item) > 0);
  const hasOneLeader = hasVotes && leaders.length === 1;
  const leaderText = hasOneLeader
    ? `${leaders[0].name} is leading`
    : "Vote to break the tie";

  function handleVote(id) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, votes: getVotes(item) + 1 } : item,
      ),
    );
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Trailer Showdown</p>
        <h1>Vote for the trailer that wins the showdown</h1>
        <p className="leader-text">{leaderText}</p>
      </section>

      <section className="duel-stage" aria-label="Trailer voting area">
        {items.map((item, index) => (
          <Fragment key={item.id}>
            <DuelCard
              item={item}
              isLeader={hasOneLeader && leaders[0].id === item.id}
              onVote={handleVote}
            />

            {index === 0 && (
              <div className="center-award" aria-hidden="true">
                <div className="medal">VS</div>
                <div className="cup">
                  <span className="cup-bowl"></span>
                  <span className="cup-stem"></span>
                  <span className="cup-base"></span>
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </section>
    </main>
  );
}

export default App;
