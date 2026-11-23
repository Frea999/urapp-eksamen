import { useState } from "react";
import Toggle from "../components/Toggle";
import AlarmSheet from "../components/AlarmSheet";
import styles from "./AlarmsPage.module.css";
import plusIcon from "../assets/icons/plus.svg";
import checkIcon from "../assets/icons/check.svg";
import chevronIcon from "../assets/icons/chevron.svg";

export default function AlarmsPage({ alarms, setAlarms }) {
  const [editMode, setEditMode] = useState(false);
  const [showNewAlarm, setShowNewAlarm] = useState(false);
  const [alarmToEdit, setAlarmToEdit] = useState(null);

  function toggleAlarm(id) {
    setAlarms(alarms.map((alarm) => (alarm.id === id ? { ...alarm, on: !alarm.on } : alarm)));
  }

  function deleteAlarm(id) {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  }

  function saveAlarm(newAlarm) {
    let newList;
    if (alarms.some((alarm) => alarm.id === newAlarm.id)) {
      newList = alarms.map((alarm) => (alarm.id === newAlarm.id ? newAlarm : alarm));
    } else {
      newList = [...alarms, newAlarm];
    }
    // Sorter så den tidligste alarm står øverst
    newList.sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
    setAlarms(newList);
  }

  return (
    <main>
      <div className="top-buttons">
        {editMode ? (
          <button className="circle-button orange-button" onClick={() => setEditMode(false)}>
            <img src={checkIcon} alt="Færdig" />
          </button>
        ) : (
          <button className="pill-button" onClick={() => setEditMode(true)}>
            Rediger
          </button>
        )}
        <button className="circle-button" onClick={() => setShowNewAlarm(true)}>
          <img src={plusIcon} alt="Tilføj alarm" />
        </button>
      </div>

      <h1 className="page-title">Alarmer</h1>

      <div className={styles.list}>
        {alarms.map((alarm) => (
          <div key={alarm.id} className={editMode ? styles.rowSmall : styles.row}>
            {editMode && (
              <button className={styles.deleteButton} onClick={() => deleteAlarm(alarm.id)}>
                –
              </button>
            )}

            <button className={styles.time} onClick={() => setAlarmToEdit(alarm)}>
              <span className={alarm.on ? styles.clockOn : styles.clock}>
                {String(alarm.hour).padStart(2, "0")}.{String(alarm.minute).padStart(2, "0")}
              </span>
              <span className={styles.description}>{alarm.description}</span>
            </button>

            {editMode ? (
              <img src={chevronIcon} alt="" />
            ) : (
              <Toggle on={alarm.on} onClick={() => toggleAlarm(alarm.id)} />
            )}
          </div>
        ))}
      </div>

      {showNewAlarm && (
        <AlarmSheet title="Tilføj alarm" onSave={saveAlarm} onClose={() => setShowNewAlarm(false)} />
      )}

      {alarmToEdit && (
        <AlarmSheet
          title="Søvn | Vågn op"
          alarm={alarmToEdit}
          onSave={saveAlarm}
          onClose={() => setAlarmToEdit(null)}
        />
      )}
    </main>
  );
}
