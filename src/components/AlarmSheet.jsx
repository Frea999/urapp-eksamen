import { useState } from "react";
import Sheet from "./Sheet";
import OptionList from "./OptionList";
import NumberWheel from "./NumberWheel";
import Toggle from "./Toggle";
import styles from "./AlarmSheet.module.css";
import chevronIcon from "../assets/icons/chevron.svg";

const days = ["M", "T", "O", "T", "F", "L", "S"];

// Bruges både til "Tilføj alarm" og når man redigerer en alarm
export default function AlarmSheet({ title, alarm, onSave, onClose }) {
  const [hour, setHour] = useState(alarm ? alarm.hour : 10);
  const [minute, setMinute] = useState(alarm ? alarm.minute : 17);
  const [description, setDescription] = useState(alarm ? alarm.description : "Alarm");
  const [sound, setSound] = useState(alarm ? alarm.sound : "Ingen");
  const [snooze, setSnooze] = useState(alarm ? alarm.snooze : true);
  const [snoozeTime, setSnoozeTime] = useState(alarm ? alarm.snoozeTime : 9);
  const [selectedDays, setSelectedDays] = useState([]);
  const [openList, setOpenList] = useState(null); // "description", "sound" eller "snooze"

  function toggleDay(index) {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter((d) => d !== index));
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  }

  function save() {
    onSave({
      id: alarm ? alarm.id : Date.now(),
      hour,
      minute,
      on: true,
      description,
      sound,
      snooze,
      snoozeTime,
    });
    onClose();
  }

  let repeatText = "Aldrig";
  if (selectedDays.length === 7) repeatText = "Hver dag";
  else if (selectedDays.length === 1) repeatText = "1 dag";
  else if (selectedDays.length > 1) repeatText = selectedDays.length + " dage";

  return (
    <>
      <Sheet title={title} onClose={onClose} onSave={save}>
        <div className={styles.picker}>
          <div className={styles.highlight}></div>
          <NumberWheel value={hour} max={23} onChange={setHour} loop />
          <NumberWheel value={minute} max={59} onChange={setMinute} loop />
        </div>

        <div className={styles.card}>
          <div className={styles.row}>
            <span>Gentag</span>
            <span className={styles.gray}>{repeatText}</span>
          </div>
          <div className={styles.days}>
            {days.map((day, index) => (
              <button
                key={index}
                className={selectedDays.includes(index) ? styles.dayOn : styles.day}
                onClick={() => toggleDay(index)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <button className={styles.row} onClick={() => setOpenList("description")}>
            <span>Beskrivelse</span>
            <span className={styles.darkGray}>{description}</span>
          </button>
          <button className={styles.row} onClick={() => setOpenList("sound")}>
            <span>Lyd</span>
            <span className={styles.gray}>
              {sound} <img src={chevronIcon} alt="" />
            </span>
          </button>
          <div className={styles.row}>
            <span>Snooze</span>
            <Toggle on={snooze} onClick={() => setSnooze(!snooze)} />
          </div>
          <button className={styles.row} onClick={() => setOpenList("snooze")}>
            <span>Varighed af snooze</span>
            <span className={styles.orange}>{snoozeTime} min.</span>
          </button>
        </div>
      </Sheet>

      {openList === "description" && (
        <OptionList
          title="Alarmbeskrivelse"
          options={["Alarm", "Arbejde", "Træning", "Påmindelse"]}
          selected={description}
          onSelect={setDescription}
          onClose={() => setOpenList(null)}
        />
      )}

      {openList === "sound" && (
        <OptionList
          title="Lyd"
          options={["Ingen", "Rejse", "Radar", "Signal", "Bølger"]}
          selected={sound}
          onSelect={setSound}
          onClose={() => setOpenList(null)}
        />
      )}

      {openList === "snooze" && (
        <OptionList
          title="Varighed af snooze"
          options={["1 min.", "3 min.", "5 min.", "9 min.", "10 min.", "15 min."]}
          selected={snoozeTime + " min."}
          onSelect={(option) => setSnoozeTime(parseInt(option))}
          onClose={() => setOpenList(null)}
        />
      )}
    </>
  );
}
