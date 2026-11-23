import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Toggle from "../../../components/Toggle/Toggle";
import AlarmSheet from "../AlarmSheet/AlarmSheet";
import styles from "./AlarmsPage.module.css";
import plusIcon from "../../../assets/icons/plus.svg";
import checkIcon from "../../../assets/icons/check.svg";
import chevronIcon from "../../../assets/icons/chevron.svg";
import { pad, repeatLabel } from "../../../utils";

const MotionDiv = motion.div;

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
        <AnimatePresence initial={false}>
          {alarms.map((alarm) => (
            <MotionDiv
              key={alarm.id}
              layout="position"
              className={editMode ? styles.rowSmall : styles.row}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -60, height: 0, paddingBottom: 0, borderBottomWidth: 0 }}
              transition={{ duration: 0.25 }}
            >
              {editMode && (
                <button className={styles.deleteButton} onClick={() => deleteAlarm(alarm.id)} aria-label="Slet alarm">
                  –
                </button>
              )}

              <button className={styles.time} onClick={() => setAlarmToEdit(alarm)}>
                <span className={alarm.on ? styles.clockOn : styles.clock}>
                  {pad(alarm.hour)}.{pad(alarm.minute)}
                </span>
                <span className={styles.description}>
                  {alarm.description}
                  {alarm.days && alarm.days.length > 0 && ", " + repeatLabel(alarm.days)}
                </span>
              </button>

              {editMode ? (
                <img src={chevronIcon} alt="" />
              ) : (
                <Toggle on={alarm.on} onClick={() => toggleAlarm(alarm.id)} />
              )}
            </MotionDiv>
          ))}
        </AnimatePresence>
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
