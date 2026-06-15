import { useState } from 'react'
import './App.css'

const moods = [
  {
    name: 'Happy',
    emoji: '😊',
    className: 'happy',
    message: 'Your light is showing. Share one kind word today.',
    action:'write down one thing that brighten you up'
  },
  {
    name: 'Calm',
    emoji: '🌙',
    className: 'calm',
    message: 'Soft energy counts too. Move slowly and stay steady.',
    action:'remain composed and calm '
  },
  {
    name: 'Sad',
    emoji: '😔',
    className: 'sad',
    message: 'You are allowed to feel this. One tiny step is still progress.',
    action:'Write down one thing that feels heavy, then close the note.',
  },
  {
    name: 'Brave',
    emoji: '🔥',
    className: 'brave',
    message: 'That spark is real. Pick one thing and begin.',
    action:'brave as a soldier would'
  },
 { name:'fear',
  emoji:'😨',
  className:'fear',
  message: 'do not give up what u dreamt of because your born to achieve big',
  action:'think big , replace with pleasant one'
 },
]

const energyOptions = [10, 25, 50, 75, 100]

const reactions = [
  { label: 'Need comfort', reward: 'Take a slow breath. You are not behind.' },
  { label: 'Ready to focus', reward: 'Great. Choose the smallest task first.' },
  { label: 'Celebrate me', reward: 'Reward unlocked. You showed up today!' },
]

function MoodButton({ mood, isSelected, onPickMood }) {
  return (
    <button
      className={`mood-button ${mood.className} ${isSelected ? 'selected' : ''}`}
      onClick={() => onPickMood(mood)}
    >
      <span>{mood.emoji}</span>
      {mood.name}
    </button>
  )
}

function EnergyButton({ percent, selectedEnergy, onPickEnergy }) {
  return (
    <button
      className={percent === selectedEnergy ? 'energy-chip selected' : 'energy-chip'}
      onClick={() => onPickEnergy(percent)}
    >
      {percent}%
    </button>
  )
}

function ReactionButton({ reaction, isSelected, onPickReaction }) {
  return (
    <button
      className={isSelected ? 'reaction selected' : 'reaction'}
      onClick={() => onPickReaction(reaction)}
    >
      {reaction.label}
    </button>
  )
}

function App() {
  const [selectedMood, setSelectedMood] = useState(moods[0])
  const [energy, setEnergy] = useState(70)
  const [selectedReaction, setSelectedReaction] = useState(reactions[1])
  const [emojiStep, setEmojiStep] = useState(0)
  const [showReward, setShowReward] = useState(false)

  const energyEmojiCount = Math.ceil(energy / 20)
  const hourGlassHeight = `${energy}%`
  const emojiMoveClass = `move-${emojiStep}`

  function playRewardSound() {
    const audioContext = new AudioContext()
    const sound = audioContext.createOscillator()
    const volume = audioContext.createGain()

    sound.type = 'sine'
    sound.frequency.value = 660
    volume.gain.value = 0.08

    sound.connect(volume)
    volume.connect(audioContext.destination)
    sound.start()
    sound.stop(audioContext.currentTime + 0.18)
  }

  function handleReaction(reaction) {
    setSelectedReaction(reaction)
    setEmojiStep((emojiStep + 1) % 4)

    if (reaction.label === 'Celebrate me') {
      setShowReward(true)
      playRewardSound()
    } else {
      setShowReward(false)
    }
  }

  return (
    <main className={`app ${selectedMood.className}`}>
      <section className="pulse-board">
        <div className="intro">
          <p className="eyebrow">Daily Pulse Board</p>
          <h1>How is your inner weather today?</h1>
          <p>
            Pick a mood, choose your energy percent, then click a reaction to
            update the screen.
          </p>
        </div>

        <div className="board-grid">
          <div className="panel">
            <h2>Mood</h2>
            <div className="mood-list">
              {moods.map((mood) => (
                <MoodButton
                  key={mood.name}
                  mood={mood}
                  isSelected={selectedMood.name === mood.name}
                  onPickMood={setSelectedMood}
                />
              ))}
            </div>
          </div>

          <div className="panel energy-panel">
            <h2>Energy</h2>
            <div className="hourglass">
              <div className="hourglass-fill" style={{ height: hourGlassHeight }}></div>
              <span>{energy}%</span>
            </div>
            <div className="energy-emoji">
              {'⚡'.repeat(energyEmojiCount)}
            </div>
            <div className="energy-options">
              {energyOptions.map((percent) => (
                <EnergyButton
                  key={percent}
                  percent={percent}
                  selectedEnergy={energy}
                  onPickEnergy={setEnergy}
                />
              ))}
            </div>
          </div>

          <div className="panel emotion-panel">
            <h2>Emotion</h2>
            <button
              className={`big-emoji ${emojiMoveClass}`}
              onClick={() => setEmojiStep((emojiStep + 1) % 4)}
            >
              {selectedMood.emoji}
            </button>
            <p className="mood-message">{selectedMood.message}</p>
            <p className="daily-action">
              Today's action: {selectedMood.action}
            </p>
            {selectedMood.name === 'Sad' && (
              <p className="comfort-note">
                Small win: drink water, stretch once, and do only the next easy thing.
              </p>
            )}
          </div>
        </div>

        <div className="reaction-row">
          {reactions.map((reaction) => (
            <ReactionButton
              key={reaction.label}
              reaction={reaction}
              isSelected={selectedReaction.label === reaction.label}
              onPickReaction={handleReaction}
            />
          ))}
        </div>

        <section className="result-card">
          <p>{selectedReaction.reward}</p>
          <strong>
            Current pulse: {selectedMood.name} mood with {energy}% energy
          </strong>
        </section>

        {showReward && (
          <div className="fireworks">
            <span>✦</span>
            <span>✺</span>
            <span>✦</span>
            <p>Firework reward unlocked!</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
